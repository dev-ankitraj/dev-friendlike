import React, { useState, useEffect, useContext } from 'react';
import { useUiQueryHook } from '../../ui/ui';
import { Loader, Post } from '../components';
import { AuthContext } from '../../contexts/auth';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';

export default function ReelsPage() {
    const { authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store reels data
    const [reelsData, setReelsData] = useState([]);

    // Custom hook to handle query data, errors, and loading state
    const { dataQuery, errorQuery, isLoadingQuery, refetchQuery } = useUiQueryHook('reels', authenticatedToken);

    // Fetching Query Data
    useEffect(() => {
        const fetchData = () => {
            // Log error if any
            if (errorQuery) {
                handleAppLog(errorQuery, true);
                return;
            }
            // Set reels data state
            setReelsData(dataQuery);
        };
        fetchData();
    }, [dataQuery, errorQuery]);

    // Render a loader while the data is loading
    if (isLoadingQuery) return (<Loader size={'12'} />);

    return (
        <div className='grid grid-col-12 size-full p-2 gap-4 overflow-y-auto no-scrollbar pb-12'>
            {appLog?.message && <ToastBar log={appLog} />}
            <div className='col-span-12 flex flex-col py-2 justify-center items-center gap-4'>
                {reelsData.map((post, i) => (
                    <Post key={i} post={post} />
                ))}
            </div>
        </div>
    );
}
