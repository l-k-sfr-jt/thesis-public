import React, {useState} from "react";
import axios from "axios";
import SideBarHeader from "../../../../../thesis-public/client/src/components/SideBarHeader";
import {
    Autocomplete,
    Box,
    Breadcrumbs, Button, Grid,
    Paper, TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";


const ContactCreate = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [country, setCountry] = useState('')

    const countries = [{name: 'Česká republika', country: 'CZ'}];

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            name: data.get('name'),
            email: data.get('email'),
            street: data.get('street'),
            city: data.get('city'),
            zip: data.get('zip'),
            country: country,
            registration_no: data.get('registration_no'),
            vat_no: data.get('vat_no'),
            type: type,
            variable_symbol: data.get('variable_symbol'),
            due: Number(data.get('due'))
        };
                createContact(formData);
    }

    const createContact = async (contactData) => {
        return axios.post('/api/invoices/contacts/create', {
            contactData
        }).then(() => {
            navigate('/contacts');
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Přidat kontakt</Typography>
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
                        to="/contacts"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Kontakty
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
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Název / Jméno a příjmení"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                fullWidth
                                id="email"
                                label="Hlavní email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                Kontaktní údaje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="street"
                                fullWidth
                                id="street"
                                label="Ulice"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="city"
                                fullWidth
                                id="city"
                                label="Město"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="zip"
                                fullWidth
                                id="zip"
                                label="PSČ"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="country"
                                options={countries}
                                onChange={(event, option) => setCountry(option.country)}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.country === value.country}
                                renderInput={(params) => <TextField {...params} label="Stát"/>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                Identifikační údáje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="registration_no"
                                fullWidth
                                id="registration_no"
                                label="IČO"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="vat_no"
                                fullWidth
                                id="vat_no"
                                label="DIČ"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                Ostatní údáje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                disabePortal
                                id="type"
                                onChange={(event, option) => setType(option.id)}
                                options={[{label:'Odběratel', id: 'customer'}, {label: 'Dodavatel', id: 'supplier'}, {label: 'Obojí', id: 'both'}]}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} name='type' label="Typ konktaktu"/>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="variable_symbol"
                                fullWidth
                                id="variable_symbol"
                                label="Pevný VS"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="due"
                                fullWidth
                                id="due"
                                type={'number'}
                                label="Splatnost (dní)"
                            />
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

export default ContactCreate;