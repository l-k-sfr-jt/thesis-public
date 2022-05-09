import React, {useEffect, useState} from "react";
import axios from "axios";
import SideBarHeader from "../../../../../thesis-public/client/src/components/SideBarHeader";
import {
    Autocomplete,
    Box,
    Breadcrumbs, Button, Collapse, Grid,
    Paper, Stack, Switch, TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {DatePicker, LocalizationProvider} from "@mui/lab";

const UserCreate = () => {
    const navigate = useNavigate();
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [hidden, setHidden] = useState(false);
    const [positions, setPositions] = useState(['Žádná pozice']);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const getPositions = async () => {
            const {data} = await axios.get(`/api/technicians/positions`);
            setPositions(data.positions);
        };
        getPositions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            birthDate: date,
            email: data.get('email'),
            phone: data.get('phone'),
            position: selectedPosition._id,
            taxInfo: {
                company: data.get('companyName'),
                street: data.get('street'),
                city: data.get('city'),
                postalCode: data.get('postalCode'),
                country: data.get('country'),
                idNumber: data.get('idNumber'),
                taxNumber: data.get('taxNumber'),
            },
            rates: {
                hourRate: data.get('hourRate'),
                car: data.get('car'),
                travel: data.get('travel')
            }
        };
        createTechnician(formData);
    }

    const createTechnician = async (techData) => {
        return axios.post('/api/technicians/create', {
            techData
        }).then(() => {
            navigate('/technicians');
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Vytvořit technika</Typography>
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
                        Vytvořit technika
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Paper elevation={5} sx={{p: 2, m: 2}}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Osobní údaje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="Jméno"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="lastName"
                                required
                                fullWidth
                                id="lastName"
                                label="Příjmení"

                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Datum narození"
                                    value={date}
                                    onChange={(newDate) => {
                                        setDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} />}
                                    maxDate={new Date()}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Kontaktní údaje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                required
                                fullWidth
                                id="email"
                                label="Emailová adresa"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone"
                                required
                                fullWidth
                                id="phone"
                                label="Telefoní číslo"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Pracovní pozice
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                onChange={(event, newPosition) => {
                                    setSelectedPosition(newPosition);
                                }}
                                id="position"
                                options={positions}
                                name='position'
                                renderInput={(params) => <TextField {...params} label="Pozice"/>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="h6" gutterBottom>
                                    Sazby
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="hourRate"
                                required
                                fullWidth
                                id="hourRate"
                                type={'number'}
                                label="Hodinová sazba"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="car"
                                required
                                fullWidth
                                id="car"
                                label="Sazba za kilometr"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="travel"
                                required
                                fullWidth
                                id="travel"
                                label="Sazba za hodinu cesty"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="h6" gutterBottom>
                                    Fakturační údaje
                                </Typography>
                                <Switch onChange={(e) => setHidden(!hidden)}/>
                            </Stack>
                        </Grid>
                        <Collapse component={Grid} item xs={12} in={hidden}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="companyName"
                                        label="Název firmy"
                                        name="companyName"
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="street"
                                        label="Ulice"
                                        id="street"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="city"
                                        label="Město"
                                        id="city"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="postalCode"
                                        label="PSČ"
                                        type="number"
                                        id="postalCode"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="country"
                                        label="Stát"
                                        id="country"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="idNumber"
                                        label="IČO"
                                        id="idNumber"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="taxNumber"
                                        label="DIČ"
                                        id="taxNumber"
                                    />
                                </Grid>
                            </Grid>

                        </Collapse>


                    </Grid>
                    <Grid container justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Přidat technika
                        </Button>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}

export default UserCreate;