import React, {useState} from "react";
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {
    Box,
    Breadcrumbs, Button, Grid,
    Paper, TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {DatePicker, LocalizationProvider} from "@mui/lab";
import MUIRichTextEditor from "mui-rte";
import {stateToHTML} from "draft-js-export-html";

const ProjectCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState('');
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            ordererCompany: data.get('ordererCompany'),
            ordererName: data.get('ordererName'),
            ordererEmail: data.get('ordererEmail'),
            ordererPhone: data.get('ordererPhone'),
            customerCompany: data.get('customerCompany'),
            customerName: data.get('customerName'),
            customerEmail: data.get('customerEmail'),
            customerPhone: data.get('customerPhone'),
            customerStreet: data.get('customerStreet'),
            customerCity: data.get('customerCity'),
            customerPostalCode: data.get('customerPostalCode'),
            customerCountry: data.get('customerCountry'),
            name: data.get('projectName'),
            dateFrom: dateFrom,
            dateTo: dateTo,
            notes: stateToHTML(editorState.getCurrentContent())
        };
        createOffer(formData);
    }

    const createOffer = async (projectData) => {
        return axios.post('/projects/create', {
            projectData
        }).then(() => {
            navigate('/projects');
        }).catch((err) => {
            console.log(err)
        });
    }


    return (
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
            <SideBarHeader/>
            <Paper elevation={5} sx={{
                p: 2,
                m: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Vytvořit projekt</Typography>
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
                        Vytvořit projekt
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Paper elevation={5} sx={{p: 2, m: 2}}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Objednavatel
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="ordererCompany"
                                name="ordererCompany"
                                required
                                fullWidth
                                id="ordererCompany"
                                label="Společnost"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="ordererName"
                                name="ordererName"
                                required
                                fullWidth
                                id="ordererName"
                                label="Zástupce společnosti"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="ordererEmail"
                                name="ordererEmail"
                                required
                                fullWidth
                                id="ordererEmail"
                                label="Emailová adresa"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="ordererPhone"
                                name="ordererPhone"
                                required
                                fullWidth
                                id="ordererPhone"
                                label="Telefoní číslo"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Cílový zákazník
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="customerCompany"
                                name="customerCompany"
                                required
                                fullWidth
                                id="customerCompany"
                                label="Společnost"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="customerName"
                                label="Zástupce společnosti"
                                id="customerName"
                                autoComplete="customerName"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="customerEmail"
                                label="Emailová adresa"
                                name="customerEmail"
                                type="email"
                                autoComplete="customerEmail"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="customerPhone"
                                label="Telefoní číslo"
                                type="tel"
                                id="customerPhone"
                                autoComplete="customerPhone"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="customerStreet"
                                label="Ulice"
                                id="customerStreet"
                                autoComplete="customerStreet"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="customerCity"
                                label="Město"
                                id="customerCity"
                                autoComplete="customerCity"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="customerPostalCode"
                                label="PSČ"
                                type="number"
                                id="customerPostalCode"
                                autoComplete="customerPostalCode"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="customerCountry"
                                label="Stát"
                                id="customerCountry"
                                autoComplete="customerCountry"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Projekt
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="projectName"
                                label="Předmět"
                                id="projectName"
                                multiline
                                rows={2}
                                autoComplete="projectName"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Datum od"
                                    value={dateFrom}
                                    onChange={(newDate) => {
                                        setDateFrom(newDate);
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Datum do"
                                    value={dateTo}
                                    onChange={(newDate) => {
                                        setDateTo(newDate);
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{mb: 3}}>
                                <MUIRichTextEditor editorState={editorState} onChange={setEditorState}
                                                   label="Poznámky k projektu"/>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Vytvořit
                        </Button>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}

export default ProjectCreate;