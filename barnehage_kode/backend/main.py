from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from . import data_service, rbac, schemas

app = FastAPI(title="Barnehage Kryssliste API", version="0.1.0")

# Tillat lokal frontend (Live Server) samt default localhost porter.
app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1",
    "http://127.0.0.1:5500",
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/api/departments", response_model=list[schemas.DepartmentResponse])
def get_departments(ctx: rbac.RequestContext = Depends(rbac.get_context)):
  departments = data_service.list_departments()
  children = data_service.list_children()
  child_map = {c["id"]: c for c in children}

  # Rollefilter: staff ser bare sin avdeling; parent ser kun barnenes avdeling; admin ser alle.
  if ctx.role == "staff" and ctx.department_id:
    departments = [d for d in departments if d["id"] == ctx.department_id]

  if ctx.role == "parent" and ctx.parent_id:
    guardian_children = []
    for child in children:
      if ctx.parent_id in child.get("guardian_ids", []):
        guardian_children.append(child)
    guardian_dept_ids = {c["department_id"] for c in guardian_children}
    departments = [d for d in departments if d["id"] in guardian_dept_ids]

  response = []
  for d in departments:
    child_count = len([cid for cid in d.get("child_ids", []) if cid in child_map])
    response.append({"id": d["id"], "name": d["name"], "child_count": child_count})
  return response


@app.get("/api/barn", response_model=list[schemas.ChildListResponse])
def list_children(ctx: rbac.RequestContext = Depends(rbac.get_context)):
  children = data_service.list_children()

  if ctx.role == "admin":
    return children

  if ctx.role == "staff":
    if not ctx.department_id:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST, detail="Staff må sende X-Department header"
      )
    return [c for c in children if c["department_id"] == ctx.department_id]

  if ctx.role == "parent":
    if not ctx.parent_id:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST, detail="Parent må sende X-Parent-Id header"
      )
    return [c for c in children if ctx.parent_id in c.get("guardian_ids", [])]

  return []


@app.get("/api/child/{child_id}", response_model=schemas.ChildDetailResponse)
def get_child(child_id: str, ctx: rbac.RequestContext = Depends(rbac.get_context)):
  rbac.assert_can_view_child(ctx, child_id)
  child = data_service.get_child(child_id)
  if not child:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barn ikke funnet")
  return child


@app.post("/api/checkin", response_model=schemas.CheckinResponse, status_code=status.HTTP_201_CREATED)
def checkin(payload: schemas.CheckinRequest, ctx: rbac.RequestContext = Depends(rbac.get_context)):
  rbac.assert_can_view_child(ctx, payload.child_id)
  saved = data_service.append_checkin(payload.child_id, ctx.role, ctx.parent_id or ctx.department_id)
  return saved


@app.post("/api/checkout", response_model=schemas.CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(payload: schemas.CheckoutRequest, ctx: rbac.RequestContext = Depends(rbac.get_context)):
  rbac.assert_can_view_child(ctx, payload.child_id)
  saved = data_service.append_checkout(payload.child_id, ctx.role, ctx.parent_id or ctx.department_id)
  return saved


# Helsecheck
@app.get("/health")
def health():
  return {"status": "ok"}
