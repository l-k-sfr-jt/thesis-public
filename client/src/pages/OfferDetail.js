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
    const [offer, setOffer] = useState(null);
    const params = useParams();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    const [edit, setEdit] = useState({readOnly: true, inputVariant: 'filled', btnText: 'Upravit'});
    const [editorDefault, setEditorDefault] = useState(ContentState.createFromBlockArray(convertFromHTML('').contentBlocks));

    const getOffer = async () => {
        const {data} = await axios.get(`/offers/list/${params.offerId}`);
        setOffer(data.offer);
        const blocksFromHTML = convertFromHTML(data.offer.offerText);
        setEditorDefault(ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        ));
    };

    useEffect(() => {
        getOffer();
    }, [params]);

    const handleEdit = async (event) => {
        event.preventDefault();
        const data = {...offer, offerText: stateToHTML(editorState.getCurrentContent())}
        return await axios.put(`/offers/update/${offer._id}`, {offer: data})
            .then((data) => {
                toggleEdit();
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
        if(!edit.readOnly) {
            getOffer();
        }
    }

    const handleDelete = async () => {
        return await axios.delete('/offers/delete', {data: {offerId: params.offerId}})
            .then(() => {
                navigate('/offers');
            }).catch((err) => {
                console.log(err)
            });
    }

    const handleExport = async () => {
        await axios.post(`/offers/export/${offer._id}`, {}, {responseType: 'blob'})
            .then((response) => {
                FileDownload(response.data, `${offer.offerNumber}.pdf`);
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>{offer && offer.offerNumber}</Typography>
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
                        Detail nabídky
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="success" onClick={handleExport}>
                    Exportovat do PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={toggleEdit}>{edit.btnText}</Button>

                <Button variant="contained" color="error" onClick={handleDelete}>
                    Odstranit
                </Button>
            </Stack>
            {offer &&
                <Paper elevation={5} sx={{p: 2, m: 2}}>
                    <Box component="form" noValidate onSubmit={handleEdit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="offerNumber"
                                    required
                                    fullWidth
                                    id="offerNumber"
                                    label="Číslo nabídky"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={offer.offerNumber}
                                    onChange={(event) => setOffer({...offer, offerNumber: event.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Datum nabídky"
                                        value={offer.date}
                                        name="orderDate"
                                        id="orderDate"
                                        readOnly={edit.readOnly}
                                        onChange={(newDate) => {
                                            setOffer({...offer, date: newDate})
                                        }}
                                        renderInput={(params) =>
                                            <TextField variant={edit.inputVariant} required fullWidth {...params}/>
                                        }
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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={offer.partner.name}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        partner: {...offer.partner, name: event.target.value}
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
                                    value={offer.partner.email}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        partner: {...offer.partner, email: event.target.value}
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
                                    value={offer.partner.phone}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        partner: {...offer.partner, phone: event.target.value}
                                    })}

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
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={offer.company.name}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        company: {...offer.company, name: event.target.value}
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="idNumber"
                                    label="IČO"
                                    type="number"
                                    id="idNumber"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={offer.company.idNumber}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        company: {...offer.company, idNumber: event.target.value}
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="taxNumber"
                                    label="DIČ"
                                    id="taxNumber"
                                    InputProps={{
                                        readOnly: edit.readOnly,
                                    }}
                                    variant={edit.inputVariant}
                                    value={offer.company.taxNumber}
                                    onChange={(event) => setOffer({
                                        ...offer,
                                        company: {...offer.company, taxNumber: event.target.value}
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
                                    value={offer.copyTo}
                                    onChange={(event) => setOffer({...offer, copyTo: event.target.value})}

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
                                    value={offer.scope}
                                    onChange={(event) => setOffer({...offer, scope: event.target.value})}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Tělo nabídky
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{mb: 3}}>
                                    <MUIRichTextEditor readOnly={edit.readOnly}
                                                       defaultValue={offer.offerText && JSON.stringify(convertToRaw(editorDefault))}
                                                       editorState={editorState} onChange={setEditorState}
                                                       label="Text nabidky"/>
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