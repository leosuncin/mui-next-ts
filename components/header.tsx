import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import MenuIcon from '@material-ui/icons/Menu';
import AccountIcon from '@material-ui/icons/Person';
import { useAuth } from 'hooks/auth-context';
import { useUserState } from 'hooks/user-context';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Header: React.FC<{ title?: string }> = props => {
  const user = useUserState();
  const { logout } = useAuth();
  const router = useRouter();
  const [anchorElement, setAnchorElement] = useState(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          aria-label="app-menu"
          data-testid="app-menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {props.title}
        </Typography>
        {user && (
          <>
            <IconButton
              color="inherit"
              aria-haspopup="true"
              aria-controls="profile-menu"
              data-testid="profile-menu"
              onClick={event => {
                setAnchorElement(event.currentTarget);
              }}
            >
              <AccountIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              disableAutoFocusItem
              keepMounted
              open={Boolean(anchorElement)}
              anchorEl={anchorElement}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              onClose={() => {
                setAnchorElement(null);
              }}
            >
              <MenuItem>
                <FaceIcon />
                <b>{user.username}</b>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  logout();
                  void router.push('/login');
                }}
              >
                <ExitToAppIcon />
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};
Header.defaultProps = {
  title: 'Main page',
};

export default Header;
