import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data.json"


def _load_db() -> Dict[str, Any]:
  if not DATA_FILE.exists():
    raise FileNotFoundError(f"Fant ikke datafilen: {DATA_FILE}")
  with DATA_FILE.open("r", encoding="utf-8") as f:
    return json.load(f)


def _save_db(db: Dict[str, Any]) -> None:
  with DATA_FILE.open("w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)


def list_departments() -> List[Dict[str, Any]]:
  db = _load_db()
  return db.get("departments", [])


def list_children() -> List[Dict[str, Any]]:
  db = _load_db()
  return db.get("children", [])


def get_child(child_id: str) -> Optional[Dict[str, Any]]:
  db = _load_db()
  return next((c for c in db.get("children", []) if c["id"] == child_id), None)


def list_guardians() -> List[Dict[str, Any]]:
  db = _load_db()
  return db.get("guardians", [])


def append_checkin(child_id: str, by_role: str, actor_id: Optional[str]) -> Dict[str, Any]:
  db = _load_db()
  timestamp = datetime.now(timezone.utc).isoformat()

  checkin = {"child_id": child_id, "timestamp": timestamp, "by_role": by_role, "actor_id": actor_id}
  db.setdefault("checkins", []).append(checkin)

  for child in db.get("children", []):
    if child["id"] == child_id:
      child["status"] = "checked_in"
      child["last_checkin"] = timestamp
      break

  _save_db(db)
  return checkin


def append_checkout(child_id: str, by_role: str, actor_id: Optional[str]) -> Dict[str, Any]:
  db = _load_db()
  timestamp = datetime.now(timezone.utc).isoformat()

  checkout = {"child_id": child_id, "timestamp": timestamp, "by_role": by_role, "actor_id": actor_id}
  db.setdefault("checkouts", []).append(checkout)

  for child in db.get("children", []):
    if child["id"] == child_id:
      child["status"] = "checked_out"
      child["last_checkout"] = timestamp
      break

  _save_db(db)
  return checkout


def get_guardian(guardian_id: str) -> Optional[Dict[str, Any]]:
  db = _load_db()
  return next((g for g in db.get("guardians", []) if g["id"] == guardian_id), None)
