import React, {useEffect, useState, Fragment} from "react";
import axios from "axios";
import SideBarHeader from "../../../../../thesis-public/client/src/components/SideBarHeader";
import {
    Autocomplete,
    Box,
    Breadcrumbs, Button, CircularProgress, Grid, IconButton,
    Paper, Stack, TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import DeleteIcon from '@mui/icons-material/Delete';
import GrainIcon from "@mui/icons-material/Grain";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";


const InvoiceCreate = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const loading = open && contacts.length === 0;
    const [selectedContact, setSelectedContact] = useState('')
    const [date, setDate] = useState(new Date());
    const [taxDate, setTaxDate] = useState(new Date());
    const [due, setDue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const paymentMethods = [{name: 'Bankovní převod', short: 'bank'}, {name: 'Hotově', short: 'cash'}, {
        name: 'Karta',
        short: 'card'
    }];
    const [currency, setCurrency] = useState('EUR');
    const currencies = [{name: 'EUR - Eurozóna', short: 'EUR'}, {name: 'CZK- Česká koruna', short: 'CZK'}];



    const [lines, setLines] = useState([{quantity: 1, unit_name: '', name: '', vat_rate: 21, unit_price: ''}]);

    const handleNewLine = (event) => {
        setLines([...lines, {quantity: 1, unit_name: '', name: '', vat_rate: 21, unit_price: ''}]);
    }

    const handleLineChange = (index, event) => {
        const {name, value} = event.target;
        const list = [...lines];
        list[index][name] = value;
        setLines(list);
    }

    const handleDeleteLine = (index) => {
        const invoiceLines = [...lines];
        invoiceLines.splice(index, 1);
        setLines(invoiceLines);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            subject_id: selectedContact,
            issued_on: date,
            taxable_fulfillment_due: taxDate,
            payment_method: paymentMethod,
            currency: currency,
            due: due,
            lines: lines
        };
        createInvoice(formData);
    }

    useEffect(() => {
        getContacts();
    }, [])

    const getContacts = async () => {
        const {data} = await axios.get('/api/invoices/contacts');
        setContacts(data.response);
    };

    const createInvoice = async (invoiceData) => {
        return axios.post('/api/invoices/create', {
            invoiceData
        }).then(() => {
            navigate('/invoices');
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Vytvořit fakturu</Typography>
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
                        Faktury
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
                            <Autocomplete
                                fullWidth
                                id="contact"
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                onChange={(event, option) => {
                                    setSelectedContact(option.id);
                                    setDue(option.due)
                                }}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                getOptionLabel={(option) => option.name + ' – IČO: ' + option.registration_no}
                                options={contacts}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Odběratel"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={"center"}
                                   height={'100%'}>
                                <Button component={Link} to="/contacts/create" variant="contained">Vytvořit
                                    kontakt</Button>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="street"
                                fullWidth
                                id="street"
                                label="Číslo faktury"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Datum vystavení"
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
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Zdanitelné plnění"
                                    value={taxDate}
                                    name="orderDate"
                                    id="orderDate"
                                    onChange={(newDate) => {
                                        setTaxDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="paymentMethod"
                                options={paymentMethods}
                                onChange={(event, option) => setPaymentMethod(option.short)}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.short === value.short}
                                renderInput={(params) => <TextField {...params} label="Platební metoda"/>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="currency"
                                options={currencies}
                                onChange={(event, option) => setCurrency(option.short)}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.short === value.short}
                                renderInput={(params) => <TextField {...params} label="Měna"/>}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="registration_no"
                                fullWidth
                                id="registration_no"
                                label="Splatnost"
                                type={'number'}
                                value={due}
                                onChange={event => setDue(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                Položky
                            </Typography>
                        </Grid>
                        {lines.map((data, index) => {
                            const {quantity, unit_name, name, vat_rate, unit_price} = data;
                            return (
                                <Fragment key={index}> <Grid item xs={12} sm={1}>
                                    <TextField
                                        name="quantity"
                                        fullWidth
                                        id="quantity"
                                        label="Počet"
                                        type={'number'}
                                        placeholder={'ks,...'}
                                        value={quantity}
                                        onChange={event => handleLineChange(index, event)}
                                    />
                                </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <TextField
                                            name="unit_name"
                                            fullWidth
                                            id="unit_name"
                                            label="MJ"
                                            value={unit_name}
                                            onChange={event => handleLineChange(index, event)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="name"
                                            fullWidth
                                            id="name"
                                            label="Popis"
                                            value={name}
                                            onChange={event => handleLineChange(index, event)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            name="unit_price"
                                            fullWidth
                                            id="unit_price"
                                            label="Cena za MJ"
                                            type={'number'}
                                            value={unit_price}
                                            onChange={event => handleLineChange(index, event)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <TextField
                                            name="vat_rate"
                                            fullWidth
                                            id="vat_rate"
                                            label="DPH (%)"
                                            type={'number'}
                                            value={vat_rate}
                                            onChange={event => handleLineChange(index, event)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <IconButton aria-label="delete" onClick={() => handleDeleteLine(index)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                </Fragment>
                            )
                        })
                        }

                        <Grid item xs={12}>
                            <Button variant={'contained'} onClick={handleNewLine}>Nový řádek</Button>
                        </Grid>
                    </Grid>
                    <Stack alignItems={"center"}>
                        <Button
                            type="submit"
                            size={'large'}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Vytvořit fakturu
                        </Button>
                    </Stack>


                </Box>
            </Paper>
        </Box>
    )
        ;
};

export default InvoiceCreate;