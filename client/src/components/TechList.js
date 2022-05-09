import React, {useContext, useEffect, useState} from 'react';
import {
    Autocomplete,
    Avatar,
    Box, CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText, TextField,
    Typography
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import Button from "@mui/material/Button";
import axios from "axios";
import {TechContext} from "../hooks/TechContext";


const TechList = ({techIds, projectId}) => {
    const {selectedTech, setSelectedTech} = useContext(TechContext);
    const [techs, setTechs] = useState([]);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        const getTechs = async () => {
            const {data} = await axios.get('/api/technicians/list');
            if (active) {
                const filteredTechs = data.technicians.filter(({_id}) => !techIds.includes(_id));
                setOptions([...filteredTechs]);
            }
        };

        getTechs();
        return () => {
            active = false;
        };
    }, [loading, techIds]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        const getTechs = async () => {
            const {data} = await axios.get('/api/technicians/list', {params: {techIds}});
            setTechs(data.technicians);
        };
        if (techIds.length > 0)
            getTechs();
    }, [techIds])

    const handleAddTech = (event) => {
        event.preventDefault();
        if (selectedOption) {
            const projectData = {
                techId: selectedOption._id,
                projectId
            }
            return axios.post('/api/projects/addTech', {
                projectData
            })
        }
    }
    return (
        <Box>
            <Typography variant='h6'>Seznam techniků</Typography>
            <Divider/>
            {techs.length > 0 &&
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {techs.map(listItem => (
                        <ListItem key={listItem._id} selected={selectedTech === listItem._id} onClick={() => {
                            setSelectedTech(listItem._id);
                        }}>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar>
                                        <WorkIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${listItem.firstName} ${listItem.lastName}`}
                                    secondary={listItem.position?.label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>}
            <Typography variant='h6'>Přidat technika</Typography>
            <Box component="form" noValidate onSubmit={handleAddTech} sx={{mt: 3}}>
                <Autocomplete
                    id="asynchronous-demo"
                    sx={{width: 300}}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.position.label}`}
                    options={options}
                    loading={loading}
                    onChange={(event, newOption) => setSelectedOption(newOption)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Technik"
                            name="tech"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ?
                                            <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Přidat technika
                </Button>
            </Box>
        </Box>

    );
}

export default TechList;