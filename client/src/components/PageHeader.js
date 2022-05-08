import React from 'react';
import {Breadcrumbs, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";


const PageHeader = ({header}) => {
    return (
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
            <Typography variant="h4" sx={{m: 2, flexGrow: 1}}>{header}</Typography>
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
                    {header}
                </Typography>
            </Breadcrumbs>
        </Paper>
    );
}

export default PageHeader;