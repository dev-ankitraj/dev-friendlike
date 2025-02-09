import React, { useState, useEffect, useContext } from 'react';
import Friend_Link_Server from '../../configs/server';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, Post, VideoPlayer } from '../components';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { formatDate, formatNumber } from '../../functions';
import axios from 'axios';

import {
    IoCalendar, IoBalloon
} from 'react-icons/io5';

export default function ViewProfilePage() {
    // Extract the userId parameter from the URL
    const { userId } = useParams();

    const { authenticatedToken, authenticatedUser } = useContext(AuthContext);

    // State to store user data
    const [userData, setUserData] = useState(undefined);
    // State to store post data
    const [postData, setPostData] = useState(undefined);

    // Effect to fetch user data and post data when the component mounts
    useEffect(() => {
        const getUserData = async () => {
            try {
                // Fetch user profile data from the server
                const res = await axios.get(`${Friend_Link_Server.Server()}/user/profile/${userId}`);
                setUserData(res.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const getPostData = async () => {
            try {
                // Fetch user posts data from the server
                const res = await axios.get(`${Friend_Link_Server.Server()}/user/posts/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                setPostData(res.data);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        getUserData();
        getPostData();
    }, [authenticatedUser, authenticatedToken]);

    return (
        <div className='flex flex-col w-screen h-screen p-2 overflow-y-auto no-scrollbar'>
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
                    <p className='font-bold text-xl'>{userData?.name}</p>
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

            {authenticatedUser === userId ?
                <div className='flex gap-2 m-4'>
                    <NavLink to={'/'} className='flex w-full justify-center p-2 rounded-lg dark:bg-dark-2 dark:hover:bg-dark-3 bg-dark-2 hover:bg-dark-3'>
                        Back
                    </NavLink>
                    <button type='submit' className='flex w-full justify-center p-2 rounded-lg bg-orange-1 hover:bg-orange-2'>
                        Follow
                    </button>
                </div>
                : ''
            }

            {!postData ? '' :
                <div className='grid-container'>
                    {
                        postData?.map((item, i) =>
                            <NavLink to={`/view-post/${item?.postId}`} key={i} className='grid-item dark:bg-dark-2 bg-light-2'>
                                {item?.type === 'image' ?
                                    <img src={`${Friend_Link_Server.DataBase.User_Posts()}/${item?.media}`} className='' />
                                    :
                                    <video src={`${Friend_Link_Server.DataBase.User_Posts()}/${item?.media}`} className='' autoPlay muted />
                                }
                            </NavLink>
                        )
                    }
                </div>
            }
        </div>
    );
}
