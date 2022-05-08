import * as React from 'react';
import {Chip} from "@mui/material";
import {useContext, useEffect, useState} from "react";

const options = [ 'Rezervováno', 'Obejdnáno', 'Vyfakturováno'];
const colors = ['primary', 'warning', 'success']


export default function StatusChip({status}) {
    const [type, setType] = useState({label: options[0], color: colors[0]});

    useEffect( () =>{
        switch (status) {
            case 'ordered':
                return setType({label: options[1], color: colors[1]});
            case 'done':
             return setType({label: options[2], color: colors[2]});
            default:
                return setType({label: options[0], color: colors[0]});
        }

    }, [setType])

    return (
        <Chip label={type.label} color={type.color} />

    );
}
