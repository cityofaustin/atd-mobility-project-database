export const GridTableFiltersCommonOperators = {
  string_contains_case_insensitive: {
    operator: "_ilike",
    label: "contains",
    description: "String is contained in field (case-insensitive)",
    /*
       Envelope:
         % sign is used to pattern match any sequence of zero or more characters.
         _ sign is used to match any single character.
         {VALUE} is exactly the value of the entered string
     */
    envelope: "%{VALUE}%",
    type: "string",
  },
  string_contains_not_case_insensitive: {
    operator: "_nilike",
    label: "contains not",
    description: "String is NOT contained in field (case-insensitive)",
    envelope: "%{VALUE}%",
    type: "string",
  },
  string_is_null: {
    operator: "_is_null",
    label: "is blank",
    description: "Selected field is null",
    envelope: "true",
    type: "string",
  },
  string_is_not_null: {
    operator: "_is_null",
    label: "is not blank",
    description: "String field is not null",
    envelope: "false",
    type: "string",
  },
  string_begins_with_case_insensitive: {
    operator: "_ilike",
    label: "begins with",
    description: "Field content begins with string (case-insensitive)",
    envelope: "{VALUE}%",
    type: "string",
  },
  string_ends_with_case_insensitive: {
    operator: "_ilike",
    label: "ends with",
    description: "Field content ends with string (case-insensitive)",
    envelope: "%{VALUE}",
    type: "string",
  },
  string_equals_case_insensitive: {
    operator: "_ieq",
    label: "is",
    description: "Field content equals string (case-insensitive)",
    envelope: null,
    type: "string",
  },
  number_equals: {
    operator: "_eq",
    label: "is",
    description: "The field value is equal to number.",
    envelope: null,
    type: "number",
  },
  number_greater_than: {
    operator: "_gt",
    label: "greater than",
    description: "The field value is greater than number and not equal.",
    envelope: null,
    type: "number",
  },
  number_greater_than_equal_to: {
    operator: "_gte",
    label: "greater than or equal to",
    description: "The number is less than or equal to.",
    envelope: null,
    type: "number",
  },
  number_less_than: {
    operator: "_lt",
    label: "less than",
    description: "The field value is less than number and not equal.",
    envelope: null,
    type: "number",
  },
  number_less_than_equal_to: {
    operator: "_lte",
    label: "less than or equal to",
    description: "The number is less than or equal to.",
    envelope: null,
    type: "number",
  },
  date_equal_to: {
    operator: "_eq",
    label: "is",
    description: "The date is equal to.",
    envelope: null,
    type: "date",
  },
  date_greater_than: {
    operator: "_gt",
    label: "greater than",
    description: "The date is greater than.",
    envelope: null,
    type: "date",
  },
  date_greater_than_equal_to: {
    operator: "_gte",
    label: "greater than or equal to",
    description: "The date is greater than or equal to.",
    envelope: null,
    type: "date",
  },
  date_less_than: {
    operator: "_lt",
    label: "less than",
    description: "The date is less than.",
    envelope: null,
    type: "date",
  },
  date_less_than_equal_to: {
    operator: "_lt",
    label: "less than or equal to",
    description: "The date is less than.",
    envelope: null,
    type: "date",
  },
};
