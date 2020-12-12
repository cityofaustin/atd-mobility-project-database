import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    SvgIcon,
    makeStyles,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {},
    importButton: {
        marginRight: theme.spacing(1),
    },
    exportButton: {
        marginRight: theme.spacing(1),
    },
}));

const Toolbar = ({ change, className, ...rest }) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Box display="flex" justifyContent="flex-end">
                <Button className={classes.importButton}>Import</Button>
                <Button className={classes.exportButton}>Export</Button>
                <Button
                    color="primary"
                    variant="contained"
                    component={RouterLink}
                    to={"/moped/projects/new"}
                >
                    New Project
                </Button>
            </Box>
            <Box mt={3}>
                <Card>
                    <CardContent>
                        <Box maxWidth={500}>
                            <TextField
                                onChange={change}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon fontSize="small" color="action">
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Search project"
                                variant="outlined"
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

Toolbar.propTypes = {
    className: PropTypes.string,
};

export default Toolbar;