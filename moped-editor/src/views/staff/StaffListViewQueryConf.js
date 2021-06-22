import { newItemButton, editItemButton } from "./StaffListViewCustomComponents";
import { StaffListViewFiltersConf } from "./StaffListViewFiltersConf";
import { StaffListViewExportConf } from "./StaffListViewExportConf";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {Object}
 * @default
 */
export const StaffListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "moped_users",
  customSingleItemButton: editItemButton,
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: true,
  customNewItemButton: newItemButton,
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: StaffListViewFiltersConf,
  export: StaffListViewExportConf,
  search: {
    placeholder: "Search user by email, or select field.",
    defaultField: "email",
  },
  columns: {
    user_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label: "",
      icon: {
        name: "edit_user",
        color: "primary",
      },
      width: "*",
      type: "Int",
    },
    first_name: {
      searchable: true,
      sortable: true,
      label: "First name",
      search: {
        label: "Search by First Name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    last_name: {
      searchable: true,
      sortable: true,
      label: "Last name",
      search: {
        label: "Search by Last Name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    email: {
      searchable: true,
      sortable: false,
      className: null,
      label: "E-Mail",
      search: {
        label: "Search by E-mail",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    date_added: {
      searchable: false,
      sortable: true,
      label: "Date added",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString('en-US', {timeZone: 'UTC'}),
      type: "date_iso",
    },
    title: {
      searchable: true,
      sortable: true,
      label: "Title",
      search: {
        label: "Search by Title",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    workgroup: {
      searchable: true,
      sortable: true,
      label: "Workgroup",
      search: {
        label: "Search by Workgroup",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    cognito_user_id: {
      searchable: false,
      sortable: false,
      label: "Cognito user ID",
      search: {
        label: "Search by Cognito User ID",
        operator: "_eq",
        quoted: true,
        envelope: "{VALUE}",
      },
      type: "String",
    },
    is_coa_staff: {
      searchable: false,
      sortable: true,
      label: "COA staff",
      filter: value => (value === true ? "True" : "False"),
      type: "Boolean",
    },
  },
  order_by: {},
  where: {
    status_id: "_eq: 1"
  },
  limit: 25,
  offset: 0,
};
