/**
  ROLL BACK MIGRATION PROCEDURE

  Note: Deleting data is not a good idea, especially since there is
    existing data that relies on existing values. I suppose it's ok
    if deleting in local, and constraints will probably prevent you
    from deleting FK-protected records, migrations will likely fail.
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
    -- Roll back procurement from post-construction, this is necessary across all environments.
    UPDATE moped_phases
        SET phase_rank = NULL, phase_name = 'procurement'
        WHERE phase_id = 10;

    -- Check if we are in local stage or in the cloud
    IF (currentDatabase = 'local') THEN
        -- Simply drop the values, since they did not exist before this migration.
        DELETE FROM moped_phases WHERE phase_id IN (1,2,3,4,5,6,7,8,9,11);
        -- It's ok in local
    ELSE

        /*
            Unfortunately we have a constraint `moped_phase_history_phase_name_fkey` that gets in the way
            when updating these values, so this is not as clever as you might think.
        */
        -- DELETE FROM moped_phases WHERE phase_id IN (4, 8, 9, 11);
        -- Not needed in staging or prod, leaving it commented in case it's needed.

        /*
            In order to skip the moped_phases_phase_name_key constraint, we are just going to prefix all with temp
            as a temporary measure, so that we don't step on each record toes, then we run any renaming any way we want.
        */
        UPDATE moped_phases SET phase_name = 'temp-complete', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 1;
        UPDATE moped_phases SET phase_name = 'temp-construction', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 2;
        UPDATE moped_phases SET phase_name = 'temp-design', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 3;
        UPDATE moped_phases SET phase_name = 'temp-scoping', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 5;
        UPDATE moped_phases SET phase_name = 'temp-planned', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 6;
        UPDATE moped_phases SET phase_name = 'temp-potential', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 7;
        UPDATE moped_phases SET phase_name = 'temp-procurement', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 10;
        -- Ok, we are clear to make any renames any way we want
        UPDATE moped_phases SET phase_name = 'complete', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 1;
        UPDATE moped_phases SET phase_name = 'construction', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 2;
        UPDATE moped_phases SET phase_name = 'design', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 3;
        UPDATE moped_phases SET phase_name = 'scoping', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 5;
        UPDATE moped_phases SET phase_name = 'planned', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 6;
        UPDATE moped_phases SET phase_name = 'potential', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 7;
        UPDATE moped_phases SET phase_name = 'procurement', phase_description = null, phase_rank = null, phase_average_length = null, required_phase = null WHERE phase_id = 10;
    END IF;

    -- Finally we must re-create the phase_name constraint

    -- Drop the new constraint
    alter table moped_proj_phases drop constraint moped_phase_history_phase_id_fkey;

    -- Replace with old constraint
    alter table moped_proj_phases
	add constraint moped_phase_history_phase_name_fkey
		foreign key (phase_name) references moped_phases (phase_name)
			on update restrict on delete restrict;

-- We are done with the rollback
END $$;
