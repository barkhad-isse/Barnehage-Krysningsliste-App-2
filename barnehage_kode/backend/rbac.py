from typing import List, Optional

from fastapi import Depends, Header, HTTPException, status

from . import data_service


class RequestContext:
  def __init__(self, role: str, parent_id: Optional[str], department_id: Optional[str]):
    self.role = role
    self.parent_id = parent_id
    self.department_id = department_id


def get_context(
  x_role: Optional[str] = Header(default=None),
  x_parent_id: Optional[str] = Header(default=None),
  x_department: Optional[str] = Header(default=None),
) -> RequestContext:
  if not x_role:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Mangler X-Role header")
  role = x_role.lower()
  if role not in {"parent", "staff", "admin"}:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Ugyldig rolle")

  return RequestContext(role=role, parent_id=x_parent_id, department_id=x_department)


def assert_can_view_child(ctx: RequestContext, child_id: str) -> None:
  child = data_service.get_child(child_id)
  if not child:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barn ikke funnet")

  if ctx.role == "admin":
    return

  if ctx.role == "staff":
    if ctx.department_id and child["department_id"] == ctx.department_id:
      return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Ingen tilgang til dette barnet")

  if ctx.role == "parent":
    guardian_ids: List[str] = child.get("guardian_ids", [])
    if ctx.parent_id and ctx.parent_id in guardian_ids:
      return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forelder har ikke tilgang")
