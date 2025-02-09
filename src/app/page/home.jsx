import React, { useState, useEffect, useContext } from 'react';
import { useUiQueryHook, useUiActiveFriends } from '../../ui/ui';
import { Loader, Post } from '../components';
import { AuthContext } from '../../contexts/auth';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';

export default function HomePage() {
    const { authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store feed data
    const [feedData, setFeedData] = useState([]);

    // Custom hook to handle query data, errors, and loading state
    const { dataQuery, errorQuery, isLoadingQuery, refetchFeed } = useUiQueryHook('feed', authenticatedToken);

    useEffect(() => {
        const fetchData = () => {
            if (errorQuery) {
                handleAppLog(errorQuery, true);
                return;
            }
            setFeedData(dataQuery);
        };

        fetchData();
    }, [dataQuery, errorQuery]);

    return (
        <div className="flex flex-col size-full py-2 justify-center items-center gap-4">
            {appLog?.message && <ToastBar log={appLog} />}

            {!feedData.length && !isLoadingQuery && (
                <>
                    <h2 className="text-3xl font-bold">Feeling Lonely?</h2>
                    <p className="text-lg">You're not alone anymore. <span className='font-bold'>Friend<span className='text-orange-1'>Link</span></span> is here for you.</p>
                    <p className="text-lg sec-text">Connect with others and build lasting friendships.</p>
                </>
            )}

            {isLoadingQuery ? (
                <Loader size={'12'} />
            ) : (
                feedData.map((post, i) => <Post key={i} post={post} />)
            )}
        </div>
    );
}
