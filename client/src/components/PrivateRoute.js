import React, {useContext} from "react";
import {UserContext} from "../hooks/UserContext";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import {Navigate} from "react-router-dom";


const PrivateRoute = ({children}) => {
    const {user, isLoading} = useContext(UserContext);

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
                <CircularProgress size={120} />
            </Box>
        );
    }


    if (user) {
        return children;
    }

    return (<Navigate to='/signin'/>);
}

export default PrivateRoute;