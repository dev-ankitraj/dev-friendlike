import React, { createContext, useContext, useEffect, useState } from "react";
import Friend_Link_Server from "../configs/server";
import { AppLogContext } from "./app-log";
import axios from "axios";

// Create a context for authentication
export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

    const { appLog, handleAppLog } = useContext(AppLogContext);

    // State to store authenticated user, token, and authentication status
    const [authenticatedUser, setAuthenticatedUser] = useState('');
    const [authenticatedToken, setAuthenticatedToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to handle user login
    const AuthenticatedUserLogin = (user, token) => {
        setAuthenticatedUser(user);
        setAuthenticatedToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('FriendLinkToken', token);
    };

    // Function to handle user logout
    const AuthenticatedUserLogOut = () => {
        setAuthenticatedUser('');
        setAuthenticatedToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('FriendLinkToken');
    };

    // Function to save authenticated user status
    const SaveAuthenticatedUserStatus = (data) => {
        setIsAuthenticated(true);
        setAuthenticatedUser(data.userId);
        setAuthenticatedToken(data.token);
        localStorage.setItem('FriendLinkToken', data.token);
        addUserToLocalStorage(data.userId, data.token);
    };

    // Function to add users to local storage without duplication
    const addUserToLocalStorage = (userId, token) => {
        let users = JSON.parse(localStorage.getItem('FriendLinkUsers')) || [];

        // Check if user already exists and remove duplicates
        users = users.filter(user => user.userId !== userId);
        users.push({ userId, token });

        if (users.length > 5) {
            users.shift(); // Remove the oldest user to maintain the limit of 5
            handleAppLog('User limit reached. Only 5 users can be stored.', true);
        }

        localStorage.setItem('FriendLinkUsers', JSON.stringify(users));
    };


    // Effect to check for existing token and authenticate user on component mount
    useEffect(() => {
        const token = localStorage.getItem('FriendLinkToken');

        if (!token) {
            console.warn('No token found!. User is not authenticated.');
            return;
        }

        const authenticateUser = async () => {
            try {
                const response = await axios.get(`${Friend_Link_Server.Server()}/auth/token/login`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                AuthenticatedUserLogin(response.data.userId, token);

            } catch (error) {
                if (error.response) {
                    console.error(`Authentication error: ${error.response.data.message}`);
                } else if (error.request) {
                    console.error('No response received from server. Please check your network connection.');
                } else {
                    console.error(`Error during setup: ${error.message}`);
                }
            }
        };

        authenticateUser();
    }, [authenticatedUser]);

    // Context value to be provided to child components
    const contextValue = {
        authenticatedUser,
        authenticatedToken,
        isAuthenticated,
        AuthenticatedUserLogin,
        AuthenticatedUserLogOut,
        SaveAuthenticatedUserStatus
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
