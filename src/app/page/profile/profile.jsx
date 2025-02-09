import React, { useState, useEffect, useContext } from 'react'
import Friend_Link_Server from '../../../configs/server';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../contexts/auth'
import { formatDate, formatNumber } from '../../../functions'
import axios from 'axios';
import { AppLogContext } from '../../../contexts/app-log';
import ToastBar from '../../components/toast';

import {
    IoCalendar, IoBalloon
} from 'react-icons/io5'

export default function ProfilePage() {
    const { authenticatedToken, authenticatedUser } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    const [userData, setUserData] = useState(undefined);
    const [postData, setPostData] = useState(undefined);

    useEffect(() => {
        const getUserData = async () => {
            const res = await axios.get(`${Friend_Link_Server.Server()}/user/profile/${authenticatedUser}`)

            setUserData(res.data);
        }
        const getPostData = async () => {
            const res = await axios.get(`${Friend_Link_Server.Server()}/user/posts`, {
                headers: {
                    Authorization: `Bearer ${authenticatedToken}`
                }
            })

            setPostData(res.data);
        }

        getUserData();
        getPostData();

    }, [])

    return (
        <div className='flex flex-col size-full p-2 overflow-y-auto no-scrollbar'>

            {appLog?.message && <ToastBar log={appLog} />}

            <div className='grid grid-cols-4 gap-2 items-center'>

                <div className='col-span-1 flex'>
                    <img src={`${Friend_Link_Server.DataBase.User_Avatar()}/${userData?.profile_pic}`} alt="" className='size-full max-w-40 max-h-40 rounded-full' />
                </div>

                <div className='col-span-1 flex flex-col gap-2 items-center'>
                    <p className='font-bold'>{formatNumber(userData?.posts)}</p>
                    <p className='font-semibold sec-text'>posts</p>
                </div>
                <div className='col-span-1 flex flex-col gap-2 items-center'>
                    <p className='font-bold'>{formatNumber(userData?.follower)}</p>
                    <p className='font-semibold sec-text'>follower</p>
                </div>
                <div className='col-span-1 flex flex-col gap-2 items-center'>
                    <p className='font-bold'>{formatNumber(userData?.following)}</p>
                    <p className='font-semibold sec-text'>following</p>
                </div>

            </div>

            <div className='flex flex-col gap-2 p-2 m-2'>

                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <p className='font-bold text-xl'>{userData?.name}</p>

                        <NavLink to={'/edit-profile'} className='ml-auto p-1 border-2 text-xs rounded-lg dark:border-dark-3 border-light-3 sec-text'>
                            Edit Profile
                        </NavLink>
                    </div>

                    <p className='font-semibold sec-text'>@{userData?.userId}</p>
                </div>

                <p>{userData?.bio}</p>

                <div className='flex flex-col text-sm'>
                    <p className='sec-text flex gap-2 items-center'>
                        <IoBalloon className='size-4' />
                        Born {formatDate(userData?.dob)}
                    </p>
                    <p className='sec-text flex gap-2 items-center'>
                        <IoCalendar className='size-4' />
                        Join {formatDate(userData?.created)}
                    </p>
                </div>

                <p>{userData?.link}</p>

            </div>

            {!postData ? '' :
                <div className='grid-container'>
                    {
                        postData?.map((item, i) =>
                            <NavLink to={`/view-post/${item?.postId}`} key={i} className='grid-item dark:bg-dark-2 bg-light-2'>
                                {item?.type == 'image' ?
                                    <img src={`${Friend_Link_Server.DataBase.User_Posts()}/${item?.media}`}
                                        className='' />
                                    :
                                    <video src={`${Friend_Link_Server.DataBase.User_Posts()}/${item?.media}`} className='' autoPlay muted />
                                }
                            </NavLink>
                        )
                    }

                </div>
            }

        </div>
    )
}
