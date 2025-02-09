import React, { useRef } from "react";

import AppRoute from "./app/routes/route";
import AuthContextProvider from "./contexts/auth";
import AppLogContextProvider from "./contexts/app-log";


export default function App() {

    return (
        <AppLogContextProvider>
            <AuthContextProvider>
                <AppRoute />
            </AuthContextProvider>
        </AppLogContextProvider>
    )
}
