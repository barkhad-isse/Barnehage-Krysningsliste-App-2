from datetime import datetime
from typing import Dict, List, Optional, Sequence

from sqlalchemy import bindparam, text
from sqlalchemy.engine import Row


def _normalize_int(value: Optional[str | int]) -> Optional[int]:
  if isinstance(value, int):
    return value
  if value is None:
    return None
  try:
    return int(value)
  except (TypeError, ValueError):
    return None


def _rows_to_guardian_map(session, child_ids: Sequence[int]) -> Dict[int, List[int]]:
  if not child_ids:
    return {}
  rows = session.execute(
    text(
      """
      SELECT fb.barn_id, fb.forelder_id
      FROM forelder_barn fb
      WHERE fb.barn_id IN :ids
      """
    ).bindparams(bindparam("ids", expanding=True)),
    {"ids": list(child_ids)},
  ).all()
  guardian_map: Dict[int, List[int]] = {}
  for barn_id, forelder_id in rows:
    guardian_map.setdefault(barn_id, []).append(forelder_id)
  return guardian_map


def _rows_to_log_map(session, child_ids: Sequence[int]) -> Dict[int, Dict[str, Optional[str]]]:
  if not child_ids:
    return {}

  rows = session.execute(
    text(
      """
      SELECT barn_id, sjekket_inn_tid, sjekket_ut_tid
      FROM innsjekk_utsjekk
      WHERE barn_id IN :ids
      ORDER BY sjekket_inn_tid DESC
      """
    ).bindparams(bindparam("ids", expanding=True)),
    {"ids": list(child_ids)},
  ).all()

  data: Dict[int, Dict[str, Optional[str]]] = {}
  for barn_id, inn_tid, ut_tid in rows:
    entry = data.setdefault(barn_id, {"last_checkin": None, "last_checkout": None})
    if entry["last_checkin"] is None and inn_tid is not None:
      entry["last_checkin"] = inn_tid.isoformat()
    if entry["last_checkout"] is None and ut_tid is not None:
      entry["last_checkout"] = ut_tid.isoformat()
    if entry["last_checkin"] and entry["last_checkout"]:
      continue
  return data


def _serialize_child(row: Row, guardian_map: Dict[int, List[int]], log_map: Dict[int, Dict[str, Optional[str]]]) -> Dict[str, object]:
  barn_id = row.barn_id
  avdeling_id = row.avdeling_id
  logs = log_map.get(barn_id, {})
  last_in = logs.get("last_checkin")
  last_out = logs.get("last_checkout")

  if last_in and (not last_out or last_in > last_out):
    status = "checked_in"
  elif last_out:
    status = "checked_out"
  else:
    status = "not_arrived"

  return {
    "id": barn_id,
    "name": row.navn,
    "avdeling_id": avdeling_id,
    "fodselsdato": row.fodselsdato.isoformat() if row.fodselsdato else None,
    "status": status,
    "last_checkin": last_in,
    "last_checkout": last_out,
    "guardian_ids": guardian_map.get(barn_id, []),
  }


def list_departments(session) -> List[Dict[str, object]]:
  rows = session.execute(
    text(
      """
      SELECT a.avdeling_id AS id, a.navn AS name, COUNT(b.barn_id) AS child_count
      FROM avdeling a
      LEFT JOIN barn b ON b.avdeling_id = a.avdeling_id
      GROUP BY a.avdeling_id, a.navn
      ORDER BY a.avdeling_id
      """
    )
  ).mappings().all()
  return [dict(row) for row in rows]


