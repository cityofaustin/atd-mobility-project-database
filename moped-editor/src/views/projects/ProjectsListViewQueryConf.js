export const ProjectsListViewQueryConf = {
    table: "moped_project",
    single_item: "project",
    showDateRange: false,
    columns: {
        project_id: {
            primary_key: true,
            searchable: false,
            sortable: false,
            label_search: "Search by Project ID",
            label_table: "Project ID",
            type: "Int",
        },
        project_name: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Project Name",
            type: "String",
        },
        project_description: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Description",
            type: "String",
        },
        current_status: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Status",
            type: "String",
        },
        date_added: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Date Added",
            type: "String",
        },
        start_date: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Start Date",
            type: "String",
        },
        capitally_funded: {
            searchable: false,
            sortable: false,
            label_search: null,
            label_table: "Capital Funding",
            type: "String",
        },
    },
    order_by: {},
    where: {},
    limit: 25,
    offset: 0,
};
