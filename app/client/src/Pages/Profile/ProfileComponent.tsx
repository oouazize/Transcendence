import "../../scss/profileComponent.scss";
import GameHistory from "../../Components/gameHistory";
import profileImage from "../../Assets/DreamShaper_32_young_man_character_playing_ping_pong_full_body_3.jpeg"
import FriendsCard from "../../Components/friendsCard";
import AchievementCard from "../../Components/achievementCard";
import axios from "axios";
import { useEffect } from "react";
import {User} from "../../../../global/Interfaces"


export default function ProfileComponent({UserData}: {UserData: User}) {

    useEffect(() => {
        const SendRequest = async () => {
            try {
                await axios.post(`api/user/addfriend/${UserData.id}?friendId=2`, null)
            }
            catch (err) {
                console.log("error : adding an existing friend")
                console.log(err)
            }
        }
        SendRequest();
    }, [])

    const level = 70
    return (
        <div className="profileComponent">
            <div className="item ProfileCard">
                <div className="image">
                    <img src={UserData.image} alt="" />
                </div>
                <h2>{UserData.firstname + " " + UserData.lastname}</h2>
                <p>{UserData.username}</p>
                <p>online</p>
                <p>level 14</p>
                <div className="level_bar">
                    <div className="level-bar-fill" style={{ width: `${level}%` }}></div>
                </div>
                <div className="footer">
                    <button className="friend-request">add as friend</button>
                    <button className="DM">send message</button>
                </div>
            </div>
            <GameHistory UserData={UserData} />
            <FriendsCard user={UserData} />
            <AchievementCard user={UserData} />
        </div>
    )
}