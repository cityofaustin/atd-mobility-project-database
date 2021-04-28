ALTER TABLE moped_project ADD COLUMN subphase_id integer NULL;

CREATE INDEX moped_project_subphase_id_index
    on moped_project (subphase_id);

-- Create moped_subphases table
CREATE TABLE moped_subphases(
    subphase_id serial not null
        constraint moped_subphases_subphase_id_pkey
            primary key
        constraint moped_subphases_subphase_id_key
            unique,
    subphase_name text not null
        constraint moped_subphases_subphase_name_key
        unique,
    subphase_description text,
    subphase_rank integer,
    subphase_average_length integer,
    required_subphase boolean,
    related_phase_id int
);

-- Create the moped_proj_subphases association table
CREATE TABLE moped_proj_subphases
(
    project_subphase_id serial not null
        constraint moped_project_subphase_id_pkey
            primary key
        constraint moped_project_subphase_id_key
            unique,
    project_id integer not null
        constraint moped_project_subphase_project_id_fkey
            references moped_project
            on update restrict on delete restrict,
    subphase_name text not null,
    subphase_description text,
    subphase_rank integer,
    completion_percentage integer,
    subphase_status text,
    subphase_privacy boolean,
    subphase_start date,
    subphase_end date,
    subphase_priority integer,
    subphase_date_type text,
    subphase_related_phase_id int,
    is_current_subphase boolean,
    completed boolean,
    started_by_user_id integer,
    completed_by_user_id integer,
    date_added timestamp with time zone default clock_timestamp()
);


comment on table moped_subphases is 'Standardized list of project sub-phases';


INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (1, 'Post-inst. study', 10);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (2, 'Procurement', 7);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (3, 'Permitting', 7);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (4, 'Study in progress', 2);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (5, 'Active development review', 1);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (6, 'Below ground construction', 9);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (7, 'Above ground construction', 9);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (8, 'Design by others', 6);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (9, 'Environmental study in progress', 2);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (10, 'Minor modifications in progress', 11);
INSERT INTO public.moped_subphases (subphase_id, subphase_name, related_phase_id) VALUES (11, 'Feasibility study', 1);
