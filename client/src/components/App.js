import React, {useState} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import {UserContext} from '../hooks/UserContext';
import PrivateRoute from "./PrivateRoute";
import useGetUser from "../hooks/useGetUser";
import Navigation from "./Navigation";
import SideBar from "./SideBar";
import SideBarContext from "../context/SideBarContext";
import UsersList from "../pages/UsersList";
import Box from "@mui/material/Box";
import UserDetail from "../pages/UserDetail";
import OrdersList from "../pages/OrdersList";
import OrderCreate from "../pages/OrderCreate";
import ProjectsList from "../pages/ProjectsList";
import ProjectCreate from "../pages/ProjectCreate";
import OffersList from "../pages/OffersList";
import OfferCreate from "../pages/OfferCreate";
import UserCreate from "../pages/UserCreate";
import OrderDetail from "../pages/OrderDetail";
import OfferDetail from "../pages/OfferDetail";
import ProjectDetail from "../pages/ProjectDetail";
import InvoicesList from "../pages/InvoicesList";
import ContactList from "../pages/ContactList";
import ContactCreate from "../pages/ContactCreate";
import InvoiceCreate from "../pages/InvoiceCreate";
import InvoiceDetail from "../pages/InvoiceDetail";


const App = () => {
    const {user, setUser, isLoading} = useGetUser();
    const [sidebar, setSidebar] = useState(false);

    return (
        <UserContext.Provider value={{user, setUser, isLoading}}>
            <Routes>
                <Route path="signin" element={<SignIn/>}/>
                <Route
                    path="dashboard"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <Dashboard/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="projects"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <ProjectsList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="projects/:projectId"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <ProjectDetail/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="projects/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <ProjectCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="technicians"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <UsersList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="technicians/:technicianId"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <UserDetail/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="technicians/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <UserCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="orders"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OrdersList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="orders/:orderId"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OrderDetail/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="orders/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OrderCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="offers"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OffersList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="offers/:offerId"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OfferDetail/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="offers/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <OfferCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="invoices"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <InvoicesList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="invoices/:invoiceId"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <InvoiceDetail/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="invoices/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <InvoiceCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="contacts"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <ContactList/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="contacts/create"
                    element={
                        <PrivateRoute>
                            <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                <Box sx={{display: 'flex'}}>
                                    <Navigation/>
                                    <SideBar/>
                                    <ContactCreate/>
                                </Box>
                            </SideBarContext.Provider>
                        </PrivateRoute>
                    }
                />
                <Route path='/'
                       element={
                           <PrivateRoute>
                               <SideBarContext.Provider value={{setSidebar, sidebar}}>
                                   <Box sx={{display: 'flex'}}>
                                       <Navigation/>
                                       <SideBar/>
                                       <Dashboard/>
                                   </Box>
                               </SideBarContext.Provider>
                           </PrivateRoute>
                       }/>
                <Route path='*'
                       element={<Navigate to="/dashboard" replace />}
                       />
            </Routes>
        </UserContext.Provider>
    );
}

export default App;