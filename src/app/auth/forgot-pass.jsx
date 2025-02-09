import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from "../../contexts/auth"
import { NavLink, Navigate } from 'react-router-dom'
import { AppLogContext } from "../../contexts/app-log";
import ToastBar from '../components/toast';

import { IoEyeSharp, IoEyeOffSharp, IoCloseCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import axios from 'axios';
import Friend_Link_Server from '../../configs/server';
import { formatDate, isValidEmail } from '../../functions';

export default function ForgotPasswordPage() {

    // Contexts to handle authentication status and application logging
    const { isAuthenticated, SaveAuthenticatedUserStatus, authenticatedUser } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to control the form step and verification code
    const [formStep, setFormStep] = useState(0);
    const [code, setCode] = useState('');

    // State for showing/hiding password fields
    const [showPass, setShowPass] = useState({ cf_pass: false, pass: false });

    // State for user credentials and message handling
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ error: false, text: '' });

    // Function to handle email and password input submission
    const handleEmail = async () => {
        if (isValidEmail(credentials.email)) {
            setFormStep(1);
            try {
                const res = await axios.post(`${Friend_Link_Server.Server()}/email/verification`, { email: credentials.email });
                setCode(res.data.code);
            } catch (err) {
                handleAppLog("Unable to send the verification code. Please try again later.", true);
            }
        } else {
            handleAppLog('Kindly ensure all fields are completed.', true);
        }
    };

    // Effect to check if passwords match
    useEffect(() => {
        if (confirmPassword.length > 4) {
            if (credentials.password !== confirmPassword) {
                setMessage({ ...message, error: true, text: 'Passwords do not match' });
            } else {
                setMessage({ ...message, error: false, text: '' });
            }
        }
    }, [credentials.password, confirmPassword]);

    // Function to handle form submission for user creation
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${Friend_Link_Server.Server()}/auth/change/password`, credentials);

            if (res.status == 200) {
                //Send Alert Email 
                const resEmail = await axios.post(`${Friend_Link_Server.Server()}/email/alert-change`,
                    {
                        email: credentials.email, userName: credentials.userName,
                        changeType: 'Password', changeDate: formatDate(new Date())
                    });
            }
        } catch (err) {
            handleAppLog('Server Error! Please try again later.', true);
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

                    <p className='text-3xl font-semibold'>Forgot Password</p>

                    <form className='flex flex-col text-center md:w-96 w-full gap-2 p-2' onSubmit={handleFormSubmit}>

                        {formStep !== 0 ? "" :
                            <>
                                <div className='flex flex-col w-full gap-2 text-start '>
                                    <label htmlFor="email" className=''>Email: </label>

                                    <input type='email' placeholder='email@xyz.com' id='email'
                                        value={credentials.email}
                                        className='h-10 dark:bg-dark-3 bg-light-3 rounded-lg' required
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    />
                                </div>

                                <button onClick={handleEmail} type='button'
                                    className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                                >Continue</button>

                                <div className='flex flex-col gap-2 text-start text-sm'>
                                    <p>Already have account?
                                        <NavLink to={"/sign-in"} className='text-orange-2 text-base'> Login.</NavLink>
                                    </p>
                                </div>
                            </>
                        }

                        {formStep !== 1 ? "" :
                            <SignUpStep1 setFormStep={setFormStep} credentials={credentials} code={code} setCode={setCode} handleAppLog={handleAppLog} />
                        }
                        {formStep !== 2 ? "" :
                            <div className='flex flex-col w-full gap-2'>

                                <div className='flex flex-col w-full gap-2 text-start '>
                                    <label htmlFor="password">Password: </label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-3 bg-light-3 px-2 rounded-lg'>

                                        <input type={showPass.pass ? 'text' : 'password'}
                                            value={credentials.password}
                                            placeholder='******' id='password'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        />

                                        {showPass.pass ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, pass: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, pass: true })} />}
                                    </div>

                                </div>

                                <div className='flex flex-col w-full gap-2 text-start '>
                                    <label htmlFor="conf_pass">Confirm Password: </label>
                                    <div className='flex gap-2 h-10 items-center dark:bg-dark-3 bg-light-3 px-2 rounded-lg'>

                                        <input type={showPass.cf_pass ? 'text' : 'password'}
                                            value={confirmPassword}
                                            placeholder='******' id='conf_pass'
                                            className='px-0' required minLength='6'
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />

                                        {showPass.cf_pass ?
                                            <IoEyeSharp onClick={() => setShowPass({ ...showPass, cf_pass: false })} /> :
                                            <IoEyeOffSharp onClick={() => setShowPass({ ...showPass, cf_pass: true })} />}
                                    </div>


                                    {message.error ?
                                        <p className='text-xs text-red-400'>{message.text}</p>
                                        : ''}
                                </div>

                                <button type='submit'
                                    className='my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
                                >Change Password</button>
                            </div>
                        }

                    </form>
                </div>
            </div>
    )
}

const SignUpStep1 = ({ setFormStep, credentials, code, setCode, handleAppLog }) => {

    // State to store the OTP as an array of 6 empty strings
    const [otp, setOtp] = useState(Array(6).fill(""));

    // Array of refs for each input field
    const inputRefs = useRef([]);

    // Handle key down events for input fields
    const handleKeyDown = (e) => {
        const index = inputRefs.current.indexOf(e.target);
        // Allow only numeric input, backspace, delete, tab, and meta keys
        if (!/^[0-9]{1}$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab" && !e.metaKey) {
            e.preventDefault();
        }
        // Handle delete and backspace keys
        if (e.key === "Delete" || e.key === "Backspace") {
            e.preventDefault();
            setOtp((prevOtp) => {
                const newOtp = [...prevOtp];
                newOtp[index] = "";
                return newOtp;
            });
            // Focus the previous input field if possible
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // Handle input events for input fields
    const handleInput = (e) => {
        const { target } = e;
        const index = inputRefs.current.indexOf(target);
        if (target.value) {
            setOtp((prevOtp) => [
                ...prevOtp.slice(0, index),
                target.value,
                ...prevOtp.slice(index + 1),
            ]);
            // Focus the next input field if possible
            if (index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle focus events for input fields to select the text
    const handleFocus = (e) => {
        e.target.select();
    };

    // Handle paste events to paste the OTP from clipboard
    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
            return;
        }
        const digits = text.split("");
        setOtp(digits);
    };

    // Handle email verification
    const handleEmailVerification = () => {
        if (code == otp.join('')) {
            setFormStep(2);
        } else {
            handleAppLog('Verification code do not match', true);
        }
    };

    //Handle Resend Verification code
    const handleResendOtp = async () => {
        try {
            const res = await axios.post(`${Friend_Link_Server.Server()}/email/verification`, { email: credentials.email });
            setCode(res.data.code);
        } catch (err) {
            handleAppLog("Unable to send the verification code. Please try again later.", true);
        }
    }

    return (
        <div className='flex flex-col w-full gap-2'>
            <h3 className='my-4'>
                Enter the verification code send to your email <span className='text-orange-1'>{credentials.email}</span>
            </h3>

            <div className="flex w-full justify-between">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="size-12 p-2 text-center text-2xl dark:bg-dark-3 bg-light-3 rounded-lg"
                    />
                ))}
                {/* You can conditionally render a submit button here based on otp length */}
            </div>

            <div className='flex w-full items-center'>
                <p className='ml-auto text-orange-2 rounded-lg' onClick={handleResendOtp}>
                    Resend otp
                </p>
            </div>

            <button onClick={handleEmailVerification} type='button'
                className='w-full my-6 py-2 px-4 bg-orange-1 text-inherit font-bold border-0 rounded-lg hover:bg-orange-2'
            >Verify</button>

            <button type='button' className='sec-text' onClick={() => setFormStep(0)}>Back</button>
        </div>
    )
}

