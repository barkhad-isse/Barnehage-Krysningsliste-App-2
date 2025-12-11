# Barnehage Krysningsliste

Enkel fullstack-app (FastAPI + MySQL + statisk frontend) for inn-/utkryssing, avdelingsoversikt og foreldrevisning.

## Forutsetninger
- Python 3.12 + pip
- MySQL kjører med databasen `barnehage_db` og skjemaet fra repoets SQL (rolle, avdeling, bruker, ansatt, forelder, forelder_barn, barn, innsjekk_utsjekk).
- `.env` i `barnehage_kode/` med DB-parametere (se `.env.example`).

## Installasjon
```bash
cd /path/to/Barnehage-Krysningsliste-App-2
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r barnehage_kode/backend/requirements.txt
```

## Kjøre backend (API)
```bash
cd /path/to/Barnehage-Krysningsliste-App-2
source .venv/bin/activate
uvicorn barnehage_kode.backend.main:app --reload
```
Helsecheck: `curl http://localhost:8000/health` → `{"status":"ok"}`.

## Klargjør database (MySQL)
1) Sørg for at MySQL kjører og at `.env` i `barnehage_kode/` peker til riktig bruker/pass/host/port.
2) Kjør schema og seed-data (oppretter `barnehage_db`):
```bash
mysql -u <user> -p < barnehage_kode/backend/schema.sql
```
Dette lager tabeller (rolle, avdeling, bruker, ansatt, forelder, forelder_barn, barn, innsjekk_utsjekk) og fyller demo-data.

## Kjøre frontend (statisk)
```bash
cd /path/to/Barnehage-Krysningsliste-App-2/barnehage_kode/frontend
python -m http.server 5500
```
Åpne i nettleser:
- Ansatt: `http://127.0.0.1:5500/staff_departments.html`
- Forelder: `http://127.0.0.1:5500/parent_dashboard.html`

## Påkrevde headere (API)
- `X-Role`: `admin` | `staff` | `parent`
- For `staff`: `X-Department` = avdeling_id
- For `parent`: `X-Parent-Id` = forelder_id
- Ved checkin/checkout/comment: `X-User-Id` = bruker_id for aktuell bruker

## Datamodell (kort)
- `barn` (barn_id, avdeling_id, navn, fødselsdato)
- `forelder` + `forelder_barn` (relasjoner)
- `innsjekk_utsjekk` (sjekket_inn_tid, sjekket_ut_tid, kommentar, bruker_id)
- `bruker`/`rolle` for autentiseringsinfo (her brukt som ID-er via headere).

## Kjente begrensninger
- Statusen «Kommer senere» lagres ikke i DB (ingen kolonne/endepunkt for det ennå).
- Kommentarer lagres i `innsjekk_utsjekk` med sjekket_inn_tid (ingen separat meldings-tabell).

## Tips ved feil
- 404 på barn: sjekk at `barn_id` finnes i `barn`.
- 500 på checkin/checkout: verifiser at `X-User-Id` finnes i `bruker` og FK-er er gyldige.
- CORS/timeout: sørg for at backend kjører på port 8000, frontend på 5500, og hard-reload nettleseren.
