import React from "react";
import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";
import { ProjectsListViewExportConf } from "./ProjectsListViewExportConf";
import ExternalLink from "../../../components/ExternalLink";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {object}
 * @augments ProjectsListViewFiltersConf
 * @default
 */
export const ProjectsListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "project_list_view",
  single_item: "/moped/projects",
  new_item: "/moped/projects/new",
  new_item_label: "New Project",
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: true,
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: ProjectsListViewFiltersConf,
  export: ProjectsListViewExportConf,
  search: {
    placeholder:
      "Search by project name, project description, and eCAPRIS subproject ID.",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label: "",
      icon: {
        name: "edit_road",
        color: "primary",
      },
      width: "*",
      type: "Int",
    },
    project_name: {
      searchable: true,
      sortable: false,
      label: "Project Name",
      search: {
        label: "Search by project name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "20%",
      type: "String",
    },
    project_description: {
      searchable: true,
      sortable: false,
      label: "Project Description",
      search: {
        label: "Search by project description",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "50%",
      type: "String",
    },
    current_status: {
      searchable: false,
      sortable: false,
      label: "Status",
      type: "String",
      width: "5%",
      chip: {
        active: "primary",
        hold: "secondary",
        canceled: "default",
      },
    },
    current_phase: {
      searchable: true,
      sortable: false,
      label: "Current Phase",
      width: "15%",
      search: {
        label: "Search by current phase",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    project_team_members: {
      searchable: false,
      sortable: false,
      label: "Team Members",
      width: "20%",
      filter: value => {
        if (value === " :") {
          return "";
        }
        const namesArray = value.split(",");
        const uniqueNames = {};
        namesArray.forEach(person => {
          const [fullName, projectRole] = person.split(":");
          if (uniqueNames[fullName]) {
            uniqueNames[fullName] = uniqueNames[fullName] + `, ${projectRole}`;
          } else {
            uniqueNames[fullName] = projectRole;
          }
        });
        const personnel = Object.keys(uniqueNames).map(
          key => `${key} - ${uniqueNames[key]}`
        );

        return personnel.join("\n");
      },
    },
    start_date: {
      searchable: false,
      sortable: true,
      label: "Start Date",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    ecapris_subproject_id: {
      hidden: false,
      searchable: true,
      sortable: true,
      label: "eCapris Subp.",
      filter: value => (
        <ExternalLink
          text={value}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${value}`}
        />
      ),
      type: "number",
      search: {
        label: "Search by eCapris subproject id",
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
      },
    },
  },
  order_by: {},
  where: {
    is_retired: "_eq: false",
  },
  limit: 25,
  offset: 0,
};
