import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import ToggleBtn from '../components/toggle-btn';
import Friend_Link_Server from '../../configs/server';
import axios from 'axios';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';

import {
    IoChevronForwardOutline, IoSearchCircle, IoChevronBackOutline, IoSend
} from 'react-icons/io5';
import { MdDeleteForever } from "react-icons/md";

export default function MessagesPage() {
    const { authenticatedUser, authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to handle active chat details
    const [activeChat, setActiveChat] = useState({
        userName: '', userId: '', userPic: ''
    });
    // State to store friends list
    const [friends, setFriends] = useState(undefined);
    // State to store the message to be sent
    const [sendMsg, setSendMsg] = useState('');
    // State to store the message ID to be deleted
    const [deleteMsg, setDeleteMsg] = useState('');
    // State to store chat messages
    const [chat, setChat] = useState(undefined);
    // State to store the active message thread
    const [message, setMessage] = useState('');
    // State to store search input
    const [search, setSearch] = useState('');
    // State to store search results
    const [results, setResults] = useState([]);

    // Fetch chat data when message, sendMsg, or deleteMsg change
    useEffect(() => {
        const getChatData = async () => {
            const url = `${Friend_Link_Server.Server()}/message/chat/${message}`;

            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                setChat(res.data);
            } catch (error) {
                handleAppLog('Could not get your chats', true);
            }
        };
        getChatData();
    }, [message, sendMsg, deleteMsg]);

    // Fetch friends data when component mounts
    useEffect(() => {
        const getFriendsData = async () => {
            const url = `${Friend_Link_Server.Server()}/follow/followings`;

            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                setFriends(res.data);
            } catch (error) {
                handleAppLog('Could not get your friends data', true);
            }
        };
        getFriendsData();
    }, []);

    // Filter friends based on search input
    useEffect(() => {
        if (search.length > 3) {
            const filteredResults = friends?.filter((friend) => friend.userId.includes(search)) || [];
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    }, [search, friends]);

    // Handle opening a message thread
    const handleOpenMessage = (friend) => {
        setMessage(friend.userId);
        setActiveChat({ ...activeChat, userName: friend.name, userId: friend.userId, userPic: friend.profile_pic });
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (sendMsg) {
            const url = `${Friend_Link_Server.Server()}/message/create`;

            try {
                const res = await axios.post(url, {
                    message: sendMsg,
                    receiver: activeChat.userId
                }, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                setSendMsg('');
            } catch (error) {
                handleAppLog('Error sending message', true);
            }
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (msgId) => {
        setDeleteMsg(msgId);

        const url = `${Friend_Link_Server.Server()}/message/delete/${msgId}`;

        try {
            const res = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${authenticatedToken}`
                }
            });
            if (res.status === 200) setDeleteMsg('');
        } catch (error) {
            handleAppLog('Error deleting message', true);
        }
    };

    return (
        <div className='grid grid-cols-12 size-full p-2'>

            {appLog?.message && <ToastBar log={appLog} />}

            <div className={`${message === '' ? 'flex' : 'hidden md:flex'} col-span-12 md:col-span-4 gap-4 flex-col overflow-y-auto no-scrollbar cursor-pointer`}>
                <div className='flex gap-2 h-12 p-1 items-center dark:bg-dark-2 bg-light-2 rounded-lg'>
                    <IoSearchCircle className='size-10 sec-text' />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {!results.length ? '' :
                    results.map((result, i) =>
                        <div key={i} className='flex h-12 gap-2 p-1 items-center rounded-lg dark:bg-dark-2 bg-light-2' onClick={() => handleOpenMessage(result)}>
                            <img src={`${Friend_Link_Server.DataBase.User_Avatar()}/${result?.profile_pic}`} alt="" className='size-10 rounded-full' />
                            <div className='flex flex-col items-center'>
                                <p>{result?.name}</p>
                                <p className='text-xs sec-text'>@ {result?.userId}</p>
                            </div>
                        </div>
                    )
                }

                {friends && friends.map((friend, index) =>
                    <div key={index} className='flex h-12 gap-2 p-1 items-center rounded-lg' onClick={() => handleOpenMessage(friend)}>
                        <img src={`${Friend_Link_Server.DataBase.User_Avatar()}/${friend?.profile_pic}`} alt="" className='size-10 rounded-full' />
                        <div className='flex flex-col items-center'>
                            <p>{friend?.name}</p>
                            <p className='text-xs sec-text'>@ {friend?.userId}</p>
                        </div>
                        <IoChevronForwardOutline className='ml-auto size-6 sec-text' />
                    </div>
                )}
            </div>

            <div className={`${message !== '' ? 'flex' : 'hidden md:flex'} col-span-12 md:col-span-8 flex-col relative`}>
                <div className='flex h-12 gap-4 items-center rounded-lg'>
                    <IoChevronBackOutline className='md:hidden block size-6' onClick={() => setMessage('')} />
                    <img src={activeChat?.userPic ? `${Friend_Link_Server.DataBase.User_Avatar()}/${activeChat.userPic}` : 'friend-link.png'} alt="" className='size-10 rounded-full md:ml-4' />
                    <div className='flex flex-col items-center'>
                        <p>{activeChat.userName || 'FriendLink'}</p>
                        <p className='text-xs sec-text'>@ {activeChat.userId || 'friendLink'}</p>
                    </div>
                </div>

                <div className='flex flex-col size-full mb-12 p-4 overflow-y-auto no-scrollbar '>
                    {chat?.map((msg, index) =>
                        <div key={index} className='flex w-full px-2 my-2'>
                            {msg.sender === authenticatedUser ?
                                <div className='flex ml-auto gap-2 items-center'>
                                    <p className='bg-orange-1 py-1 px-2 rounded-xl rounded-tr-none relative '>{msg.message}</p>
                                    <MdDeleteForever className='size-5 text-red-500' onClick={() => handleDeleteMessage(msg?.messageId)} />
                                </div>
                                : msg.receiver === authenticatedUser &&
                                <p className='mr-auto dark:bg-dark-2 bg-light-2 py-1 px-2 rounded-xl rounded-tl-none'>{msg.message}</p>
                            }
                        </div>
                    )}
                </div>

                <div className='flex w-full gap-4 justify-between absolute bottom-0 h-12 items-center px-4 dark:bg-dark-2 bg-light-2 rounded-lg'>
                    <input type='text' placeholder='Type a message' value={sendMsg} onChange={(e) => setSendMsg(e.target.value)} />
                    <IoSend className='size-6 sec-text' onClick={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}
