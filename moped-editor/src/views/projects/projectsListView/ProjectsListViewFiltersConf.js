import { GridTableFiltersCommonOperators } from "../../../components/GridTable/GridTableFiltersCommonOperators";

/**
 * Filter Configuration
 * @constant
 * @type {object}
 * @default
 */
export const ProjectsListViewFiltersConf = {
  fields: [
    {
      name: "project_name",
      label: "Project name",
      placeholder: "Enter project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_description",
      label: "Project description",
      placeholder: "Enter project description",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_id",
      label: "Project ID",
      placeholder: "Type Project ID number",
      type: "number",
      defaultOperator: "number_equals",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "start_date",
      label: "Start date",
      placeholder: "Select date",
      type: "date",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "current_status",
      label: "Currrent status",
      placeholder: "Current status",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "current_phase",
      label: "Currrent phase",
      placeholder: "Current phase",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_team_members",
      label: "Team member",
      placeholder: "Team member",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        // Because of the way the SQL view concatanates the team members and roles
        // " :" is always present even if there are no team members present
        "string_is_null_special_case",
        "string_is_not_null_special_case",
      ],
    },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
