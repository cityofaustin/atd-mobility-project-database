-- Make updates to the database
UPDATE moped_status SET status_name = 'on-hold'  WHERE status_id = 5;
INSERT INTO moped_status (status_name, status_id) VALUES ('archived', 6);
