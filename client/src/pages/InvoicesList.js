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
import PageHeader from "../components/PageHeader";

const InvoicesList = () => {
    const [invoices, setInvoices] = useState([]);
    useEffect(() => {

        const getInvoices = async () => {
            const {data} = await axios.get('/invoices/list');
            setInvoices(data.response);
        };
        getInvoices();
    }, [])

    return (
        <Box component="main" sx={{flexGrow: 1, p: 5, overflowX: 'auto'}}>
            <SideBarHeader/>
            <PageHeader header={'Faktury'}/>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">Vytvořit fakturu</Button>
            </Box>
            <Paper elevation={5} >
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Číslo faktury</TableCell>
                                <TableCell>Odběratel</TableCell>
                                <TableCell>Projekt</TableCell>
                                <TableCell>Datum splatnosti</TableCell>
                                <TableCell>Částka</TableCell>
                                <TableCell>Stav</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map((row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button component={Link} to={row.id.toString()}>{row.number}</Button>
                                    </TableCell>
                                    <TableCell>{row.client_name}</TableCell>
                                    <TableCell>Text</TableCell>
                                    <TableCell>{row.due_on}</TableCell>
                                    <TableCell>{row.total + ' ' + row.currency}</TableCell>
                                    <TableCell>{row.status}</TableCell>
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

export default InvoicesList;