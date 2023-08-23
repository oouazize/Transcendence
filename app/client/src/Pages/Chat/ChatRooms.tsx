import React, {createContext, useState, useCallback, useEffect, useRef, useContext} from 'react'
import ChatOverview from './ChatOverview';
import { useParams } from 'react-router-dom'
import RoomHeader from "./RoomHeader"
import "../../scss/chat.scss"
import InboxRooms from './InboxRooms';
import {rooms, roomData, Message} from "../../../../global/Interfaces"
import MessageBox from "../../Components/MessageBox"
import io, {Socket} from "socket.io-client"
import UserContext from "../../Context/UserContext"
import Notification from "../../Components/Notification"
import AddUser from "./addUser"
// import useScrollableBox from "../../Hooks/useScrollableBox"


export const SocketContext = createContext({});


export default function ChatRooms () {


    const [room, setRoom] = useState<rooms>({id: 0, channel_name: "", channel_type: ""})
    const [socket, setSocket] = useState<Socket>()
    const [message, setMessage] = useState<string>("")
    const [messageList, setMessageList] = useState<Message[]>([])
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const {user} = useContext(UserContext)
    const initState = useRef<boolean>(false)
    const ini = useRef<boolean>(false)
    // const {outerDiv, innerDiv, OuterProvider, InnerProvider, handleScrollButtonClick} = useScrollableBox(messageList);
    const outerDiv = useRef<HTMLDivElement>(null);
    const innerDiv = useRef<HTMLDivElement>(null);
    const prevInnerDivHeight = useRef<HTMLDivElement>(null);


    const [roomData, setRoomData] = useState<roomData>({} as roomData)
    const [notif, setNotif] = useState<string>("")

    const sendMessage = (event: Event) => {
        event.preventDefault();
        
        if (message !== "") {
          const messageData: Message = {
            message: message,
            channelName: room.channel_name,
            fromUser: user.id,
            username: user.username,
            image: user.image
          };
          socket?.emit("channelMessage", messageData);
          setMessage("");
          handleScrollButtonClick()
        const outerDivHeight = outerDiv.current.clientHeight;
        const innerDivHeight = innerDiv.current.clientHeight + 24;
    
        outerDiv.current.scrollTo({
          top: innerDivHeight - outerDivHeight,
          left: 0,
          behavior: "smooth"
        });
        }
      }

    useEffect(() => {
        // const value = document.cookie.split('=')[1]
        const fd = io("ws://localhost:1313", {
            withCredentials: true,
          })
        setSocket(fd)

        // const outerDivHeight = outerDiv.current.clientHeight;
        // const innerDivHeight = innerDiv.current.clientHeight + 24;
    
        // outerDiv.current.scrollTo({
        //   top: innerDivHeight - outerDivHeight,
        //   left: 0,
        //   behavior: "smooth"
        // });

        return  () => {
            if (socket)
                socket.disconnect();
        }
    }, [])

    useEffect(() => {
        const outerDivHeight = outerDiv.current.clientHeight;
        console.log("🚀 ~ useEffect ~ outerDivHeight:", outerDivHeight)
        const innerDivHeight = innerDiv.current.clientHeight + 24;
        console.log("🚀 ~ useEffect ~ innerDivHeight:", innerDivHeight)
        console.log("🚀 ~ useEffect ~ prevInnerDivHeight:", prevInnerDivHeight.current)
        const outerDivScrollTop = outerDiv.current.scrollTop;
        console.log("🚀 ~ useEffect ~ outerDivScrollTop:", outerDivScrollTop)

        if (
        !prevInnerDivHeight.current ||
        outerDivScrollTop === prevInnerDivHeight.current - outerDivHeight
        ) {
            outerDiv.current.scrollTo({
                top: innerDivHeight - outerDivHeight,
                left: 0,
                behavior: prevInnerDivHeight.current ? "smooth" : "auto"
            });
        }

        prevInnerDivHeight.current = innerDivHeight;
      }, [messageList]);

    useEffect(() => {
        if (!initState.current) {
            initState.current = true;
            return;
        }
        socket?.emit("accessChannel", roomData);

        return  () => {
            if (socket)
                socket.emit("leavechannel", roomData);
        }
    }, [roomData, socket]);
    
    useEffect(() => {
        setRoomData({
            channelName: room.channel_name,
            userId: user?.id,
        });
    }, [user, room]);
    

    useEffect(() => {
        console.log("ko")

        if (ini.current === false)
        {
            ini.current = true
            return ;
        }
        socket?.on("sendChannelMessage", (data: Message)  => {
            setMessageList((list) => [...list, data]);
        });

        socket?.on('userIsBanned', (message: string) => setNotif(message))

        socket?.on('socketDisconnect', (channelName: string) => {
            const newData = {channelName: channelName, userId: user?.id}
            socket?.emit('leavechannel', newData)
        })
    }, [socket]);


    const messagesElements = messageList.map((mess) => {
        return (
            <MessageBox id={mess.fromUser !== user?.id}
            username={mess?.username}
            avatar={mess?.image}
            >
                {mess.message}
            </MessageBox>
        )
    })

    if (!socket && !room) {
        return null;
    }
    const {id} = useParams()

    function handleEnter(event) {
        if (event.key === 'Enter') {
            sendMessage(event);
        }
    }

    return (
        <SocketContext.Provider value={{socket, setSocket, room, setRoom, roomData, showSearch, setShowSearch}}>
            {/* {notif && <Notification message={notif} />} */}
            {
            showSearch &&
                <div className="bg-violet-700 bg-opacity-90 z-50 addUser absolute flex items-center justify-center top-0 left-0 w-full h-full">
                    <AddUser/>
                </div>
            }
            <InboxRooms />
            <div className="chat_main">
                <RoomHeader />
                {/* <OuterProvider className="chat_window bg-chat-body" outerDiv={outerDiv}>
                    <InnerProvider innerDiv={innerDiv}> */}
                <section className="chat_window bg-chat-body" ref={outerDiv} style={{position: 'relative', height: '100%', overflowY: 'scroll'}}>
                    <div ref={innerDiv} style={{position: 'relative'}}>
                        {messagesElements}
                    </div>
                    {/* </InnerProvider>
                    </OuterProvider> */}
                </section>
                <form className="chat_input" onSubmit={sendMessage}>
                    <textarea
                    placeholder="Type something"
                    onKeyDown={handleEnter}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className='bg-primary-pink' type="submit">Send</button>
                </form>
            </div>
            <ChatOverview />
        </SocketContext.Provider>
    );
}