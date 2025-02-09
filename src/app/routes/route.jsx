import React from "react";
import PrivateRoute from "./private";

import { BrowserRouter, Routes, Route, } from "react-router-dom"
import { HomePage, ExplorePage, ReelsPage, MessagePage, NotificationPage, CreatePage, ProfilePage, EditProfilePage, SettingsPage } from "../page";
import { ViewPostPage, ViewProfilePage, NotFoundPage } from '../other'

import { SignUpPage, SignInPage, ForgotPasswordPage } from "../auth";


export default function AppRoute() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/sign-in" element={<SignInPage />} />
                <Route exact path="/sign-up" element={<SignUpPage />} />
                <Route exact path="/forgot" element={<ForgotPasswordPage />} />

                <Route exact path="/" element={<PrivateRoute component={<HomePage />} />} />

                <Route exact path="/explore" element={<PrivateRoute component={<ExplorePage />} />} />
                <Route exact path="/reels" element={<PrivateRoute component={<ReelsPage />} />} />
                <Route exact path="/messages" element={<PrivateRoute component={<MessagePage />} />} />
                <Route exact path="/notification" element={<PrivateRoute component={<NotificationPage />} />} />
                <Route exact path="/create" element={<PrivateRoute component={<CreatePage />} />} />
                <Route exact path="/profile" element={<PrivateRoute component={<ProfilePage />} />} />
                <Route exact path="/edit-profile" element={<PrivateRoute component={<EditProfilePage />} />} />

                <Route exact path="/settings" element={<PrivateRoute component={<SettingsPage />} />} />

                <Route path="/view-post/:postId" element={<PrivateRoute component={<ViewPostPage />} />} />
                <Route path="/view-profile/:userId" element={<ViewProfilePage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}