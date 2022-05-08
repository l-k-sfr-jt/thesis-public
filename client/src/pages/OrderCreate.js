import React, {useEffect, useState} from "react";
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {EditorState} from "draft-js";
import {
    Box,
    Breadcrumbs, Button, Grid,
    Paper, TextField,
    Typography
} from "@mui/material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {DatePicker, LocalizationProvider} from "@mui/lab";
import MUIRichTextEditor from "mui-rte";
import {stateToHTML} from 'draft-js-export-html';


const OrderCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    const [date, setDate] = useState(new Date());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const location = useLocation();
    const [techId, setTechId] = useState(null);

    useEffect(() => {
        if (location.state && location.state.tech) {
            const {tech} = location.state;
            setName(`${tech.firstName} ${tech.lastName}`);
            setEmail(tech.email);
            setPhone(tech.phone);
            setIdNumber(tech.taxInfo.idNumber);
            setStreet(tech.taxInfo.street);
            setPostalCode(tech.taxInfo.postalCode);
            setCity(tech.taxInfo.city);
            setCountry(tech.taxInfo.country);
            setTechId(tech._id);
        }

    }, [location])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            orderNumber: data.get('orderNumber'),
            date: date,
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            idNumber: data.get('idNumber'),
            street: data.get('street'),
            postalCode: data.get('postalCode'),
            city: data.get('city'),
            country: data.get('country'),
            copyTo: data.get('copyTo'),
            projectName: data.get('project'),
            orderText: stateToHTML(editorState.getCurrentContent()),
            technician: techId
        };
        createOrder(formData);
    }

    const createOrder = async (orderData) => {
        return axios.post('/orders/create', {
            orderData
        }).then(() => {
            navigate('/orders');
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Vytvořit objednávku</Typography>
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
                        to="/orders"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Objednávky
                    </Link>
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Vytvořit objednávku
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Paper elevation={5} sx={{p: 2, m: 2}}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="orderNumber"
                                required
                                fullWidth
                                id="orderNumber"
                                label="Číslo objednávky"
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
                            <Typography variant="h6" gutterBottom>
                                Dodavatel
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="name"
                                label="Jméno"
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
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
                                value={email}
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
                                value={phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="idNumber"
                                label="IČO"
                                type="number"
                                id="idNumber"
                                value={idNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="street"
                                label="Ulice"
                                id="street"
                                autoComplete="street"
                                value={street}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="postalCode"
                                label="PSČ"
                                type="number"
                                id="postalCode"
                                autoComplete="postalCode"
                                value={postalCode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="city"
                                label="Město"
                                id="city"
                                autoComplete="city"
                                value={city}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="country"
                                label="Stát"
                                id="country"
                                autoComplete="country"
                                value={country}
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
                                Tělo objednávky
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{mb: 3}}>
                                <MUIRichTextEditor editorState={editorState} onChange={setEditorState}
                                                   label="Text objednávky"/>
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

export default OrderCreate;