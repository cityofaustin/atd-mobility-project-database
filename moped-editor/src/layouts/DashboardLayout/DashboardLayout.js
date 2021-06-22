import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar/NavBar";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const { user } = useUser();

  console.log("user", user);

  return user ? (
    <div className={classes.root}>
      <TopBar onOpen={() => setOpen(true)} />
      <NavBar
        onClose={() => setOpen(false)}
        isOpen={isOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/moped/session/signin" />
  );
};

export default DashboardLayout;
