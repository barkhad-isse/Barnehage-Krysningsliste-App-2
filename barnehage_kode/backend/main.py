from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from . import db_service, rbac, schemas
from .db.connection import get_session
from sqlalchemy.orm import Session

app = FastAPI(title="Barnehage Kryssliste API", version="0.1.0")

# Tillat lokal frontend (Live Server) samt default localhost porter.
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/api/departments", response_model=list[schemas.DepartmentResponse])
def get_departments(ctx: rbac.RequestContext = Depends(rbac.get_context), session: Session = Depends(get_session)):
  departments = db_service.list_departments(session)

  if ctx.role == "staff" and ctx.department_id:
    departments = [d for d in departments if d["id"] == ctx.department_id]

  if ctx.role == "parent" and ctx.parent_id:
    children = db_service.list_children_for_role(session, "parent", None, ctx.parent_id)
    dept_ids = {c["avdeling_id"] for c in children}
    departments = [d for d in departments if d["id"] in dept_ids]

  return departments


@app.get("/api/barn", response_model=list[schemas.ChildListResponse])
def list_children(ctx: rbac.RequestContext = Depends(rbac.get_context), session: Session = Depends(get_session)):
  children = db_service.list_children_for_role(session, ctx.role, ctx.department_id, ctx.parent_id)

  if ctx.role == "staff" and not ctx.department_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Staff må sende X-Department header")
  if ctx.role == "parent" and not ctx.parent_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Parent må sende X-Parent-Id header")

  return children


@app.get("/api/child/{child_id}", response_model=schemas.ChildDetailResponse)
def get_child(child_id: int, ctx: rbac.RequestContext = Depends(rbac.get_context), session: Session = Depends(get_session)):
  rbac.assert_can_view_child(ctx, child_id, session)
  child = db_service.get_child(session, child_id)
  if not child:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barn ikke funnet")
  return child


@app.post("/api/checkin", response_model=schemas.CheckinResponse, status_code=status.HTTP_201_CREATED)
def checkin(payload: schemas.CheckinRequest, ctx: rbac.RequestContext = Depends(rbac.get_context), session: Session = Depends(get_session)):
  rbac.assert_can_view_child(ctx, payload.child_id, session)
  if not ctx.user_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mangler X-User-Id for logging")
  saved = db_service.add_checkin(session, payload.child_id, ctx.user_id)
  return saved


@app.post("/api/checkout", response_model=schemas.CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(payload: schemas.CheckoutRequest, ctx: rbac.RequestContext = Depends(rbac.get_context), session: Session = Depends(get_session)):
  rbac.assert_can_view_child(ctx, payload.child_id, session)
  if not ctx.user_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mangler X-User-Id for logging")
  saved = db_service.add_checkout(session, payload.child_id, ctx.user_id)
  return saved


# Helsecheck
@app.get("/health")
def health():
  return {"status": "ok"}
