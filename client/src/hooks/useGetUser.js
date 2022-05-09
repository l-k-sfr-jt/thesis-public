import {useState, useEffect} from 'react';
import axios from 'axios';


export default function useGetUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function findUser() {
            await axios.get('/api/auth/checkUser', )
                .then(res => {
                    setUser(res.data.user);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                });
        }
        findUser();
    }, []);
    return {
        user,
        setUser,
        isLoading
    }
}