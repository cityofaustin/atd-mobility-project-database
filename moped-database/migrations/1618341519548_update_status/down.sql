-- Revert the changes made to the database
UPDATE moped_status SET status_name = 'hold' WHERE status_id = 5;
DELETE FROM moped_status WHERE status_id = 6;
