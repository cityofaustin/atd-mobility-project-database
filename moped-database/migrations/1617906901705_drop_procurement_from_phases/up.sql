/*
  Migration to update moped phases locally and at the cloud.
 */
DO $$
DECLARE
    -- This variable allows us to know if we are in local, staging or production.
    currentDatabase text := (
        SELECT (
            CASE
                WHEN current_database() = 'moped' THEN 'local'
                WHEN current_database() = 'atd_moped_staging' THEN 'staging'
                WHEN current_database() = 'atd_moped' THEN 'production'
                ELSE 'unknown'
            END
        )
    );
BEGIN

    alter table moped_proj_phases drop constraint moped_phase_history_phase_name_fkey;

    alter table moped_proj_phases
        add constraint moped_phase_history_phase_id_fkey
            foreign key (project_phase_id) references moped_phases (phase_id)
                on update restrict on delete restrict;

    -- Reuse existing phase_id: 10 and rename from procurement to post-construction
    UPDATE moped_phases
        SET phase_rank = 10, phase_name = 'post-construction'
        WHERE phase_id = 10;

    -- Check if this is the local environment
    IF (currentDatabase = 'local') THEN
        -- It's local, which means we don't have any other records other than phase_id = 10
        -- Insert the rest of the values
        INSERT INTO public.moped_phases
            (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id)
        VALUES
            ('potential', NULL, 1, NULL, NULL, 1),
            ('planned', NULL, 2, NULL, NULL, 2),
            ('preliminary engineering', NULL, 3, NULL, NULL, 3),
            ('scoping', NULL, 4, NULL, NULL, 4),
            ('preliminary design', NULL, 5, NULL, NULL, 5),
            ('design', NULL, 6, NULL, NULL, 6),
            ('pre-construction', NULL, 7, NULL, NULL, 7),
            ('construction-ready', NULL, 8, NULL, NULL, 8),
            ('construction', NULL, 9, NULL, NULL, 9),
            ('complete', NULL, 11, NULL, NULL, 11);

    -- The database name is either 'atd_moped_staging' for staging or 'atd_moped' for production.
    ELSE
        /*
            FIRST WE WILL UPDATE THE EXISTING VALUES
            Note: This is definite not the best way to do things, the data relationships could be severed.
            However, since we are at the early stages of development, and we have not yet made a full
            data migration from access to moped, we can afford to make these updates without hurting
            any existing records in the database.
        */

        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('complete', null, null, null, null, 1);
        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('construction', null, null, null, null, 2);
        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('design', null, null, null, null, 3);
        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('scoping', null, null, null, null, 5);
        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('planned', null, null, null, null, 6);
        INSERT INTO public.moped_phases (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id) VALUES ('potential', null, null, null, null, 7);

        -- Update existing values, the order of these matter because of the name constraint moped_phases_phase_name_key
        -- which means you cannot rename a phase that already exists in the database. To fix this, you can
        -- play around he order of insertions, but we are just going to rename everything using a prefix, so we can
        -- make any updates we want in any order we want.

        -- Rename using prefix 'temp'
        UPDATE moped_phases SET phase_name = 'temp-complete', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 1;
        UPDATE moped_phases SET phase_name = 'temp-construction', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 2;
        UPDATE moped_phases SET phase_name = 'temp-design', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 3;
        UPDATE moped_phases SET phase_name = 'temp-scoping', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 5;
        UPDATE moped_phases SET phase_name = 'temp-planned', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 6;
        UPDATE moped_phases SET phase_name = 'temp-potential', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 7;

        -- Now update in whatever order we want...
        UPDATE moped_phases SET phase_rank = 1, phase_name = 'potential' WHERE phase_id = 1;
        UPDATE moped_phases SET phase_rank = 2, phase_name = 'planned' WHERE phase_id = 2;
        UPDATE moped_phases SET phase_rank = 3, phase_name = 'preliminary engineering' WHERE phase_id = 3;
        UPDATE moped_phases SET phase_rank = 5, phase_name = 'preliminary design' WHERE phase_id = 5;
        UPDATE moped_phases SET phase_rank = 6, phase_name = 'design' WHERE phase_id = 6;
        UPDATE moped_phases SET phase_rank = 7, phase_name = 'pre-construction' WHERE phase_id = 7;
        /*
            INSERT MISSING VALUES
        */
        -- INSERT: 4, 8, 9, 11
        INSERT INTO public.moped_phases
            (phase_name, phase_description, phase_rank, phase_average_length, required_phase, phase_id)
        VALUES
            ('scoping', NULL, 4, NULL, NULL, 4),
            ('construction-ready', NULL, 8, NULL, NULL, 8),
            ('construction', NULL, 9, NULL, NULL, 9),
            ('complete', NULL, 11, NULL, NULL, 11);

    END IF;

-- We are done with the updates
END $$;
