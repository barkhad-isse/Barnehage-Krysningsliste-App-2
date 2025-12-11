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
  guardian_ids: List[int] = []
  guardians: List["Guardian"] = []


class CheckinRequest(BaseModel):
  child_id: int


class CheckoutRequest(BaseModel):
  child_id: int


class CheckinResponse(BaseModel):
  child_id: int
  timestamp: str
  by_role: str
  actor_id: Optional[int]


class CheckoutResponse(BaseModel):
  child_id: int
  timestamp: str
  by_role: str
  actor_id: Optional[int]


class Guardian(BaseModel):
  id: int
  name: str
  relasjon: Optional[str] = None
  telefon: Optional[str] = None


ChildDetailResponse.update_forward_refs()
