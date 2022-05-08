import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SideBarHeader from "./SideBarHeader";
import {Box, Modal, Typography} from "@mui/material";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    boxShadow: 24,
    p: 4,
};

const Dashboard = () => {
    const [open, setOpen] = React.useState(false);
    const localizer = momentLocalizer(moment);
    const handleOpen = (event) => {
        setOpen(true);
        setSelectedProject(event);
    };
    const handleClose = () => setOpen(false);
    const [projects, setProject] = useState();
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const getProjects = async () => {
            const {data} = await axios.get('/projects/list');
            setProject(data.projects);
        };
        getProjects();
    }, [])

    return (
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
            <SideBarHeader/>
            <Calendar
                eventPropGetter={
                    (event, start, end, isSelected) => {
                        let newStyle = {
                            backgroundColor: "#556bd6",
                            borderRadius: "0px",
                            border: "none"
                        };

                        if (event.status === 'done'){
                            newStyle.backgroundColor = "#2e7d32"
                        }
                        else if (event.status === 'ordered'){
                            newStyle.backgroundColor = "#ed6c02"
                        }

                        return {
                            className: "",
                            style: newStyle
                        };
                    }
                }
                localizer={localizer}
                events={projects}
                startAccessor="dateFrom"
                endAccessor="dateTo"
                titleAccessor="name"
                style={{height: 500}}
                onSelectEvent={handleOpen}
                popup
            />
            {selectedProject &&
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <Link to={`/projects/${selectedProject._id}`}>{selectedProject.name}</Link>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            Zákazník: {selectedProject.customer.company} <br/>
                            Místo: {selectedProject.customer.city}
                        </Typography>
                    </Box>
                </Modal>
            }
        </Box>


    );
}

export default Dashboard;
