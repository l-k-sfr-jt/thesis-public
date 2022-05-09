import {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from './UserContext';

export default function useAuth() {
    let navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const [error, setError] = useState(null);


    const setUserContext = async () => {
        return await axios.get('/api/auth/checkUser').then(res => {
            setUser(res.data.user);
            navigate('/dashboard');
        }).catch((err) => {
            setError(err.response.data);
        });
    }

    const login = async (data) => {
        const {email, password} = data;
        return axios.post('/api/auth/signin', {
            email, password
        }).then(async () => {
            await setUserContext();
        }).catch((err) => {
            setError(err.response.data);
        });
    }

    const logout = () => {
        return axios.get('/api/auth/logout')
            .then(() => {
                setUser(null);
                navigate('/signin');
            }).catch((err) => {
                setError(err.response.data);
            });
    }


    return {
        error,
        login,
        logout
    }
}