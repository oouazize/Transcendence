import React, {createContext, useState, useEffect} from 'react'
import { User } from '../../../global/Interfaces';
import axios from 'axios'
import { getUserImage } from '../Hooks/getUserImage';

const UserContext = createContext({});

export function UserProvider ({children}) {
    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false)

    const fetchUserData = async () => {
        try {
          const response = await axios.get<User>("/api/user"); 
          const image = await getUserImage(response.data.id)
          setUser({...response.data, image});
          
        } catch (error) {
          // console.log(error);
        }
      };

    useEffect(() => {
        void fetchUserData();
      }, [])

    return (
      <>
        <UserContext.Provider value={{
            user, setUser,
            authenticated, setAuthenticated,
            isAnimationFinished, setIsAnimationFinished,
        }}>
            {children}
        </UserContext.Provider>
      </>
    );
} 

export default UserContext;
