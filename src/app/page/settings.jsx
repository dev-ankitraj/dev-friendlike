import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import ToggleBtn from '../components/toggle-btn';
import axios from 'axios';
import { AppLogContext } from '../../contexts/app-log';
import ToastBar from '../components/toast';

import {
    IoArrowBack, IoHelpCircle, IoExitOutline, IoGlobeOutline, IoInformationCircle, IoPersonCircle, IoChevronForwardOutline,
    IoRepeat, IoAddCircle, IoLockClosed, IoChevronDownOutline, IoEyeSharp, IoEyeOffSharp, IoAtOutline
} from 'react-icons/io5'
import Friend_Link_Server from '../../configs/server';

export default function SettingsPage() {

    // Destructure authenticatedUser, AuthenticatedUserLogin, and AuthenticatedUserLogOut from AuthContext
    const { authenticatedUser, AuthenticatedUserLogin, AuthenticatedUserLogOut } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store user data
    const [userData, setUserData] = useState(undefined);

    // State to handle settings and account center visibility
    const [setting, setSetting] = useState('');
    const [accountCenter, setAccountCenter] = useState(null);

    // State to handle password visibility
    const [showPass, setShowPass] = useState({
        new: false, conf: false, old: ''
    });

    // State to store password data
    const [password, setPassword] = useState({
        new: '', conf: '', old: ''
    });

    // State to store email data
    const [email, setEmail] = useState({
        old: 'friendLink@gmail.com', new: ''
    });

    // Handle password change
    const handlePassword = async (e) => {
        e.preventDefault();
        // Add logic to handle password change here

        try {
            const res = await axios.post(`${Friend_Link_Server.Server()}/verify/password`,
                { userId: authenticatedUser, password: password.old }
            )

            if (res.status == 200) {
                try {
                    const res = await axios.post(`${Friend_Link_Server.Server()}/auth/change/password`,
                        { email: userData?.email, password: password.new }
                    );

                    if (res.status == 200) {
                        //Send Alert Email 
                        const resEmail = await axios.post(`${Friend_Link_Server.Server()}/email/alert-change`,
                            {
                                email: userData?.email, userName: userData?.name,
                                changeType: 'Password', changeDate: formatDate(new Date())
                            });
                    }
                } catch (err) {
                    handleAppLog('Server Error! Please try again later.', true);
                }
            }
        } catch (error) {
            handleAppLog('Invalid Current Password!', true);
        }
    };

    // Handle recovery email change
    const handleRecoveryEmail = async (e) => {
        e.preventDefault();
        // Add logic to handle recovery email change here

        try {
            const res = await axios.post(`${Friend_Link_Server.Server()}/verify/password`,
                { userId: authenticatedUser, password: password.old }
            )

            if (res.status == 200) {
                try {
                    const res = await axios.post(`${Friend_Link_Server.Server()}/auth/change/email`,
                        { emailOld: userData?.email, emailNew: email.new }
                    );

                    if (res.status == 200) {
                        //Send Alert Email 
                        const resEmail = await axios.post(`${Friend_Link_Server.Server()}/email/alert-change`,
                            {
                                email: userData?.email, userName: userData?.name,
                                changeType: 'Email', changeDate: formatDate(new Date())
                            });
                    }
                } catch (err) {
                    handleAppLog('Server Error! Please try again later.', true);
                }
            }
        } catch (error) {
            handleAppLog('Invalid Current Password!', true);
        }
    };

    // Handle adding a new account
    const handelAddAccount = () => {
        AuthenticatedUserLogOut();
        // Add logic to handle adding a new account here
    };

    // Handle switching accounts
    const handleSwitchAccount = (user, token) => {
        AuthenticatedUserLogin(user, token);
        // Add logic to handle switching accounts here
    };

    // Handle logging out
    const handleLogOut = () => {
        AuthenticatedUserLogOut();
        localStorage.removeItem('FriendLinkUsers');
        localStorage.removeItem('FriendLinkToken');
        // Add additional logout logic if needed
    };

    // Effect to fetch user data when component mounts
    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await axios.get(`${Friend_Link_Server.Server()}/user/profile/${authenticatedUser}`);

                setUserData(res.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUserData();
    }, [authenticatedUser]);

    return (
        <div className='grid grid-cols-12 size-full p-2'>

            {appLog?.message && <ToastBar log={appLog} />}

            <div className={`${setting == '' ? 'flex' : 'hidden md:flex'} col-span-12 md:col-span-4 gap-4 flex-col overflow-y-auto no-scrollbar cursor-pointer`}>

                <div className='flex flex-col gap-4 p-2 dark:bg-dark-2 bg-light-2 rounded-lg'>
                    <p >Your Account</p>

                    <div className='flex h-14 p-2 gap-4 items-center cursor-pointer rounded-lg dark:bg-dark-3 bg-light-3'
                        onClick={() => setSetting('Account Center')}
                    >
                        <IoPersonCircle className='size-8' />
                        <div className='flex flex-col'>
                            <p>Accounts Center</p>
                            <p className='text-xs sec-text'>Password, security, personal details</p>
                        </div>

                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>
                </div>

                <div className='flex h-8 gap-4 items-center cursor-pointer'
                    onClick={() => setSetting('Data usage')}
                >
                    <IoGlobeOutline className='size-6' />
                    <p>Data usage</p>
                    <IoChevronForwardOutline className='ml-auto size-4' />
                </div>

                <div className='flex flex-col gap-4 '>
                    <p className='text-sm text-blue-4 dark:text-blue-2'>More info and support</p>

                    <div className='flex h-8 gap-4 items-center'
                        onClick={() => setSetting('Help')}
                    >
                        <IoHelpCircle className='size-6' />
                        <p>Help</p>
                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>

                    <div className='flex h-8 gap-4 items-center'
                        onClick={() => setSetting('About')}
                    >
                        <IoInformationCircle className='size-6' />
                        <p>About</p>
                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>
                </div>

                <div className='flex flex-col gap-4 cursor-pointer'>
                    <p className='text-sm text-blue-4 dark:text-blue-2'>Login</p>

                    <div className='flex h-8 gap-4 items-center'
                        onClick={handelAddAccount}
                    >
                        <IoAddCircle className='size-6' />
                        <p>Add account</p>
                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>

                    <div className='flex h-8 gap-4 items-center text-blue-500'
                        onClick={() => setSetting('Switch account')}
                    >
                        <IoRepeat className='size-6' />
                        <p>Switch account</p>
                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>

                    <div className='flex h-8 gap-4 items-center text-red-500'
                        onClick={handleLogOut}
                    >
                        <IoExitOutline className='size-6' />
                        <p>Log out all account</p>
                        <IoChevronForwardOutline className='ml-auto size-4' />
                    </div>
                </div>

            </div>

            <div className={`${setting !== '' ? 'flex' : 'hidden md:flex'} col-span-12 md:col-span-8 flex-col overflow-y-auto no-scrollbar`}>

                <div className='flex h-10 w-full gap-4 items-center px-2 '>
                    <IoArrowBack className='md:hidden block size-6' onClick={() => setSetting('')} />
                    <p className='text-lg font-semibold md:ml-4'>{setting}</p>
                </div>

                {setting == 'Account Center' ?
                    <>
                        <div className='flex flex-col text-center sec-text'>
                            <p>Manage your connection experiences and account settings across FriendLink.</p>
                        </div>

                        <NavLink to={'/edit-profile'} className='flex flex-col gap-4 m-4 p-4 rounded-lg dark:bg-dark-2 bg-light-2'>
                            <div className='flex h-8 gap-4 items-center'>
                                <img src={`${Friend_Link_Server.DataBase.User_Avatar()}/${userData?.profile_pic}`} className='size-10 rounded-full' />

                                <div className='flex flex-col'>
                                    <p>{userData?.name}</p>
                                    <p className='text-sm sec-text'>@{userData?.userId}</p>
                                </div>

                                <IoChevronForwardOutline className='ml-auto size-4' />
                            </div>
                        </NavLink>

                        <p className='text-lg m-4 sec-text'>Password and security</p>

                        <div className='flex flex-col mx-4 gap-4 cursor-pointer'>

                            <div className='flex h-8 gap-4 items-center '
                                onClick={() => setAccountCenter('Password')}
                            >
                                <IoLockClosed className='size-5' />
                                <p>Change Password</p>
                                <IoChevronDownOutline className='ml-auto size-4' />
                            </div>

                            {accountCenter == 'Password' ?
                                <form onSubmit={handlePassword} className='flex flex-col gap-2'>

                                    <label htmlFor="old-pass" className='sec-text'>Current Password:</label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-2 bg-light-2 px-2 rounded-lg'>

                                        <input
                                            type={showPass.old ? 'text' : 'password'}
                                            value={password.old}
                                            placeholder='******' id='old-pass'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setPassword({ ...password, old: e.target.value })}
                                        />

                                        {showPass.old ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, old: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, old: true })} />}
                                    </div>

                                    <label htmlFor="new-pass" className='sec-text'>New Password:</label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-2 bg-light-2 px-2 rounded-lg'>

                                        <input
                                            type={showPass.new ? 'text' : 'password'}
                                            value={password.new}
                                            placeholder='******' id='new-pass'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                        />

                                        {showPass.new ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, new: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, new: true })} />}
                                    </div>

                                    <label htmlFor="cf-new-pass" className='sec-text'>Confirm Password:</label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-2 bg-light-2 px-2 rounded-lg'>

                                        <input
                                            type={showPass.conf ? 'text' : 'password'}
                                            value={password.conf}
                                            placeholder='******' id='cf-new-pass'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setPassword({ ...password, conf: e.target.value })}
                                        />

                                        {showPass.conf ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, conf: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, conf: true })} />}
                                    </div>

                                    <p className='text-orange-2 ml-auto'>Forgot password</p>

                                    <button type='submit'
                                        className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                                    >Change</button>

                                </form> : ''
                            }

                            <div className='flex h-8 gap-4 items-center '
                                onClick={() => setAccountCenter('Email')}
                            >
                                <IoAtOutline className='size-5' />
                                <p>Recovery Email</p>
                                <IoChevronDownOutline className='ml-auto size-4' />
                            </div>

                            {accountCenter == 'Email' ?
                                <form onSubmit={handleRecoveryEmail} className='flex flex-col gap-2'>

                                    <p className='sec-text'>Current email : <span className='text-orange-1'>{userData?.email}</span></p>

                                    <label htmlFor="old-pass" className='sec-text'>Current Password:</label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-2 bg-light-2 px-2 rounded-lg'>

                                        <input
                                            type={showPass.old ? 'text' : 'password'}
                                            value={password.old}
                                            placeholder='******' id='old-pass'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setPassword({ ...password, old: e.target.value })}
                                        />

                                        {showPass.old ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, old: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, old: true })} />}
                                    </div>

                                    <label htmlFor="rc-email" className='sec-text'>New Recovery Email:</label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-2 bg-light-2 px-2 rounded-lg'>

                                        <input
                                            type='email'
                                            value={email.new}
                                            placeholder='email@xyz.com' id='rc-email'
                                            className='px-0' required
                                            onChange={(e) => setEmail({ ...email, new: e.target.value })}
                                        />

                                    </div>

                                    <p className='text-orange-2 ml-auto'>Forgot password</p>

                                    <button type='submit'
                                        className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                                    >Change</button>

                                </form> : ''
                            }

                        </div>
                    </> : ''
                }

                {setting == 'Data usage' ?
                    <div className='flex flex-col size-full gap-2'>
                        <div className='flex flex-col gap-4 p-2 font-semibold'>
                            <div className='flex justify-between'>
                                <p className='text-lg'>Data Saver</p>
                                <ToggleBtn />
                            </div>
                            <p className='text-xs sec-text'>When Data Saver is turned on, videos won't load in advance to help you use less data.</p>
                            <div className='flex justify-between'>
                                <p className='text-lg'>Upload ata highest quality</p>
                                <ToggleBtn />
                            </div>
                            <p className='text-xs sec-text'>Always upload the highest quality photos and videos. When this is off, we'll automatically adjust upload quality to fit network conditions.</p>
                        </div>
                    </div> : ''
                }

                {setting == 'Switch account' ?
                    <div className='flex flex-col size-full gap-2'>
                        {JSON.parse(localStorage.getItem('FriendLinkUsers'))?.map((user, index) =>
                            <div key={index} className='flex h-12 items-center gap-4 mx-4 p-4 rounded-lg dark:bg-dark-2 bg-light-2'>
                                <IoPersonCircle className='size-6' />
                                <p className=''>{user.userId}</p>
                                <IoChevronForwardOutline className='ml-auto size-4' onClick={() => handleSwitchAccount(user.userId, user.token)} />
                            </div>
                        )}
                    </div> : ''
                }

            </div>
        </div>
    )
}

