import React, { createContext, useState } from 'react';

// Create a context for application logging
export const AppLogContext = createContext();

export default function AppLogContextProvider({ children }) {
    // State to store log message and error
    const [appLog, setAppLog] = useState({
        message: null, error: null
    });

    // Function to handle logging messages and errors
    const handleAppLog = (message, error) => {
        // Update the state with the new log message and error
        setAppLog({ ...appLog, message: message, error: error });
        // Clear the log after 3 seconds
        setTimeout(() => {
            setAppLog({ ...appLog, message: null, error: null });
        }, 3000);
    };

    return (
        // Provide the appLog and handleAppLog to child components
        <AppLogContext.Provider value={{ appLog, handleAppLog }}>
            {children}
        </AppLogContext.Provider>
    );
};
