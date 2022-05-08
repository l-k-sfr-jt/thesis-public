import React, {useEffect, useState} from "react";
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {
    Avatar,
    Box,
    Breadcrumbs,
    Divider,
    Grid,
    List,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    Link as UILink, ListItemAvatar
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from "@mui/icons-material/Home";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import GrainIcon from "@mui/icons-material/Grain";
import InboxIcon from '@mui/icons-material/Inbox';
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EuroIcon from '@mui/icons-material/Euro';
import FlightClassIcon from '@mui/icons-material/FlightClass';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TabPanel from "../components/TabPanel";
import {stringAvatar} from "../utils/utils";
import Button from "@mui/material/Button";


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const UserDetail = () => {
    const [tech, setTech] = useState(null);
    const [orders, setOrders] = useState([]);
    const [projects, setProjects] = useState([]);
    const params = useParams();
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const getTechnician = async () => {
            const {data} = await axios.get(`/technicians/list/${params.technicianId}`);
            setProjects(data.tech.projects)
            setTech(data.tech);
        };

        const getOrders = async () => {
            const {data} = await axios.get(`/orders/for/${params.technicianId}`);
            setOrders(data.orders);
        };

        getTechnician();
        getOrders()
    }, [params]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handelEdit = () => {

    }

    const handleDelete = () => {
        axios.delete('/technicians/delete', {data: {techId: tech._id}})
            .then((data) => {
                navigate('/technicians');
            })
            .catch((err) => {
            })

    }

    const handleCreateOrder = () => {
        navigate('/orders/create', {state: {tech}});
    }


    return (
        <Box component="main" sx={{flexGrow: 1, p: {xs: 1, md: 3}}}>
            <SideBarHeader/>
            <Paper elevation={5} sx={{
                p: 2,
                m: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h4"
                            sx={{m: 2, flexGrow: 1}}>{tech && tech.firstName} {tech && tech.lastName}</Typography>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        to="/"
                    >
                        <HomeIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Home
                    </Link>
                    <Link
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        to="/technicians"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Technici
                    </Link>
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Technik detail
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Stack direction="row" spacing={2} sx={{mx:2}} justifyContent="flex-end">
                <Button variant="contained" color="success" onClick={handleCreateOrder}>Vytvořit objednávku</Button>
                <Button variant="contained" color="secondary" onClick={handelEdit}>Upravit</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Odstranit</Button>
            </Stack>
            {tech &&
                <Paper elevation={5} sx={{p: 2, m: 2}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Osobní profil" {...a11yProps(0)} />
                            <Tab label="Praocvni historie" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' direction="row" spacing={2} sx={{alignItems: 'center', mb: 1}}>
                                        <Avatar {...stringAvatar(`${tech.firstName} ${tech.lastName}`)} />
                                        <Stack direction="column" spacing={0}>
                                            <Typography variant='h6'
                                                        lineHeight='normal'>{tech.firstName} {tech.lastName}</Typography>
                                            <Typography variant='subtitle1'
                                                        fontWeight={300}>{tech.position.label}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Divider/>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <EmailIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Email"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    <UILink
                                                        underline="none"
                                                        color='inherit'
                                                        href={`mailto:${tech.email}`}
                                                    >
                                                        {tech.email}
                                                    </UILink>
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <PhoneIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Telefon"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    <UILink
                                                        underline="none"
                                                        color='inherit'
                                                        href={`tel:${tech.phone}`}
                                                    >
                                                        {tech.phone}
                                                    </UILink>
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: 2, m: 2}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Fakturační údaje</Typography>
                                    </Stack>
                                    <Divider/>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <CorporateFareIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Název firmy"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.company}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <LocationOnIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Ulice"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.street}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <LocationCityIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Město"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.city}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <InboxIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="PSČ"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.postalCode}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <WorkIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="IČO"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.idNumber}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <AssuredWorkloadIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="DIČ"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.taxInfo.taxNumber}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: 2, m: 2}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Sazby</Typography>
                                    </Stack>

                                    <Divider/>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <EuroIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Hodinová sazba"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.rates.hourRate} EUR
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <DirectionsCarIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Sazba za km"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.rates.car} EUR
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <FlightClassIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Sazba za hodinu cesty"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {tech.rates.travel} EUR
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>

                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Objednávky</Typography>
                                    </Stack>
                                    <Divider/>
                                    {orders.length > 0 &&
                                        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                                            {orders.map(listItem => (
                                                <ListItem key={listItem._id} onClick={() => {
                                                    navigate(`/orders/${listItem._id}`)
                                                }}>
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <WorkIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${listItem.orderNumber} - ${listItem.projectName}`}
                                                            secondary={new Date(listItem.date).toISOString().split('T')[0]}/>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Projekty</Typography>
                                    </Stack>
                                    <Divider/>
                                    {projects.length > 0 &&
                                        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                                            {projects.map( ({projectId}) => (
                                                <ListItem key={projectId._id} onClick={() => {
                                                    navigate(`/projects/${projectId._id}`)
                                                }}>
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <WorkIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={projectId.name}
                                                            secondary={projectId.customer.company}/>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>}
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                </Paper>
            }
        </Box>
    );
}

export default UserDetail;