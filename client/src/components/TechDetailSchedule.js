import React, {Fragment, useContext, useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import {
    Box,
    Divider, IconButton,
    List,
    ListItem,
    ListItemText, Stack, TextField,
    Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {DateTimePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Button from "@mui/material/Button";

import {TechContext} from "../hooks/TechContext";

const TechDetailSchedule = ({projectId}) => {
    const [schedule, setSchedue] = useState([]);
    const [dateTimeFrom, setDateTimeFrom] = useState(new Date());
    const [dateTimeTo, setDateTimeTo] = useState(new Date());
    const [tech, setTech] = useState(null);
    const {selectedTech} = useContext(TechContext);

    useEffect(() => {
        const getTechnician = async () => {
            const {data} = await axios.get(`/technicians/list/${selectedTech}`);
            setTech(data.tech);
            if (data.tech.projects) {
                const project = data.tech.projects.filter(projects => projects.projectId._id === projectId)[0];
                setSchedue(project.workDays)
            }
        };
        if (selectedTech)
            getTechnician();

    }, [selectedTech])

    const updateSchedule = async (timesheet) => {
        const techData = {_id: tech._id, projectId, workDays: timesheet};
        axios.put('/technicians/update', {
            techData
        }).then(response => {
            setSchedue(response.data.projects[0].workDays)
        }).catch((err) => {
        });
    }

    const handleAddTime = (e) => {
        e.preventDefault();
        const timesheet = [...schedule, {from: dateTimeFrom, to: dateTimeTo}];
        return updateSchedule(timesheet);
    }

    const handleRemoveShift = (index) => {
        const timesheet = schedule;
        timesheet.splice(index, 1);
        return updateSchedule(timesheet);
    }

    return (
        <Box>
            <Typography variant='h6'>Rozvrh Technika </Typography>
            <Divider/>
            {selectedTech ? (
                <Fragment>
                    {schedule.length > 0 ?
                        (<List sx={{width: '100%', bgcolor: 'background.paper'}}>
                            {schedule.map((listItem, index) => (
                                <ListItem key={index}>
                                    <ListItemText sx={{fontWeight: 500}}
                                                  primary={`${moment(listItem.from).format('HH:mm DD.MM.YYYY')} - ${moment(listItem.to).format('HH:mm DD.MM.YYYY')} `}/>
                                    <IconButton onClick={() => handleRemoveShift(index)} sx={{justifyContent: 'center'}}>
                                        <CancelIcon />
                                    </IconButton>

                                </ListItem>
                            ))}
                        </List>) : (
                            <Typography variant='subtitle2'>Vybraný technik nemá žádné hodiny</Typography>
                        )}
                    <Typography variant='h6'>Přidat pracovní dny</Typography>
                    <Divider/>
                    <Box component="form" noValidate onSubmit={handleAddTime} sx={{mt: 3}}>
                        <Stack spacing={1} direction='row' justifyContent='space-between'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Datum a čas od"
                                    value={dateTimeFrom}
                                    onChange={(newValue) => {
                                        setDateTimeFrom(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Datum a čas do"
                                    value={dateTimeTo}
                                    onChange={(newValue) => {
                                        setDateTimeTo(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        </Stack>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color='primary'
                        >
                            Přidat dny
                        </Button>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        color='error'
                    >
                        Odebrat z projektu
                    </Button>
                </Fragment>

            ) :
                <Typography>Vyberte technika</Typography>
            }

        </Box>
    );
}

export default TechDetailSchedule;