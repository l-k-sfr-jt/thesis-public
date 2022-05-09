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
import AddIcon from '@mui/icons-material/Add';
import StatusChip from "../../../../../thesis-public/client/src/components/StatusChip";
import moment from "moment/moment";

const ProjectsList = () => {
    const [projects, setProject] = useState([]);
    useEffect(() => {

        const getProjects = async () => {
            const {data} = await axios.get('/api/projects/list');
            setProject(data.projects);
        };
        getProjects();
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
                <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>Projekty</Typography>
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
                        Projekty
                    </Typography>
                </Breadcrumbs>
            </Paper>
            <Box textAlign="right">
                <Button component={Link} to="create" variant="contained">
                    <AddIcon />
                    Vytvořit projekt</Button>
            </Box>
            <Paper elevation={5} >
                <Typography variant="h6" sx={{p: 2, m: 2}}>Seznam</Typography>
                <Divider/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Stav</TableCell>
                                <TableCell>Název projektu</TableCell>
                                <TableCell>Místo</TableCell>
                                <TableCell>Objednavatel</TableCell>
                                <TableCell>Datum od - do</TableCell>
                                <TableCell>Akce</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((row) => (
                                <TableRow
                                    hover
                                    key={row._id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell><StatusChip status={row.status} /></TableCell>
                                    <TableCell component="th" scope="row">
                                        <Button component={Link} to={row._id}>{row.name}</Button>
                                    </TableCell>
                                    <TableCell >{row.customer.company} - {row.customer.city}</TableCell>
                                    <TableCell >{row.orderer.name}</TableCell>
                                    <TableCell>{moment(row.dateFrom).format('DD.MM.YYYY')} - {moment(row.dateTo).format('DD.MM.YYYY')}</TableCell>
                                    <TableCell></TableCell>
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

export default ProjectsList;