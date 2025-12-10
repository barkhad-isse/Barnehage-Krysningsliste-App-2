from typing import List, Optional

from pydantic import BaseModel


class Department(BaseModel):
  id: str
  name: str
  child_ids: List[str]


class DepartmentResponse(BaseModel):
  id: int
  name: str
  child_count: int


class Child(BaseModel):
  id: int
  name: str
  avdeling_id: Optional[int] = None
  fodselsdato: Optional[str] = None
  status: Optional[str] = None
  last_checkin: Optional[str] = None
  last_checkout: Optional[str] = None


class ChildListResponse(Child):
  pass


class ChildDetailResponse(Child):
  pass


class CheckinRequest(BaseModel):
  child_id: str


class CheckoutRequest(BaseModel):
  child_id: str


class CheckinResponse(BaseModel):
  child_id: str
  timestamp: str
  by_role: str
  actor_id: Optional[str]


class CheckoutResponse(BaseModel):
  child_id: str
  timestamp: str
  by_role: str
  actor_id: Optional[str]
