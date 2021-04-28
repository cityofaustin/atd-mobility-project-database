-- Roll back changes
ALTER TABLE moped_project DROP COLUMN subphase_id;
DROP INDEX moped_project_subphase_id_index;
DROP TABLE moped_subphases;
DROP TABLE moped_proj_subphases;
