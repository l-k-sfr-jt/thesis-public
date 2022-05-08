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

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    useEffect(() => {

        const getOrders = async () => {
            const {data} = await axios.get('/orders/list');
            setOrders(data.orders);
        };
        getOrders();
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Objednávky</Typography>
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
                        Objednávky
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">Vytvořit objednávku</Button>
            </Box>
            <Paper elevation={5} >
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Číslo</TableCell>
                                <TableCell>Dodavatel</TableCell>
                                <TableCell>Datum</TableCell>
                                <TableCell>Projekt</TableCell>
                                <TableCell>Akce</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row) => (
                                <TableRow
                                    hover
                                    key={row._id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button component={Link} to={row._id}>{row.orderNumber}</Button>
                                    </TableCell>
                                    <TableCell>{row.supplier.name}</TableCell>
                                    <TableCell>{new Date(row.date).toISOString().split('T')[0]}</TableCell>
                                    <TableCell>{row.projectName}</TableCell>
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

export default OrdersList;