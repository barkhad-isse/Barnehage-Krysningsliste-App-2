-- Database setup for Barnehage Krysningsliste
-- Creates barnehage_db with tables and seed data

CREATE DATABASE IF NOT EXISTS barnehage_db;
USE barnehage_db;

CREATE TABLE IF NOT EXISTS rolle (
  rolle_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  navn VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (rolle_id)
);

CREATE TABLE IF NOT EXISTS avdeling (
  avdeling_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  navn VARCHAR(100) NOT NULL,
  maks_antall_barn INT UNSIGNED,
  beskrivelse TEXT,
  PRIMARY KEY (avdeling_id)
);

CREATE TABLE IF NOT EXISTS bruker (
  bruker_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  epost VARCHAR(255) NOT NULL UNIQUE,
  passord_hash VARCHAR(255) NOT NULL,
  rolle_id INT UNSIGNED NOT NULL,
  aktiv BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (bruker_id),
  FOREIGN KEY (rolle_id) REFERENCES rolle(rolle_id)
);

CREATE TABLE IF NOT EXISTS ansatt (
  ansatt_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  bruker_id INT UNSIGNED NOT NULL UNIQUE,
  avdeling_id INT UNSIGNED,
  navn VARCHAR(100) NOT NULL,
  etternavn VARCHAR(100) NOT NULL,
  telefon VARCHAR(50),
  PRIMARY KEY (ansatt_id),
  FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
  FOREIGN KEY (avdeling_id) REFERENCES avdeling(avdeling_id)
);

CREATE TABLE IF NOT EXISTS forelder (
  forelder_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  bruker_id INT UNSIGNED NOT NULL UNIQUE,
  navn VARCHAR(100) NOT NULL,
  etternavn VARCHAR(100) NOT NULL,
  telefon VARCHAR(50),
  relasjon VARCHAR(50),
  PRIMARY KEY (forelder_id),
  FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
);

CREATE TABLE IF NOT EXISTS barn (
  barn_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  avdeling_id INT UNSIGNED,
  navn VARCHAR(100) NOT NULL,
  fødselsdato DATE NOT NULL,
  PRIMARY KEY (barn_id),
  FOREIGN KEY (avdeling_id) REFERENCES avdeling(avdeling_id)
);

CREATE TABLE IF NOT EXISTS forelder_barn (
  forelder_id INT UNSIGNED NOT NULL,
  barn_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (forelder_id, barn_id),
  FOREIGN KEY (forelder_id) REFERENCES forelder(forelder_id),
  FOREIGN KEY (barn_id) REFERENCES barn(barn_id)
);

CREATE TABLE IF NOT EXISTS innsjekk_utsjekk (
  logg_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  barn_id INT UNSIGNED NOT NULL,
  bruker_id INT UNSIGNED NOT NULL,
  sjekket_inn_tid DATETIME NOT NULL,
  sjekket_ut_tid DATETIME,
  kommentar TEXT,
  PRIMARY KEY (logg_id),
  FOREIGN KEY (barn_id) REFERENCES barn(barn_id),
  FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
);

-- Seed data
INSERT INTO rolle (rolle_id, navn) VALUES
  (1, 'Leder'),
  (2, 'Ansatt'),
  (3, 'Forelder')
ON DUPLICATE KEY UPDATE navn = VALUES(navn);

INSERT INTO avdeling (avdeling_id, navn, maks_antall_barn, beskrivelse) VALUES
  (10, 'Ekorn-Gruppa', 15, 'For barn 1-2 år'),
  (11, 'Ugla-Gruppa', 20, 'For barn 3-4 år'),
  (12, 'Rev-Gruppa', 20, 'For barn 5-6 år')
ON DUPLICATE KEY UPDATE navn = VALUES(navn), maks_antall_barn = VALUES(maks_antall_barn), beskrivelse = VALUES(beskrivelse);

