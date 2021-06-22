CREATE TABLE "public"."moped_subcomponents" (
    "subcomponent_id" serial NOT NULL,
    "subcomponent_name" text NOT NULL,
    "component_id" integer NOT NULL,
    PRIMARY KEY ("subcomponent_id") ,
        FOREIGN KEY ("component_id")
            REFERENCES "public"."moped_components" ("component_id")
                ON UPDATE cascade ON DELETE cascade
);

INSERT INTO moped_subcomponents (
    subcomponent_id, subcomponent_name, component_id
) VALUES
    (1, 'Raised pavement markers', 1),
    (2, 'Audible push button', 2),
    (3, 'Bicycle signal', 3),
    (4, 'Leading pedestrian interval', 4);

