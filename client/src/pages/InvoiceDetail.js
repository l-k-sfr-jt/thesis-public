import React, {Fragment, useEffect, useState} from "react";
import FileDownload from 'js-file-download';
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {
    Box,
    Breadcrumbs,
    Grid, IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment/moment";

;

const InvoiceDetail = () => {
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const params = useParams();
    const [edit, setEdit] = useState({readOnly: true, inputVariant: 'filled', btnText: 'Upravit'});
    const [lines, setLines] = useState([]);

    const getInvoice = async () => {
        const {data} = await axios.get(`/invoices/list/${params.invoiceId}`);
        setInvoice(data.response);
        setLines(data.response.lines);
    };

    useEffect(() => {
        getInvoice();
    }, [params]);

    const handleEdit = async (event) => {
        event.preventDefault();

        setInvoice({...invoice, lines: lines})
        return await axios.put(`/invoices/update/${invoice.id}`, {invoiceData: invoice})
            .then((response, err) => {
                toggleEdit();
                setInvoice(response.data.response);
                setLines(response.data.response.lines);
            }).catch((err) => {
                console.log(err)
            });
    };

    const toggleEdit = () => {
        setEdit({
            readOnly: !edit.readOnly,
            inputVariant: edit.inputVariant === 'filled' ? 'standard' : 'filled',
            btnText: edit.btnText === 'Zrušit' ? 'Upravit' : 'Zrušit'
        });
    };

    const handleNewLine = (event) => {
        const newLines = [...lines, {quantity: 1, unit_name: '', name: '', vat_rate: 21, unit_price: ''}]
        setLines(newLines);
    };

    const handleLineChange = (index, event) => {
        const {name, value} = event.target;
        const newLines = [...lines];
        newLines[index][name] = value;
        setLines(newLines);
    };

    const handleDeleteLine = (index) => {
        const newLines = [...lines];
        lines[index]['_destroy'] = true;
        setLines(newLines);
    };

    const handleDownload = () => {
        axios.get(`/invoices/pdf/${invoice.id}`, {responseType: 'blob'})
            .then((response) => {
                FileDownload(response.data, `${invoice.number}.pdf`);
            })
            .catch((err) => {
                console.log(err)
            });
    };

    const handleDelete = async () => {
        return await axios.delete(`/invoices/delete/${invoice.id}`, )
            .then(() => {
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
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <Typography variant="h4"
                                sx={{m: 2, mb: 0, flexGrow: 1}}>Faktura: {invoice && invoice.number}</Typography>
                    <Typography variant="h6" fontWeight={'normal'} component={'p'}
                                sx={{m: 2, mt: 0, flexGrow: 1}}>Vystavená: {invoice && moment(invoice.issued_on).format('DD.MM.YYYY')}
                        <Typography component={'span'}> Splatná za {invoice && invoice.due} dní </Typography>
                    </Typography>
                </div>

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
                        to="/invoices"
                    >
                        <WhatshotIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Faktury
                    </Link>
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Detail Faktury
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="success" onClick={handleDownload}>
                    Stáhnout fakturu v PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={toggleEdit}>{edit.btnText}</Button>

                <Button variant="contained" color="error" onClick={handleDelete}>
                    Odstranit
                </Button>
            </Stack>
            {
                invoice &&
                <Paper elevation={5} sx={{p: 2, m: 2}}>
                    <Box component="form" noValidate sx={{mt: 3}} onSubmit={handleEdit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography fontSize={'1.2rem'}>{invoice.client_name}</Typography>
                                <Typography fontSize={'1.2rem'}>{invoice.client_street}</Typography>
                                <Typography
                                    fontSize={'1.2rem'}>{invoice.client_zip + ' ' + invoice.client_city}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography fontSize={'1.2rem'}>Vystavení: {moment(invoice.issued_on).format('DD.MM.YYYY')}</Typography>
                                <Typography fontSize={'1.2rem'}>Splatnost: {moment(invoice.due_on).format('DD.MM.YYYY')}</Typography>
                                <Typography
                                    fontSize={'1.2rem'}>Zdanitelné
                                    plnění: {moment(invoice.taxable_fulfillment_due).format('DD.MM.YYYY')}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography fontSize={'1.2rem'}>Variabliní
                                    symbol: {invoice.variable_symbol}</Typography>
                                <Typography fontSize={'1.2rem'}>Vystavil: {invoice.your_name}</Typography>
                            </Grid>
                            {
                                lines.map((data, index) => {
                                    if (data._destroy) return;
                                    const {quantity, unit_name, name, vat_rate, unit_price} = data;
                                    return (
                                        <Fragment key={index}>
                                            <Grid item xs={12} sm={1}>
                                                <TextField
                                                    name="quantity"
                                                    fullWidth
                                                    id="quantity"
                                                    label="Počet"
                                                    type={'number'}
                                                    placeholder={'ks,...'}
                                                    value={quantity}
                                                    InputProps={{readOnly: edit.readOnly}}
                                                    variant={edit.inputVariant}
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
                                                    InputProps={{readOnly: edit.readOnly}}
                                                    variant={edit.inputVariant}
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
                                                    InputProps={{readOnly: edit.readOnly}}
                                                    variant={edit.inputVariant}
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
                                                    InputProps={{readOnly: edit.readOnly}}
                                                    variant={edit.inputVariant}
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
                                                    InputProps={{readOnly: edit.readOnly}}
                                                    variant={edit.inputVariant}
                                                    onChange={event => handleLineChange(index, event)}
                                                />
                                            </Grid>
                                            {!edit.readOnly &&
                                                <Grid item xs={12} sm={1}>
                                                    <IconButton aria-label="delete"
                                                                onClick={() => handleDeleteLine(index)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Grid>
                                            }
                                        </Fragment>
                                    )
                                })
                            }
                            {!edit.readOnly &&
                                <Grid item xs={12}>
                                    <Button variant={'contained'} onClick={handleNewLine}>Nový řádek</Button>
                                </Grid>
                            }
                            <Grid item xs={12} sm={4}>
                                <Stack flexDirection={'row'} justifyContent={'space-between'}
                                       sx={{pt: '3rem', width: '100%'}}>
                                    <Typography>Sazba</Typography>
                                    <Typography>Základ</Typography>
                                    <Typography>DPH</Typography>
                                </Stack>
                                <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{width: '100%'}}>
                                    {invoice.lines.map((data, index) =>
                                        <>
                                            <Typography>{data.vat_rate}%</Typography>
                                            <Typography>{data.unit_price_without_vat + ' ' + invoice.currency}</Typography>
                                            <Typography>{data.unit_price_with_vat - data.unit_price_without_vat + ' ' + invoice.currency}</Typography>
                                        </>
                                    )}
                                </Stack>
                                <Typography fontSize={'2rem'} fontWeight={'500'}>{invoice.total + ' ' + invoice.currency}</Typography>
                            </Grid>
                        </Grid>
                        {!edit.readOnly &&
                            <Stack alignItems={"center"}>
                                <Button
                                    type="submit"
                                    size={'large'}
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Upravit fakturu
                                </Button>
                            </Stack>
                        }
                    </Box>
                </Paper>
            }
        </Box>
    );
}

export default InvoiceDetail;