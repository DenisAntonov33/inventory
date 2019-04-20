import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { removeToken } from "../../utils/localStorageService";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import HistoryIcon from "@material-ui/icons/History";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PanToolIcon from "@material-ui/icons/PanTool";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VerticalAlignCenterIcon from "@material-ui/icons/VerticalAlignCenter";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingTop: 64,
  },
  logoutButton: {
    marginLeft: "auto",
    marginRight: 12,
  },
});

class Instance extends React.Component {
  toolbarLinks = [
    { text: "Dashboard", link: "/", icon: HomeIcon },
    { text: "History", link: "/history", icon: HistoryIcon },
    { text: "Employees", link: "/employees", icon: GroupIcon },
    { text: "Body params", link: "/bodyparams", icon: VerticalAlignCenterIcon },
    { text: "Positions", link: "/positions", icon: ListAltIcon },
    { text: "Entities", link: "/entities", icon: PanToolIcon },
    { text: "Store", link: "/store", icon: AllInboxIcon },
    { text: "Profile", link: "/profile", icon: AccountCircleIcon },
  ];

  state = {
    open: false,
  };

  componentDidMount() {
    const isDrawerOpen = localStorage.getItem("isDrawerOpen") === "true";
    this.setState({ open: isDrawerOpen });
  }

  handleDrawerOpen = () => {
    localStorage.setItem("isDrawerOpen", true);
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    localStorage.setItem("isDrawerOpen", false);
    this.setState({ open: false });
  };

  handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  render() {
    const { classes, content } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Dashboard
            </Typography>
            <Button
              color="inherit"
              className={classes.logoutButton}
              onClick={this.handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {this.toolbarLinks.map(e => (
              <Link key={e.text} to={e.link}>
                <ListItem button>
                  <ListItemIcon>{<e.icon />}</ListItemIcon>
                  <ListItemText primary={e.text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>{content}</main>
      </div>
    );
  }
}

Instance.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Instance);
