import React, {useEffect, useState} from 'react'
import {
    Avatar,
    Box,
    Breadcrumbs,
    Divider,
    Paper, Stack,
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
import {stringAvatar} from "../utils/utils";
import AddIcon from "@mui/icons-material/Add";



const UsersList = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getTechnicians = async () => {
            const {data} = await axios.get('/technicians/list');
            setUsers(data.technicians);
        };
        getTechnicians();
    }, []);

    return (
        <Box component="main" sx={{flexGrow: 1, p: 3, overflowX: 'auto'}}>
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Technici</Typography>
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
                        Technici
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">
                    <AddIcon />
                    Přidat technika</Button>
            </Box>
            <Paper elevation={5}>
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer sx={{overflowX: 'scroll'}} component={Paper}>
                    <Table sx={{minWidth: 250}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Jméno</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Pozice</TableCell>
                                <TableCell>Úpravy</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row) => (
                                <TableRow
                                    hover
                                    key={row._id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Stack direction="row" spacing={2}>
                                            <Avatar {...stringAvatar(`${row.firstName} ${row.lastName}`)} />
                                            <Button component={Link} to={row._id}>{row.firstName} {row.lastName}</Button>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.position.label}</TableCell>
                                    <TableCell>{}</TableCell>
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

export default UsersList;