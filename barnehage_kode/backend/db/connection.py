import os
from functools import lru_cache
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Load .env from repo root (barnehage_kode/.env) if present
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)


@lru_cache
def _database_url() -> str:
  host = os.getenv("DB_HOST", "localhost")
  port = os.getenv("DB_PORT", "3306")
  user = os.getenv("DB_USER", "root")
  password = os.getenv("DB_PASSWORD", "root123")
  name = os.getenv("DB_NAME", "barnehage_db")
  return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"


@lru_cache
def get_engine():
  url = _database_url()
  return create_engine(url, pool_pre_ping=True, future=True)


def get_session():
  engine = get_engine()
  SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()


def test_connection() -> Optional[float]:
  """
  Returnerer serverversjonen som et tall hvis tilkobling lykkes, ellers kaster exception.
  Brukes kun som sanity-check under utvikling.
  """
  engine = get_engine()
  with engine.connect() as conn:
    result = conn.execute("SELECT VERSION()").scalar()
    return result
