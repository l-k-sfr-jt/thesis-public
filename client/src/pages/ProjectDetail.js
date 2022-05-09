import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import SideBarHeader from "../../../../../thesis-public/client/src/components/SideBarHeader";
import {
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
    Link as UILink, styled
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from "@mui/icons-material/Home";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import GrainIcon from "@mui/icons-material/Grain";
import InboxIcon from '@mui/icons-material/Inbox';
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TabPanel from "../../../../../thesis-public/client/src/components/TabPanel";
import Button from "@mui/material/Button";
import MUIRichTextEditor from "mui-rte";
import {ContentState, convertFromHTML, convertToRaw} from "draft-js";
import TechList from "../../../../../thesis-public/client/src/components/TechList";
import TechDetailSchedule from "../../../../../thesis-public/client/src/components/TechDetailSchedule";
import {TechContext} from "../../../../../thesis-public/client/src/hooks/TechContext";
import SplitButton from "../../../../../thesis-public/client/src/components/SplitButton";
import moment from "moment/moment";
import FileDownload from "js-file-download";


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Input = styled('input')({
    display: 'none',
});

const ProjectDetail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [project, setProject] = useState(null);
    const [value, setValue] = useState(0);
    const [editorDefault, setEditorDefault] = useState(ContentState.createFromBlockArray(convertFromHTML('').contentBlocks));
    const [selectedTech, setSelectedTech] = useState(null);
    const [uploadFileName, setUploadFileName] = useState('')
    const uploadRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)

    const getSignedUrl = async (pathToFile, contentFile) => {
        const fileName = `${project._id}/${pathToFile.split(['\\'])[2]}`;
        const {data} = await axios.post(
            `/projects/upload/${project._id}`,
            {
                image: fileName,
                contentType: contentFile
            }
        );
        setProject(data.project);
        return data.link;
    }

    const handleDownload = async (fileName) => {
        const pathToFile = `${project._id}/${fileName}`;
        const {data} = await axios.get(
            `/projects/download`,
            {
                params: {
                    pathToFile
                },
            }
        );
       axios.get(data.link, {responseType: 'blob'})
           .then((response) => {
               FileDownload(response.data, fileName);
           })
           .catch((err) => {
               console.log(err)
           });

    }

    useEffect(() => {
        const getProject = async () => {
            const {data} = await axios.get(`/api/projects/list/${params.projectId}`);
            setProject(data.project);
            const blocksFromHTML = convertFromHTML(data.project.notes);
            setEditorDefault(ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            ));
        };
        getProject();
    }, [params]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handelEdit = () => {

    }

    const handleUploadFile = async () => {
        const s3URL = await getSignedUrl(uploadFileName, selectedFile.type);
        await fetch(s3URL, {
            method: 'PUT',
            body: selectedFile,
        }).catch( err => {
            console.log(err);
            return null;
        });
    }


    const updateStatus = async (status) => {
        const updatedProject = project;
        updatedProject.status = status;
        return await axios.put(`/api/projects/update/${project._id}`, {project: updatedProject})
            .then((response, err) => {
                setProject(response.data.project)
            }).catch((err) => {
                console.log(err)
            });

    }

    const handleDelete = async () => {
        return await axios.delete('/api/projects/delete', {data: {projectId: project._id}})
            .then(() => {
                navigate('/projects');
            }).catch((err) => {
                console.log(err)
            });

    }

    const handleCreateOrder = () => {

    }

    const handleUpload = (event) => {
        setUploadFileName(uploadRef.current.value);
        setSelectedFile(event.target.files[0]);
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
                justifyContent: 'space-between'
            }}>
                <Stack direction='column'>
                    <Typography variant="h4"
                                sx={{m: 2, mb: 0, flexGrow: 1}}>{project?.name}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ml: 2}}>
                        {project && moment(project.dateFrom).format('DD.MM.YYYY')} - {project && moment(project.dateTo).format('DD.MM.YYYY')}
                    </Typography>
                </Stack>

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
                        to="/projects"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Projekty
                    </Link>
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Projekt detail
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Stack direction="row" sx={{mx: 2}} spacing={2} justifyContent="flex-end">
                {project && <SplitButton defaultValue={project.status} handleClickRef={updateStatus}/>}
                <Button variant="contained" color="success" onClick={handleCreateOrder}>
                    Vytvořit nabídku
                </Button>
                <Button variant="contained" color="secondary" onClick={handelEdit}>Upravit</Button>

                <Button variant="contained" color="error" onClick={handleDelete}>
                    Odstranit
                </Button>
            </Stack>
            {project &&
                <Paper elevation={5} sx={{p: 2, m: 2}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Základní informace" {...a11yProps(0)} />
                            <Tab label="Technici" {...a11yProps(1)} />
                            <Tab label="Dokumentace" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Cílový zákazník</Typography>
                                    </Stack>
                                    <Divider/>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <EmailIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Firma"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.customer?.company}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <EmailIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Zástupce"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.customer?.name}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
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
                                                        href={`mailto:${project.customer?.email}`}
                                                    >
                                                        {project.customer?.email}
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
                                                        href={`tel:${project.customer?.phone}`}
                                                    >
                                                        {project.customer.phone}
                                                    </UILink>
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <PhoneIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Ulice"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.customer?.street}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <PhoneIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Mesto"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.customer?.city}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                    <PhoneIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Stát"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.customer?.country}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: 2, m: 2}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Objednavatel</Typography>
                                    </Stack>

                                    <Divider/>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <CorporateFareIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Firmy"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.orderer?.company}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <CorporateFareIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Zástupce"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.orderer?.name}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <LocationOnIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Email"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.orderer?.email}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <LocationCityIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Telefon"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.orderer?.phone}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <InboxIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Jmeno"/>
                                                <Typography variant='subtitle2' fontWeight={500}>
                                                    {project.orderer?.name}
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4} flexGrow={1}>
                                <Paper elevation={1} sx={{p: 2, m: 2}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Poznámky k projektu</Typography>
                                    </Stack>
                                    <Divider/>
                                    <MUIRichTextEditor controls={[]}
                                                       defaultValue={project.notes && JSON.stringify(convertToRaw(editorDefault))}
                                                       label="Poznámky k projektu"/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container spacing={2}>
                            <TechContext.Provider value={{selectedTech, setSelectedTech}}>
                                <Grid item xs={12} lg={3}>
                                    <TechList techIds={project.techniciansIds} projectId={project._id}/>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <TechDetailSchedule projectId={project._id}/>
                                </Grid>
                            </TechContext.Provider>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={'h4'}>Projektová dokumentace</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Seznam Dokumentů</Typography>
                                    </Stack>
                                    <Divider/>
                                    <List>
                                        {project.files.map((file) => (
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemIcon sx={{display: {xs: 'none', md: 'block'}}}>
                                                        <EmailIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={file} onClick={() => handleDownload(file)}/>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} sx={{p: {xs: 1, md: 2}, m: {xs: 0, md: 2}}}>
                                    <Stack height='3rem' sx={{justifyContent: 'center', mb: 1}}>
                                        <Typography variant='h6'>Nahrát Dokument</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Box component="form" noValidate onSubmit={handleUploadFile} sx={{mt: 3}}>
                                        <label htmlFor="contained-button-file">

                                            <Input ref={uploadRef} name='file' onChange={handleUpload} accept="*"
                                                   id="contained-button-file"
                                                   type="file" ref={uploadRef}/>
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Button sx={{mr: '2rem'}} variant="contained" component="span">
                                                    Nahrát
                                                </Button>
                                                <Typography>{uploadFileName}</Typography>
                                            </Stack>

                                        </label>
                                        <Button
                                            onClick={handleUploadFile}

                                            variant="contained"
                                            disabled={uploadFileName === ''}
                                            sx={{mt: 3, mb: 2}}
                                        >
                                            Uložit
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>


                        </Grid>
                    </TabPanel>
                </Paper>
            }
        </Box>
    );
}

export default ProjectDetail;