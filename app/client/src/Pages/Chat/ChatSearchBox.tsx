import React, { useEffect, useContext } from 'react'
import axios, {AxiosResponse} from "axios"
import {User} from '../../../global/Interfaces'
import {getUserImage} from '../../Hooks/getUserImage'
import UserCard from './UserCard'
import UserContext from '../../Context/UserContext'
import useEffectOnUpdate from '../../Hooks/useEffectOnUpdate'

export default function ChatSearchBox () {
    const [currentSearch, setCurrentSearch] = React.useState<string>("")
    const [submittedName, setSubmittedName] = React.useState<string>("")
    const [searchedUser, setSearchedUser] = React.useState<User | null>(null);
    const initialRender = React.useRef<boolean>(true)
    const {setNotif} = useContext(UserContext)

    const submitStyle = {
        marginTop: "1em",
    }
    function handleChange (e: {target: {value: string}}) {
        setCurrentSearch(e.target.value)
    }

    function handleSubmit (e: React.FormEvent<HTMLElement>) {
        e.preventDefault()
        if (currentSearch.trim())
            setSubmittedName(currentSearch.trim())
    }

    useEffectOnUpdate(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }
        async function getUserCard () {
            try {
                const response: AxiosResponse<User> = await axios(`/api/user/search/user/?username=${submittedName}`)
                const imgRes = await getUserImage(response.data.id)
                setSearchedUser({...response.data, image: imgRes})
            } catch (err) {
                setNotif("User not Found");
                // console.log(err);
            }
        }
        void getUserCard()
    }, [submittedName])
    return (
        <section className="search_box">
            <form onSubmit={handleSubmit}>
                <label>Search</label>
                <input 
                type="search"
                placeholder="Type a username"
                onChange={handleChange}
                value={currentSearch}
                />
                <input style={submitStyle}type="submit" value="submit" />
            </form>
            {
                searchedUser && 
                <UserCard 
                    userData={searchedUser}
                    message={true}
                    friend={false}
                />
            }
        </section>
    );
}