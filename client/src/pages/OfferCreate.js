import React, {useState} from "react";
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {EditorState} from "draft-js";
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
import {stateToHTML} from 'draft-js-export-html';


const OfferCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    const [date, setDate] = useState(new Date());

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            offerNumber: data.get('offerNumber'),
            date: date,
            partnerName: data.get('name'),
            partnerEmail: data.get('email'),
            partnerPhone: data.get('phone'),
            companyName: data.get('company'),
            idNumber: data.get('idNumber'),
            taxNumber: data.get('taxNumber'),
            copyTo: data.get('copyTo'),
            scope: data.get('project'),
            offerText: stateToHTML(editorState.getCurrentContent())
        };
        createOffer(formData);
    }

    const createOffer =  async (offerData) => {
        return axios.post('/offers/create', {
            offerData
        }).then( () => {
            navigate('/offers');
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Vytvořit nabídku</Typography>
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
                        to="/offers"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Nabídky
                    </Link>
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Vytvořit nabídku
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Paper elevation={5} sx={{p: 2, m: 2}}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="offerNumber"
                                name="offerNumber"
                                required
                                fullWidth
                                id="offerNumber"
                                label="Číslo nabídky"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Datum objednávky"
                                    value={date}
                                    name="orderDate"
                                    id="orderDate"
                                    onChange={(newDate) => {
                                        setDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                Odběratel
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Kontaktní osoba
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="name"
                                label="Jméno"
                                id="name"
                                autoComplete="name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Emailová adresa"
                                name="email"
                                type="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="phone"
                                label="Telefoní číslo"
                                type="tel"
                                id="phone"
                                autoComplete="phone"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                            Společnost
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="company"
                                label="Název společnosti"
                                id="company"
                                autoComplete="company"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="idNumber"
                                label="IČO"
                                type="number"
                                id="idNumber"
                                autoComplete="idNumber"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="taxNumber"
                                label="DIČ"
                                id="taxNumber"
                                autoComplete="taxNumber"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="copyTo"
                                label="Kopie"
                                id="copyTo"
                                autoComplete="copyTo"
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
                                name="project"
                                label="Předmět"
                                id="project"
                                multiline
                                rows={2}
                                autoComplete="project"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Tělo nabídky
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{mb: 3}}>
                                <MUIRichTextEditor editorState={editorState} onChange={setEditorState}
                                                   label="Text nabidky"/>
                            </Box>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Vytvořit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default OfferCreate;