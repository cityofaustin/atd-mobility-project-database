ALTER TABLE "public"."moped_components" DROP COLUMN "date_added" CASCADE;
ALTER TABLE "public"."moped_components" DROP COLUMN "component_order" CASCADE;
ALTER TABLE "public"."moped_components" ADD COLUMN "component_subtype" text NOT NULL;
ALTER TABLE "public"."moped_components" ADD COLUMN "line_representation" bool NOT NULL DEFAULT FALSE;


INSERT INTO moped_components (
    component_name,component_subtype,line_representation,status_id
) VALUES
    ('Access Control', 'Driveway Closure', 'TRUE', 1),
    ('Access Control', 'Driveway Modification', 'TRUE', 1),
    ('Access Control', 'Hardened Centerline', 'TRUE', 1),
    ('Access Control', 'Median', 'TRUE', 1),
    ('Bike Box', ' ', 'FALSE', 1),
    ('Bike Lane', ' ', 'TRUE', 1),
    ('Bike Lane', 'Buffered', 'TRUE', 1),
    ('Bike Lane', 'Climbing', 'TRUE', 1),
    ('Bike Lane', 'Colored', 'TRUE', 1),
    ('Bike Lane', 'Contraflow', 'TRUE', 1),
    ('Bike Lane', 'Protected One-Way', 'TRUE', 1),
    ('Bike Lane', 'Protected Two-Way', 'TRUE', 1),
    ('Crossswalk', 'Continental', 'FALSE', 1),
    ('Crossswalk', 'Creative', 'FALSE', 1),
    ('Crossswalk', 'Raised', 'FALSE', 1),
    ('Signal', 'PHB', 'FALSE', 1),
    ('Signal', 'RRFB', 'FALSE', 1),
    ('Signal', 'Traffic', 'FALSE', 1);