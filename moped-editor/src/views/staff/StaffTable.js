import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(() => ({
  root: {},
}));

const StaffTable = ({ staff }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Workgroup</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map(person => (
                <TableRow hover key={person.staff_uuid}>
                  <TableCell align="center">
                    <RouterLink to={`/moped/staff/edit/${person.user_id}`}>
                      <EditIcon color="primary" />
                    </RouterLink>
                  </TableCell>
                  <TableCell>{person.first_name}</TableCell>
                  <TableCell>{person.last_name}</TableCell>
                  <TableCell>{person.workgroup}</TableCell>
                  <TableCell>{person.title}</TableCell>
                  <TableCell>{person.role}</TableCell>
                  <TableCell>{person.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default StaffTable;
