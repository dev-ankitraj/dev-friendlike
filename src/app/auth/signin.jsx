import React, { useContext, useState } from 'react';
import { AuthContext } from "../../contexts/auth";
import { AppLogContext } from "../../contexts/app-log";
import { NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import Friend_Link_Server from '../../configs/server';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import ToastBar from '../components/toast';

export default function SignInPage() {
    // Get authentication status and function to update it from AuthContext
    const { isAuthenticated, SaveAuthenticatedUserStatus } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State variables
    const [showPass, setShowPass] = useState(false);
    const [loginType, setLoginType] = useState('userId');
    const [credentials, setCredentials] = useState({ userId: '', email: '', password: '' });

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if ((credentials.userId || credentials.email) && credentials.password) {
            try {
                // Make a POST request to the server to authenticate the user
                const response = await axios.post(`${Friend_Link_Server.Server()}/auth/login`, credentials);
                // Save the authenticated user status
                SaveAuthenticatedUserStatus(response.data);
            } catch (error) {
                handleAppLog("Login failed! Check credentials.", true);
            }
        }
    };

    return (
        // Redirect to home page if the user is already authenticated
        isAuthenticated ? <Navigate to={"/"} /> :

            <div className='flex flex-col w-screen h-screen justify-center items-center gap-10 relative'>

                {appLog?.message && <ToastBar log={appLog} />}

                <div className='flex flex-col w-full md:w-fit h-fit justify-center p-5 rounded-2xl items-center dark:bg-dark-2 bg-light-2'>
                    <p className='text-xl font-bold mb-4'>
                        Friend
                        <span className='text-orange-1'>Link</span>
                    </p>
                    <p className='text-3xl font-semibold'>Login</p>

                    <div className='flex justify-around mb-5 w-full'>
                        <button onClick={() => setLoginType("userId")}
                            className={loginType === 'userId' ?
                                'py-2 px-4 text-inherit font-bold border-0 border-b-2 rounded-none text-orange-1 border-orange-1' :
                                'py-2 px-4 text-inherit font-bold border-0'
                            }
                        >UserId</button>

                        <button onClick={() => setLoginType("email")}
                            className={loginType === 'email' ?
                                'py-2 px-4 text-inherit font-bold border-0 border-b-2 rounded-none text-orange-1 border-orange-1' :
                                'py-2 px-4 text-inherit font-bold border-0'
                            }
                        >Email</button>
                    </div>

                    <form className='flex flex-col text-center w-full md:w-96 gap-2 p-2' onSubmit={handleFormSubmit}>
                        {loginType === "userId" &&
                            <div className='flex flex-col w-full gap-2 text-start '>
                                <label htmlFor="userId" className=''>UserId: </label>
                                <input type='text' placeholder='user-id' id='userId'
                                    value={credentials.userId}
                                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg' required minLength='3'
                                    onChange={(e) => setCredentials({ ...credentials, userId: e.target.value })}
                                />
                            </div>
                        }

                        {loginType === "email" &&
                            <div className='flex flex-col w-full gap-2 text-start '>
                                <label htmlFor="email" className=''>Email: </label>
                                <input type='email' placeholder='email@xyz.com' id='email'
                                    value={credentials.email}
                                    className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg' required
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                            </div>
                        }

                        <div className='flex flex-col w-full gap-2 text-start '>
                            <label htmlFor="password">Password: </label>
                            <div className='flex gap-2 h-10 items-center dark:bg-dark-3 bg-light-3 px-2 rounded-lg'>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={credentials.password}
                                    placeholder='******' id='password'
                                    className='px-0' required minLength='6'
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                                {showPass ?
                                    <IoEyeSharp onClick={() => setShowPass(false)} /> :
                                    <IoEyeOffSharp onClick={() => setShowPass(true)} />}
                            </div>
                        </div>

                        <NavLink to={'/forgot'} className='text-orange-2 ml-auto'>Forgot Password</NavLink>

                        <button type='submit'
                            className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                        >Login</button>

                        <div className='flex flex-col gap-2 text-start text-sm'>
                            <p>Don't have an account?
                                <NavLink to={"/sign-up"} className='text-orange-1 text-base hover:text-orange-2'> Create One!</NavLink>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
    )
}
