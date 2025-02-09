import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post';
import { AuthContext } from '../../contexts/auth';
import Friend_Link_Server from '../../configs/server';
import axios from 'axios';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';


export default function ViewPostPage() {
    // Extract the postId parameter from the URL
    const { postId } = useParams();
    const { authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store post data
    const [postData, setPostData] = useState(undefined);

    // Effect to fetch post data when the component mounts or postId changes
    useEffect(() => {
        const getPostData = async () => {
            const url = `${Friend_Link_Server.Server()}/post/${postId}`;

            try {
                // Fetch post data from the server
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });

                // Set the fetched post data to state
                setPostData(res.data);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
        getPostData();
    }, [postId, authenticatedToken]);

    return (
        <div className='flex flex-col w-screen h-screen items-center py-4'>
            {appLog?.message && <ToastBar log={appLog} />}

            {/* Render the Post component with the fetched post data */}
            <Post post={postData} />
        </div>
    );
}
