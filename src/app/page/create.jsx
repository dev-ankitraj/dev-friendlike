import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Friend_Link_Server from '../../configs/server';
import axios from 'axios';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';

export default function CreatePage() {
    // Destructure authenticatedUser and authenticatedToken from AuthContext
    const { authenticatedUser, authenticatedToken } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store temporary post data and its type (image/video)
    const [tempPost, setTempPost] = useState('');
    const [tempType, setTempType] = useState('');

    // State to store the selected file
    const [file, setFile] = useState(undefined);

    // State to store post information (caption and location)
    const [postInfo, setPostInfo] = useState({
        caption: '', location: ''
    });

    // Handle form submission to create a post
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (file) {
            // Check if the file is an image or video
            if (file.type.includes("image") || file.type.includes("video")) {

                const formData = new FormData();
                formData.append('media', file);
                formData.append('type', file?.type?.split('/')[0]);
                formData.append('caption', postInfo.caption);
                formData.append('location', postInfo.location);

                try {
                    const response = await axios.post(`${Friend_Link_Server.Server()}/post/create`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${authenticatedToken}`
                        }
                    });

                    if (response.status == 200) {
                        handleAppLog('Post Created Successfully', false);
                    }
                } catch (error) {
                    handleAppLog('Error creating post', true);
                }

            } else {
                handleAppLog("Invalid File", true);
            }
        } else {
            handleAppLog('Please Select File To Post', true);
        }
    }

    // Effect to handle temporary post upload whenever the file changes
    useEffect(() => {
        const uploadTempPost = async () => {

            if (file) {
                // Check if the file is an image or video
                if (file.type.includes("image") || file.type.includes("video")) {

                    file?.type?.split('/')[0] === "image" ? setTempType("image") : setTempType("video");

                    const formData = new FormData();
                    formData.append('temp', file);
                    try {
                        const res = await axios.put(`${Friend_Link_Server.Server()}/temp/file/upload`, formData);

                        if (res.status === 200) {
                            setTempPost(res.data);
                        } else {
                            console.log(res.statusText);
                        }
                    } catch (err) {
                        console.log("Error in temp upload:", err);
                    }
                } else {
                    handleAppLog("Invalid File", true);
                }
            }
        }
        uploadTempPost();

    }, [file]);

    return (
        <div className='flex flex-col size-full items-center gap-2 p-2'>

            <div className='w-full h-96 rounded-lg dark:bg-dark-2 bg-light-2 relative items-center'>

                {tempType == 'image' ?
                    <img src={`${Friend_Link_Server.DataBase.Temp()}/${tempPost}`} alt="" className='w-full h-96 rounded-lg' />
                    :
                    <video src={`${Friend_Link_Server.DataBase.Temp()}/${tempPost}`} className='size-full' autoPlay muted />
                }

                <p className='dark:bg-dark-3 bg-light-3 p-2 w-fit rounded-lg absolute m-auto top-[45%] left-0 right-0 '>Select from device to post.</p>

                <input type="file" className='z-10 rounded-lg absolute m-auto top-0 left-0 size-full opacity-0 '
                    onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <form onSubmit={handleFormSubmit} className='size-full flex flex-col gap-2 p-2'>

                <div className='flex flex-col w-full gap-2 text-start '>
                    <label htmlFor="caption" className=''>Caption: </label>

                    <input type='text' placeholder='I love to post...' id='caption'
                        value={postInfo.caption}
                        className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                        onChange={(e) => setPostInfo({ ...postInfo, caption: e.target.value })}
                    />
                </div>

                <div className='flex flex-col w-full gap-2 text-start '>
                    <label htmlFor="location" className=''>Location: </label>

                    <input type='text' placeholder='@ Patna, Bihar' id='location'
                        value={postInfo.location}
                        className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                        onChange={(e) => setPostInfo({ ...postInfo, location: e.target.value })}
                    />
                </div>

                <button type='submit'
                    className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                >Upload</button>

            </form>

        </div>
    )
}