def list_children_for_role(session, role: str, department_id: Optional[int], parent_id: Optional[int]) -> List[Dict[str, object]]:
  params: Dict[str, object] = {}
  where_clause = ""

  if role == "staff":
    dep_id = _normalize_int(department_id)
    if dep_id is None:
      return []
    where_clause = "WHERE b.avdeling_id = :dep_id"
    params["dep_id"] = dep_id
  elif role == "parent":
    parent = _normalize_int(parent_id)
    if parent is None:
      return []
    where_clause = "JOIN forelder_barn fb ON fb.barn_id = b.barn_id WHERE fb.forelder_id = :parent_id"
    params["parent_id"] = parent

  rows = session.execute(
    text(
      f"""
      SELECT b.barn_id, b.avdeling_id, b.navn, b.fodselsdato
      FROM barn b
      {where_clause}
      ORDER BY b.barn_id
      """
    ),
    params,
  ).all()

  child_ids = [r.barn_id for r in rows]
  guardian_map = _rows_to_guardian_map(session, child_ids)
  log_map = _rows_to_log_map(session, child_ids)

  return [_serialize_child(r, guardian_map, log_map) for r in rows]


def get_child(session, child_id: int | str) -> Optional[Dict[str, object]]:
  cid = _normalize_int(child_id)
  if cid is None:
    return None

  row = session.execute(
    text(
      """
      SELECT b.barn_id, b.avdeling_id, b.navn, b.fodselsdato
      FROM barn b
      WHERE b.barn_id = :cid
      """
    ),
    {"cid": cid},
  ).first()
  if not row:
    return None

  guardian_map = _rows_to_guardian_map(session, [cid])
  log_map = _rows_to_log_map(session, [cid])
  return _serialize_child(row, guardian_map, log_map)


def add_checkin(session, child_id: int | str, actor_id: Optional[int], by_role: str = "staff") -> Optional[Dict[str, object]]:
  cid = _normalize_int(child_id)
  if cid is None:
    return None

  now = datetime.utcnow()
  session.execute(
    text(
      """
      INSERT INTO innsjekk_utsjekk (barn_id, bruker_id, sjekket_inn_tid, kommentar)
      VALUES (:cid, :actor_id, :inn_tid, NULL)
      """
    ),
    {"cid": cid, "actor_id": actor_id, "inn_tid": now},
  )
  session.commit()

  return {
    "child_id": cid,
    "timestamp": now.isoformat(),
    "by_role": by_role,
    "actor_id": actor_id,
  }


def add_checkout(session, child_id: int | str, actor_id: Optional[int], by_role: str = "staff") -> Optional[Dict[str, object]]:
  cid = _normalize_int(child_id)
  if cid is None:
    return None

  now = datetime.utcnow()
  open_row = session.execute(
    text(
      """
      SELECT logg_id FROM innsjekk_utsjekk
      WHERE barn_id = :cid AND sjekket_ut_tid IS NULL
      ORDER BY sjekket_inn_tid DESC
      LIMIT 1
      """
    ),
    {"cid": cid},
  ).first()

  if open_row:
    session.execute(
      text(
        """
        UPDATE innsjekk_utsjekk
        SET sjekket_ut_tid = :ut_tid
        WHERE logg_id = :logg_id
        """
      ),
      {"ut_tid": now, "logg_id": open_row.logg_id},
    )
  else:
    session.execute(
      text(
        """
        INSERT INTO innsjekk_utsjekk (barn_id, bruker_id, sjekket_inn_tid, sjekket_ut_tid)
        VALUES (:cid, :actor_id, :inn_tid, :ut_tid)
        """
      ),
      {"cid": cid, "actor_id": actor_id, "inn_tid": now, "ut_tid": now},
    )

  session.commit()

  return {
    "child_id": cid,
    "timestamp": now.isoformat(),
    "by_role": by_role,
    "actor_id": actor_id,
  }


def add_comment(session, child_id: int | str, actor_id: Optional[int], by_role: str, comment: str) -> Optional[Dict[str, object]]:
  cid = _normalize_int(child_id)
  if cid is None:
    return None
  now = datetime.utcnow()
  session.execute(
    text(
      """
      INSERT INTO innsjekk_utsjekk (barn_id, bruker_id, sjekket_inn_tid, kommentar)
      VALUES (:cid, :actor_id, :inn_tid, :comment)
      """
    ),
    {"cid": cid, "actor_id": actor_id, "inn_tid": now, "comment": comment},
  )
  session.commit()
  return {
    "child_id": cid,
    "timestamp": now.isoformat(),
    "by_role": by_role,
    "actor_id": actor_id,
    "comment": comment,
  }
