import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home';
import DisplayIcon from '@material-ui/icons/Timeline';
import AnalysisIcon from '@material-ui/icons/DataUsage';
import PredictionIcon from '@material-ui/icons/ScatterPlot';
import { Link } from 'react-router-dom';

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
        drawerOpen: false,
    }
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer = (open) => () => {
    this.setState({
        drawerOpen: open
    })
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
              <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                  <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                  CS9321 19T1 Assignment 3
              </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer open={this.state.drawerOpen}
              onClose={this.toggleDrawer(false)}
              onOpen={this.toggleDrawer(true)}>
          <div tabIndex={0} role="button"
                  onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
              <div style={{width: '250px'}}>
                  <List>
                    <Link to='/' style={{ textDecoration: 'none' }}>
                      <ListItem button>
                          <ListItemIcon>
                              <HomeIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Home" />
                      </ListItem>
                    </Link>
                    <Link to='/display' style={{ textDecoration: 'none' }}>
                      <ListItem button>
                          <ListItemIcon>
                              <DisplayIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Data Display" />
                      </ListItem>
                    </Link>
                    <Link to='/analysis' style={{ textDecoration: 'none' }}>
                      <ListItem button>
                          <ListItemIcon>
                              <AnalysisIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Data Analysis" />
                      </ListItem>
                    </Link>
                    <Link to='/prediction' style={{ textDecoration: 'none' }}>
                      <ListItem button>
                          <ListItemIcon>
                              <PredictionIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Data Prediction" />
                      </ListItem>
                    </Link>
                  </List>
                  <Divider />
              </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

}

export default Nav
