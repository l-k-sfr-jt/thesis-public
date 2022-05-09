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
import SideBarHeader from "../../../../../thesis-public/client/src/components/SideBarHeader";
import axios from "axios";
import {Link, Outlet} from "react-router-dom";
import Button from "@mui/material/Button";

const OffersList = () => {
    const [offers, setOffers] = useState([]);
    useEffect(() => {

        const getOffers = async () => {
            const {data} = await axios.get('/api/offers/list');
            setOffers(data.offers);
        };
        getOffers();
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Nabídky</Typography>
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
                        Nabídky
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">Vytvořit nabídku</Button>
            </Box>
            <Paper elevation={5} >
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Číslo</TableCell>
                                <TableCell>Společnost</TableCell>
                                <TableCell>Projekt</TableCell>
                                <TableCell>Partner</TableCell>
                                <TableCell>Datum</TableCell>
                                <TableCell>Akce</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {offers.map((row) => (
                                <TableRow
                                    hover
                                    key={row._id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button component={Link} to={row._id}>{row.offerNumber}</Button>
                                    </TableCell>
                                    <TableCell>{row.company.name}</TableCell>
                                    <TableCell>{row.scope}</TableCell>
                                    <TableCell>{row.partner.name}</TableCell>
                                    <TableCell>{new Date(row.date).toISOString().split('T')[0]}</TableCell>
                                    <TableCell>TODO</TableCell>
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

export default OffersList;