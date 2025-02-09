import React, { useState, useEffect, useContext } from 'react';
import Friend_Link_Server from '../../configs/server';
import { useUiQueryHook } from '../../ui/ui';
import { Loader, Post, VideoPlayer } from '../components';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { AppLogContext } from '../../contexts/app-log';
import axios from 'axios';
import ToastBar from '../components/toast';
import {
    IoChevronForwardOutline, IoSearchCircle, IoChevronBackOutline, IoSend
} from 'react-icons/io5';

export default function ExplorePage() {
    const { authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    const [usersData, setUsersData] = useState(undefined);
    // State to store search input
    const [search, setSearch] = useState('');
    // State to store search results
    const [results, setResults] = useState([]);

    // State to hold the data for exploration
    const [exploreData, setExploreData] = useState([]);

    // Custom hook to handle query data, errors, and loading state
    const { dataQuery, errorQuery, isLoadingQuery, refetchQuery } = useUiQueryHook('explore', authenticatedToken);

    // Fetching Explore Data
    useEffect(() => {
        const fetchData = () => {
            if (errorQuery) return console.log('Error :', errorQuery);
            setExploreData(dataQuery);
        };
        fetchData();
    }, [dataQuery, errorQuery]);

    // Fetch users data when component mounts
    useEffect(() => {
        const getUsersData = async () => {
            const url = `${Friend_Link_Server.Server()}/user`;

            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                setUsersData(res.data);
            } catch (error) {
                handleAppLog('Could not get your users data', true);
            }
        };
        getUsersData();
    }, []);

    // Filter user based on search input
    useEffect(() => {
        if (search.length > 3) {
            const filteredResults = usersData?.filter((user) => user.userId.includes(search)) || [];
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    }, [search, usersData]);

    // Render a loader while the data is loading
    if (isLoadingQuery) return <Loader size={'12'} />;

    return (
        <>
            {appLog?.message && <ToastBar log={appLog} />}

            <div className={`flex col-span-12 gap-2 px-2 flex-col items-center justify-center overflow-y-auto no-scrollbar`}>

                <div className='flex gap-2 h-12 p-1 w-full max-w-96 items-center dark:bg-dark-2 bg-light-2 rounded-lg'>
                    <IoSearchCircle className='size-10 sec-text' />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {!results.length ? '' :
                    results.map((result, i) =>
                        <NavLink to={`/view-profile/${result.userId}`} key={i} className='flex h-12 gap-2 p-1 w-full max-w-96 items-center rounded-lg dark:bg-dark-2 bg-light-2 cursor-pointer'>
                            <img src={`${Friend_Link_Server.DataBase.User_Avatar()}/${result?.profile_pic}`} alt="" className='size-10 rounded-full' />
                            <div className='flex flex-col items-center'>
                                <p>{result?.name}</p>
                                <p className='text-xs sec-text'>@ {result?.userId}</p>
                            </div>

                            <IoChevronForwardOutline className='ml-auto size-6 sec-text' />
                        </NavLink>
                    )
                }

            </div>

            <div className='grid-container'>
                {exploreData.map((item, i) => (
                    <NavLink to={`/view-post/${item.postId}`} key={i} className='grid-item dark:bg-dark-2 bg-light-2'>
                        {item.type === 'image' ? (
                            <img
                                src={`${Friend_Link_Server.DataBase.User_Posts()}/${item.media}`}
                                className=''
                            />
                        ) : (
                            <video
                                src={`${Friend_Link_Server.DataBase.User_Posts()}/${item.media}`}
                                className=''
                                autoPlay
                                muted
                            />
                        )}
                    </NavLink>
                ))}
            </div>
        </>
    );
}
