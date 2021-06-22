import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Drawer, List, makeStyles } from "@material-ui/core";
import { EmojiTransportation } from "@material-ui/icons";
import {
  BarChart as BarChartIcon,
  User as UserIcon,
  Users as UsersIcon,
  LogOut as LogOutIcon,
} from "react-feather";
import NavItem from "./NavItem";

const items = [
  {
    href: "/moped/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/moped/projects",
    icon: EmojiTransportation,
    title: "Projects",
  },
  {
    href: "/moped/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/moped/staff",
    icon: UsersIcon,
    title: "Staff",
  },
  {
    href: "/moped/logout",
    icon: LogOutIcon,
    title: "Logout",
  },
];

const useStyles = makeStyles(() => ({
  navDrawer: {
    width: 256,
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.navDrawer }}
      onClose={onClose}
      open={isOpen}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

NavBar.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
};

NavBar.defaultProps = {
  onClose: () => {},
  isOpen: false,
};

export default NavBar;
