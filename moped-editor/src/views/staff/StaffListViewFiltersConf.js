import { GridTableFiltersCommonOperators } from "../../components/GridTable/GridTableFiltersCommonOperators";

/**
 * Filter Configuration
 * @constant
 * @type {object}
 * @default
 */
export const StaffListViewFiltersConf = {
  fields: [
    {
      name: "first_name",
      label: "First name",
      placeholder: "Enter first name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "last_name",
      label: "Last name",
      placeholder: "Enter last name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "email",
      label: "E-Mail",
      placeholder: "Enter email",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "title",
      label: "Title",
      placeholder: "Enter title",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "workgroup",
      label: "Workgroup",
      placeholder: "Enter Workgroup",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
