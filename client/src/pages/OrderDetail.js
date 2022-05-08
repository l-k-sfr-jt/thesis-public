import React, {useEffect, useState} from "react";
import axios from "axios";
import SideBarHeader from "../components/SideBarHeader";
import {Box, Breadcrumbs, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import Button from "@mui/material/Button";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MUIRichTextEditor from "mui-rte";
import {EditorState, convertFromHTML, ContentState, convertToRaw} from "draft-js";
import FileDownload from "js-file-download";
import {stateToHTML} from "draft-js-export-html";


const OrderDetail = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const params = useParams();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    const [edit, setEdit] = useState({readOnly: true, inputVariant: 'filled', btnText: 'Upravit'});
    const [editorDefault, setEditorDefault] = useState(ContentState.createFromBlockArray(convertFromHTML('').contentBlocks));

    const getOrder = async () => {
        const {data} = await axios.get(`/orders/list/${params.orderId}`);
        setOrder(data.order);
        const blocksFromHTML = convertFromHTML(data.order.orderText);
        setEditorDefault(ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        ));
    };

    useEffect(() => {
        getOrder();
    }, [params]);

    const handeEdit = async (event) => {
        event.preventDefault();
        const orderData = {...order, orderText: stateToHTML(editorState.getCurrentContent())}
        return await axios.put(`/orders/update/${order._id}`, {order: orderData})
            .then((data) => {
                handelToggleEdit();
            }).catch((err) => {
                console.log(err)
            });

    };

    const handelToggleEdit = () => {
        setEdit({
            readOnly: !edit.readOnly,
            inputVariant: edit.inputVariant === 'filled' ? 'standard' : 'filled',
            btnText: edit.btnText === 'Zrušit' ? 'Upravit' : 'Zrušit'
        });
        if(!edit.readOnly) {
            getOrder();
        }
    }

    const handleDelete = async () => {
        return await axios.delete('/orders/delete', {data: {orderId: params.orderId}})
            .then(() => {
                navigate('/orders');
            }).catch((err) => {
                console.log(err)
            });
    }

    const handleExport = async () => {
        await axios.post(`/orders/export/${order._id}`, {}, {responseType: 'blob'})
            .then((response) => {
                FileDownload(response.data, `${order.orderNumber}.pdf`);
            })
            .catch((err) => {
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
                justifyContent: 'center'
            }}>
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>{order && order.orderNumber}</Typography>
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
                        Detail objednávky
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="success" onClick={handleExport}>Exportovat do PDF</Button>
                <Button variant="contained" color="secondary" onClick={handelToggleEdit}>{edit.btnText}</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Odstranit</Button>
            </Stack>
            {order &&
                <Paper elevation={5} sx={{p: 2, m: 2}}>
                    <Box component="form" noValidate onSubmit={handeEdit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="orderNumber"
                                    required
                                    fullWidth
                                    id="orderNumber"
                                    label="Číslo objednávky"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.orderNumber}
                                    onChange={(event) => setOrder({...order, orderNumber: event.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Datum objednávky"
                                        value={order.date}
                                        name="orderDate"
                                        id="orderDate"
                                        readOnly={edit.readOnly}
                                        onChange={(newDate) => {
                                            setOrder({...order, date: newDate})
                                        }}
                                        renderInput={(params) => <TextField
                                            variant={edit.inputVariant}
                                            required fullWidth {...params}
                                        />}
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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.name}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {...order.supplier, name: event.target.value}
                                    })}

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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.email}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {...order.supplier, email: event.target.value}
                                    })}

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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.phone}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {...order.supplier, phone: event.target.value}
                                    })}

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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.idNumber}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {...order.supplier, idNumber: event.target.value}
                                    })}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="street"
                                    label="Ulice"
                                    id="street"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.address.street}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {
                                            ...order.supplier,
                                            address: {...order.supplier.address, street: event.target.value}
                                        }
                                    })}

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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {
                                            ...order.supplier,
                                            address: {...order.supplier.address, street: event.target.value}
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="city"
                                    label="Město"
                                    id="city"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.address.city}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {
                                            ...order.supplier,
                                            address: {...order.supplier.address, city: event.target.value}
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="country"
                                    label="Stát"
                                    id="country"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.supplier.address.country}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        supplier: {
                                            ...order.supplier,
                                            address: {...order.supplier.address, country: event.target.value}
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="copyTo"
                                    label="Kopie"
                                    id="copyTo"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.copyTo}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        copyTo: event.target.value
                                    })}
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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={order.projectName}
                                    onChange={(event) => setOrder({
                                        ...order,
                                        projectName: event.target.value
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Tělo objednávky
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{mb: 3}}>
                                    <MUIRichTextEditor readOnly={edit.readOnly}
                                                       defaultValue={order.orderText && JSON.stringify(convertToRaw(editorDefault))}
                                                       editorState={editorState} onChange={setEditorState}
                                                       label="Text objednávky"/>
                                </Box>
                            </Grid>
                        </Grid>
                        {!edit.readOnly &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Upravit
                            </Button>
                        }
                    </Box>
                </Paper>
            }
        </Box>
    );
}

export default OrderDetail;