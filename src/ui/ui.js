import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Friend_Link_Server from '../configs/server';

// Custom hook to handle UI queries
export const useUiQueryHook = (query, token) => {
    // State to store query data, errors, and loading state
    const [dataQuery, setDataQuery] = useState([]);
    const [errorQuery, setErrorQuery] = useState('');
    const [isLoadingQuery, setIsLoadingQuery] = useState(false);

    // Function to fetch query data
    const fetchQuery = async () => {
        try {
            setIsLoadingQuery(true); // Set loading state to true

            const res = await axios.get(`${Friend_Link_Server.Server()}/ui/${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) setDataQuery(res.data); // Update dataQuery state with response data

        } catch (err) {
            if (err.response) setErrorQuery(err.response.data); // Update errorQuery state with error response
        } finally {
            setIsLoadingQuery(false); // Set loading state to false
        }
    };

    // Effect to fetch query data on component mount
    useEffect(() => {
        fetchQuery();
    }, []);

    // Function to refetch query data
    const refetchQuery = () => {
        fetchQuery();
    };

    return { dataQuery, errorQuery, isLoadingQuery, refetchQuery };
};

// Custom hook to handle active friends data
export const useUiActiveFriends = (user) => {
    // State to store active friends data, errors, and loading state
    const [friendsActive, setFriendsActive] = useState([]);
    const [errorFriendsActive, setErrorFriendsActive] = useState('');
    const [isLoadingFriendsActive, setIsLoadingFriendsActive] = useState(false);

    // Function to fetch active friends data
    const fetchFriendsActive = async () => {
        try {
            setIsLoadingFriendsActive(true); // Set loading state to true

            const res = await axios.get(`${Friend_Link_Server.Server()}/user/active/friends`, {
                headers: {
                    Authorization: `Bearer ${user}`
                }
            });
            if (res.status === 200) setFriendsActive(res.data); // Update friendsActive state with response data

        } catch (err) {
            if (err.response) setErrorFriendsActive(err.response.data); // Update errorFriendsActive state with error response
        } finally {
            setIsLoadingFriendsActive(false); // Set loading state to false
        }
    };

    // Effect to fetch active friends data on component mount
    useEffect(() => {
        fetchFriendsActive();
    }, []);

    return { friendsActive, errorFriendsActive, isLoadingFriendsActive };
};

// Custom hook to handle private event handlers on an element
export const useUiPrivateEventHandlers = (elementRef) => {
    useEffect(() => {
        // Prevent default context menu on right-click
        const handleContextMenu = (event) => event.preventDefault();
        // Prevent default action for specific key presses
        const handleKeyDown = (event) => {
            const keysToPrevent = [32, 37, 38, 39, 40]; // Space and arrow keys
            if (keysToPrevent.includes(event.keyCode)) {
                event.preventDefault();
            }
        };

        const element = elementRef.current;
        element.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listeners on component unmount
        return () => {
            element.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [elementRef]);
};