INSERT INTO bruker (bruker_id, rolle_id, epost, passord_hash) VALUES
  (1, 1, 'leder@demo.no', '$passhash_leder_123'),
  (2, 2, 'ansatt2@demo.no', '$passhash_ansatt_abc'),
  (3, 2, 'ansatt3@demo.no', '$passhash_ansatt_xyz'),
  (4, 3, 'forelder1@demo.no', '$hash_f1'),
  (5, 3, 'forelder2@demo.no', '$hash_f2'),
  (6, 3, 'forelder3@demo.no', '$hash_f3'),
  (7, 3, 'forelder4@demo.no', '$hash_f4'),
  (8, 3, 'forelder5@demo.no', '$hash_f5'),
  (9, 3, 'forelder6@demo.no', '$hash_f6')
ON DUPLICATE KEY UPDATE epost = VALUES(epost), passord_hash = VALUES(passord_hash), rolle_id = VALUES(rolle_id);

INSERT INTO ansatt (ansatt_id, bruker_id, avdeling_id, navn, etternavn, telefon) VALUES
  (100, 1, 10, 'Sigrid', 'Larsen', '90011200'),
  (101, 2, 11, 'Kari', 'Nilsen', '90022300'),
  (102, 3, 12, 'Per', 'Olsen', '90033400')
ON DUPLICATE KEY UPDATE avdeling_id = VALUES(avdeling_id), navn = VALUES(navn), etternavn = VALUES(etternavn), telefon = VALUES(telefon);

INSERT INTO forelder (forelder_id, bruker_id, navn, etternavn, telefon, relasjon) VALUES
  (200, 4, 'Anna', 'Hansen', '92010100', 'Mor'),
  (201, 5, 'Lars', 'Hansen', '92020200', 'Far'),
  (202, 6, 'Tone', 'Jensen', '93030300', 'Mor'),
  (203, 7, 'Svein', 'Karlsen', '94040400', 'Far'),
  (204, 8, 'Mona', 'Solberg', '95050500', 'Mor'),
  (205, 9, 'Erik', 'Solberg', '96060600', 'Far')
ON DUPLICATE KEY UPDATE navn = VALUES(navn), etternavn = VALUES(etternavn), telefon = VALUES(telefon), relasjon = VALUES(relasjon);

INSERT INTO barn (barn_id, avdeling_id, navn, fødselsdato) VALUES
  (300, 10, 'Ola', '2024-01-15'),
  (301, 10, 'Ida', '2023-08-20'),
  (302, 11, 'Markus', '2021-03-01'),
  (303, 11, 'Silje', '2020-11-10'),
  (304, 12, 'Emil', '2019-05-25'),
  (305, 12, 'Frida', '2019-04-12')
ON DUPLICATE KEY UPDATE avdeling_id = VALUES(avdeling_id), navn = VALUES(navn), fødselsdato = VALUES(fødselsdato);

INSERT INTO forelder_barn (forelder_id, barn_id) VALUES
  (200, 300),
  (201, 300),
  (200, 301),
  (202, 302),
  (202, 303),
  (203, 304),
  (204, 305),
  (205, 305)
ON DUPLICATE KEY UPDATE forelder_id = VALUES(forelder_id), barn_id = VALUES(barn_id);

INSERT INTO innsjekk_utsjekk (barn_id, bruker_id, sjekket_inn_tid, sjekket_ut_tid, kommentar) VALUES
  (300, 4, '2025-12-09 08:15:00', NULL, 'Normal levering.'),
  (300, 2, '2025-12-09 08:15:00', '2025-12-09 15:30:00', NULL),
  (302, 2, '2025-12-09 07:45:00', NULL, 'Litt trøtt i dag.')
ON DUPLICATE KEY UPDATE sjekket_inn_tid = VALUES(sjekket_inn_tid), sjekket_ut_tid = VALUES(sjekket_ut_tid), kommentar = VALUES(kommentar), bruker_id = VALUES(bruker_id);
