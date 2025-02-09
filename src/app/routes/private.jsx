import React, { useState, useContext } from 'react';
import { NavLink, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import {
    IoSearch, IoDuplicate, IoCompass, IoSettings, IoChatboxEllipses, IoNotifications, IoPersonCircle
} from 'react-icons/io5';
import { GoHomeFill } from 'react-icons/go';

export default function PrivateRoute({ component }) {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        // Redirect to sign-in page if not authenticated
        !isAuthenticated ? <Navigate to={"/sign-in"} /> :
            <div className="flex flex-col w-screen h-screen">

                {/* Navigation bar */}
                <nav className="flex w-full h-12 px-2">
                    <ul className="flex size-full p-2 items-center">
                        <li className="text-lg font-semibold">
                            Friend<span className="text-orange-1">Link</span>
                        </li>

                        <li className="ml-auto">
                            <ul className="flex size-full items-center links">
                                <li className="flex p-2">
                                    <NavLink className="flex gap-2 items-center" to="/messages">
                                        <IoChatboxEllipses className="size-5" />
                                    </NavLink>
                                </li>
                                <li className="flex p-2">
                                    <NavLink className="flex gap-2 items-center" to="/notification">
                                        <IoNotifications className="size-5" />
                                    </NavLink>
                                </li>
                                <li className="flex p-2 mt-auto">
                                    <NavLink className="flex gap-2 items-center" to="/settings">
                                        <IoSettings className="size-5" />
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <div className="grid size-full grid-cols-12">
                    <div className="hidden md:flex md:col-span-1 lg:col-span-2 flex-col">
                        <ul className="flex flex-col h-full gap-4 p-2 font-semibold links">
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/">
                                    <GoHomeFill className="size-5" />
                                    <span className="md:hidden lg:block">Home</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/explore">
                                    <IoSearch className="size-5" />
                                    <span className="md:hidden lg:block">Explore</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/reels">
                                    <IoCompass className="size-5" />
                                    <span className="md:hidden lg:block">Reels</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/messages">
                                    <IoChatboxEllipses className="size-5" />
                                    <span className="md:hidden lg:block">Messages</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/notification">
                                    <IoNotifications className="size-5" />
                                    <span className="md:hidden lg:block">Notification</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/create">
                                    <IoDuplicate className="size-5" />
                                    <span className="md:hidden lg:block">Create</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2">
                                <NavLink className="flex gap-2 items-center" to="/profile">
                                    <IoPersonCircle className="size-5" />
                                    <span className="md:hidden lg:block">Profile</span>
                                </NavLink>
                            </li>
                            <li className="flex p-2 mt-auto">
                                <NavLink className="flex gap-2 items-center" to="/settings">
                                    <IoSettings className="size-5" />
                                    <span className="md:hidden lg:block">Settings</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Main content area */}
                    <div className="col-span-12 md:col-span-11 lg:col-span-10 flex flex-col overflow-y-auto no-scrollbar">
                        {component}
                    </div>
                </div>

                {/* Bottom navigation for mobile */}
                <div className="flex md:hidden w-full h-12 px-2">
                    <ul className="flex size-full items-center justify-between links">
                        <li className="flex p-2">
                            <NavLink className="flex gap-2 items-center" to="/">
                                <GoHomeFill className="size-5" />
                            </NavLink>
                        </li>
                        <li className="flex p-2">
                            <NavLink className="flex gap-2 items-center" to="/explore">
                                <IoSearch className="size-5" />
                            </NavLink>
                        </li>
                        <li className="flex p-2">
                            <NavLink className="flex gap-2 items-center" to="/create">
                                <IoDuplicate className="size-5" />
                            </NavLink>
                        </li>
                        <li className="flex p-2">
                            <NavLink className="flex gap-2 items-center" to="/reels">
                                <IoCompass className="size-5" />
                            </NavLink>
                        </li>
                        <li className="flex p-2">
                            <NavLink className="flex gap-2 items-center" to="/profile">
                                <IoPersonCircle className="size-5" />
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
    );
}