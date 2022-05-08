import React, {useContext, useState} from 'react';
import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem, styled,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from "@mui/icons-material/Menu";
import useAuth from "../hooks/useAuth";
import SideBarContext from "../context/SideBarContext";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Navigation = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const {setSidebar, sidebar} = useContext(SideBarContext);
    const {logout} = useAuth();

    const handleDrawerOpen = () => {
        setSidebar(true);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        logout();
    };

    return (
        <AppBar position="fixed" open={sidebar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(sidebar && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, mr: 2, display: {xs: 'none', md: 'flex'}}}
                    >
                        SPQ Service
                    </Typography>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}
                    >
                        SPQ Service
                    </Typography>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >

                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Odhlásit se</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
        </AppBar>
    )
}


export default Navigation;