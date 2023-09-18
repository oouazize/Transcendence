import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import UserContext from '../Context/UserContext'

export default function Logout () {

    const {user, navigate} = useContext(UserContext)

    const logout = async () => {
        try {
            const res = await axios.post(`/api/user/logout/${user.id}`)
            if (res.data.length === 0)
                navigate('/sign');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect( () => {
        logout();
    }, [user])
    return (
        <h2>LOGGING OUT...</h2>
    );
}