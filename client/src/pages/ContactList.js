import React, {useEffect, useState} from 'react'
import {
    Box,
    Breadcrumbs,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import SideBarHeader from "../components/SideBarHeader";
import axios from "axios";
import {Link, Outlet} from "react-router-dom";
import Button from "@mui/material/Button";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    useEffect(() => {

        const getContacts = async () => {
            const {data} = await axios.get('/invoices/contacts');
            setContacts(data.response);
        };
        getContacts();
    }, [])

    return (
        <Box component="main" sx={{flexGrow: 1, p: 5, overflowX: 'auto'}}>
            <SideBarHeader/>
            <Paper elevation={5} sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                },
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Kontakty</Typography>
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
                    <Typography
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                    >
                        <GrainIcon sx={{mr: 0.5}} fontSize="inherit"/>
                        Kontakty
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">Přidat kontakt</Button>
            </Box>
            <Paper elevation={5} >
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Společnost</TableCell>
                                <TableCell>Stát</TableCell>
                                <TableCell>IČ</TableCell>
                                <TableCell>Variabilní symbol</TableCell>
                                <TableCell>Splatnost faktur</TableCell>
                                <TableCell>Typ kontaktu</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((row) => (
                                <TableRow
                                    hover
                                    key={row._id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button component={Link} to={row.id}>{row.name}</Button>
                                    </TableCell>
                                    <TableCell>{row.country}</TableCell>
                                    <TableCell>{row.registration_no}</TableCell>
                                    <TableCell>{row.variable_symbol}</TableCell>
                                    <TableCell>{row.due} dní</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Outlet />
        </Box>
    );
}

export default ContactList;