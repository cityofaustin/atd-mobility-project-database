/* Adds the project extent component or generic type */
INSERT INTO
    public.moped_components (component_id, component_name, status_id, component_subtype, line_representation)
    VALUES
        (19, 'Bike Parking', 1, null, false),
        (20, 'Bike Parking', 1, 'Corral', false),
        (21, 'Bike Lane', 1, 'Turn Lane', true),
        (22, 'Bike Lane', 1, 'Wide Curb Lane', true),
        (23, 'Pavement Marking', 1, 'Crossbike', false),
        (24, 'Access Control', 1, 'Driveway Gate', false),
        (25, 'Dynamic Speed Display Device', 1, null, false),
        (26, 'Guardrail', 1, null, true),
        (27, 'Highway', 1, 'Access Ramp', false),
        (28, 'Highway', 1, 'Added Capacity / Lanes', true),
        (29, 'Highway', 1, 'Collector Distributor', true),
        (30, 'Highway', 1, 'Flyover', true),
        (31, 'Highway', 1, 'Intersection Grade Separation', true),
        (32, 'Highway', 1, 'Managed Lane', true),
        (33, 'Highway', 1, 'Toll Road', true),
        (34, 'Landscaping', 1, null, true),
        (35, 'Placemaking', 1, null, true),
        (36, 'Refuge Island', 1, 'Bike', false),
        (37, 'Refuge Island', 1, 'Ped', false),
        (38, 'Refuge Island', 1, 'Bike/Ped', false),
        (39, 'Signal', 1, 'School Zone Beacon', false),
        (40, 'Pavement Marking', 1, 'School Zone', false),
        (41, 'Sidewalk', 1, null, true),
        (42, 'Sidewalk', 1, 'In Street', true),
        (43, 'Sidewalk', 1, 'Wide', true),
        (44, 'Sidewalk', 1, 'With Curb and Gutter', true),
        (45, 'Sidewalk', 1, 'Rams', true),
        (46, 'Speed Management', 1, 'Chicane', false),
        (47, 'Speed Management', 1, 'Nbhd Traffic Circle', false),
        (48, 'Speed Management', 1, 'Speed Cushions (Asphalt)', false),
        (49, 'Speed Management', 1, 'Speed Cushions (Rubber)', false),
        (50, 'Speed Management', 1, 'Speed Humps', false),
        (51, 'Pavement Marking', 1, 'Stop Bar', false),
        (52, 'Transit', 1, 'Lane', true),
        (53, 'Transit', 1, 'Managed Lane Access Point', true),
        (54, 'Transit', 1, 'Transit Queue Jump', true),
        (55, 'Transit', 1, 'Transit/Bike Lane', true),
        (56, 'Pavement Marking', 1, 'Two-stage Bike Turn Queue', false),
        (57, 'Pavement Marking', 1, 'Sharrows', false),
        (58, 'Pavement Marking', 1, 'Sharrows (Wide Curb Lane)', false),
        (59, 'Signage', 1, null, false),
        (0, 'Project Extent - Generic', 1, null, false);
