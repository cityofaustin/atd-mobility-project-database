import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useUser } from "../../../auth/user";
import emailToInitials from "../../../utils/emailToInitials";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    marginBottom: 8,
  },
  userInitials: {
    fontSize: "2rem",
  },
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useUser();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Box>
            <Avatar
              className={classes.avatar}
              src={user?.userAvatar}
              style={{ backgroundColor: user?.userColor }}
            >
              <Typography className={classes.userInitials}>
                {emailToInitials(user?.idToken?.payload?.email)}
              </Typography>
            </Avatar>
          </Box>
          <Typography color="textPrimary" gutterBottom variant="h3">
            {String(
              user?.userName ?? user?.idToken?.payload?.email
            ).toLowerCase()}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.userJobTitle ?? "Austin Transportation"}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.userCity ?? "Austin, TX"}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
