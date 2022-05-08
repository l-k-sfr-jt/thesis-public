import React, {useContext} from 'react';
import {
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TopicIcon from '@mui/icons-material/Topic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import theme from "../theme";
import SideBarContext from "../context/SideBarContext";
import {Link} from "react-router-dom";
import DrawerHeader from "./SideBarHeader";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const SideBar = () => {
    const {sidebar, setSidebar} = useContext(SideBarContext);

    const handleDrawerClose = () => {
        setSidebar(false);
    };


    return (
        <Drawer
            variant="permanent"
            open={sidebar}>
            <DrawerHeader>
                <IconButton
                    onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <List>
                {[
                    {name: 'Dashboard', link: '/dashboard', icon: <HomeIcon/>},
                    {name: 'Projekty', link: '/projects', icon: <TopicIcon/>},
                    {name: 'Faktury', link: '/invoices', icon: <ReceiptIcon/>},
                    {name: 'Nabídky', link: '/offers', icon: <AssignmentIcon/>},
                    {name: 'Objednávky', link: '/orders', icon: <AssignmentTurnedInIcon/>},
                    {name: 'Technici', link: '/technicians', icon: <AccountBoxIcon/>}
                ].map((item, index) => (
                    <ListItemButton
                        key={item.name}
                        sx={{
                            minHeight: 48,
                            justifyContent: sidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={Link}
                        to={item.link}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: sidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} sx={{opacity: sidebar ? 1 : 0}}/>
                    </ListItemButton>
                ))}
            </List>
            <Divider/>
            <List>
                {[{name: 'Kontakty', link: '/contacts', icon: <PermContactCalendarIcon />}, {name: 'Nastavení', link: '/settings', icon: <SettingsIcon /> }].map((item, index) => (
                    <ListItemButton
                        key={item.name}
                        sx={{
                            minHeight: 48,
                            justifyContent: sidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={Link}
                        to={item.link}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: sidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} sx={{opacity: sidebar ? 1 : 0}}/>
                    </ListItemButton>
                ))}
            </List>
        </Drawer>

    );
}

export default SideBar;