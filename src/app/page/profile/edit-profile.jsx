import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../contexts/auth';
import axios from 'axios';
import Friend_Link_Server from '../../../configs/server';
import { formatDate } from '../../../functions';
import { AppLogContext } from '../../../contexts/app-log';
import ToastBar from '../../components/toast';

export default function EditProfilePage() {

    const { authenticatedUser, authenticatedToken, AuthenticatedUserLogin, AuthenticatedUserLogOut } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    const [userData, setUserData] = useState(undefined);
    const [isUpdate, setIsUpdate] = useState(false);
    const [temp, setTemp] = useState('');
    const [file, setFile] = useState(undefined);

    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        dob: '',
        link: '',
        avatar: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setProfileData({ ...profileData, avatar: e.target.files[0] });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsUpdate(!isUpdate);

        const formData = new FormData();
        Object.keys(profileData).forEach((key) => {
            formData.append(key, profileData[key]);
        });

        if (profileData.name || profileData.bio || profileData.dob || profileData.link || profileData.avatar) {
            try {
                const response = await axios.put(`${Friend_Link_Server.Server()}/user/profile`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authenticatedToken}`
                    }
                });
                handleAppLog('Profile updated successfully', false);
            } catch (error) {
                handleAppLog('Error updating profile', true);
            }
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            const res = await axios.get(`${Friend_Link_Server.Server()}/user/profile/${authenticatedUser}`)
            setUserData(res.data);
        }
        getUserData();

    }, [isUpdate])

    useEffect(() => {
        const uploadTemp = async () => {

            if (file) {
                if (file.type.includes("image")) {

                    const formData = new FormData();
                    formData.append('temp', file);
                    try {
                        const res = await axios.put(`${Friend_Link_Server.Server()}/temp/file/upload`, formData);

                        if (res.status == 200) {
                            setTemp(res.data);
                        } else {
                            console.log(res.statusText);
                        }
                    } catch (err) {
                        console.log("error in temp upload:", err);
                    }
                } else {
                    handleAppLog("Invalid File", true);
                }
            }
        }
        uploadTemp();
    }, [file]);

    return (
        <form onSubmit={handleFormSubmit} className='size-full flex flex-col items-center gap-2 p-2'>

            {appLog?.message && <ToastBar log={appLog} />}

            <div className='flex size-48 rounded-full dark:bg-dark-2 bg-light-2 relative'>

                <img src={
                    temp ?
                        `${Friend_Link_Server.DataBase.Temp()}/${temp}`
                        :
                        `${Friend_Link_Server.DataBase.User_Avatar()}/${userData?.profile_pic}`
                }
                    alt="" className='size-48 rounded-full' />

                <p className='text-xs dark:bg-dark-3 bg-light-3 p-2 w-fit rounded-lg absolute m-auto bottom-0 left-0 right-0 '>Upload Profile Pic</p>

                <input type="file" className='z-10 rounded-full absolute m-auto top-0 left-0 size-full opacity-0 '
                    name="avatar" onChange={handleFileChange} />
            </div>

            <div className='flex flex-col w-full gap-2 text-start '>
                <label htmlFor="username" className=''>Name: </label>

                <input placeholder={userData?.name || 'Full Name'} id='username'
                    type="text" name="name" value={profileData.name} onChange={handleChange}
                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                />
            </div>

            <div className='flex flex-col w-full gap-2 text-start '>
                <label htmlFor="bio" className=''>Bio: </label>

                <input type='text' placeholder={userData?.bio || 'CSE AI&ML student'} id='bio'
                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                    name="bio" value={profileData.bio} onChange={handleChange}
                />
            </div>

            <div className='flex flex-col w-full gap-2 text-start '>
                <label htmlFor="dob" className=''>Date of birth: <span className='sec-text'>{formatDate(userData?.dob)}</span></label>

                <input type='date' placeholder={formatDate(userData?.dob)} id='dob'
                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                    name="dob" value={profileData.dob} onChange={handleChange}
                />
            </div>

            <div className='flex flex-col w-full gap-2 text-start '>
                <label htmlFor="link" className=''>Links: </label>

                <input placeholder={userData?.link || 'www.friendLink.com'} id='link'
                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg'
                    type="url" name="link" value={profileData.link} onChange={handleChange}
                />
            </div>

            <button type='submit'
                className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
            >Update Profile</button>

        </form>
    )
}



