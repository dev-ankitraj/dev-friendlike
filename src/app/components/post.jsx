import React, { useContext, useEffect, useState } from 'react';
import Friend_Link_Server from '../../configs/server';
import { wrapText, formatDate, formatNumber } from '../../functions';
import VideoPlayer from './video/player';
import axios from 'axios';
import { AuthContext } from '../../contexts/auth';
import { AppLogContext } from '../../contexts/app-log';
import Loader from './loader';

import {
    IoBookmark, IoEllipsisVertical, IoChatbubbleEllipses, IoCalendar, IoClose, IoSend
} from 'react-icons/io5';
import { GoHeartFill } from 'react-icons/go';
import { MdDeleteForever } from "react-icons/md";

export default function Post({ post }) {
    const { authenticatedToken, authenticatedUser } = useContext(AuthContext);
    const { appLog, handleAppLog } = useContext(AppLogContext);

    const [userData, setUserData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [addCmt, setAddCmt] = useState('');
    const [commentData, setCommentData] = useState([]);
    const [isPostLiked, setIsPostLiked] = useState({ liked: false, likeId: '' });
    const [refresh, setRefresh] = useState(false);
    const [openCommentBox, setOpenCommentBox] = useState(false);
    const [showCaption, setShowCaption] = useState(false);
    const [captionLength, setCaptionLength] = useState(post?.caption?.length || 0);

    const handleShowCaption = () => {
        if (captionLength > 35) {
            setShowCaption(!showCaption);
        }
    };

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

    useEffect(() => {
        const getPostLikeId = async () => {
            const url = `${Friend_Link_Server.Server()}/like/post/${post?.postId}`;
            setIsLoading(true);
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`,
                    },
                });

                setIsPostLiked({ ...isPostLiked, liked: true, likeId: res.data.likeId });
            } catch (error) {
                if (error.request.status == 404) {
                    setIsPostLiked({ ...isPostLiked, liked: false, likeId: '' });
                    return;
                };

                handleAppLog('Error fetching post like data', true);
            }
            setIsLoading(false);
        };

        if (post?.postId) {
            getPostLikeId();
        }
    }, [post?.postId, refresh]);

    useEffect(() => {
        const getCommentData = async () => {
            const url = `${Friend_Link_Server.Server()}/comment/post/${post?.postId}`;
            setIsLoading(true);
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`,
                    },
                });
                setCommentData(res.data);
            } catch (error) {
                handleAppLog('Error fetching comment data', true);
            }
            setIsLoading(false);
        };

        if (post?.postId) {
            getCommentData();
        }
    }, [post?.postId, refresh]);

    const handlePostCommentLikes = async (type, liked, mediaId) => {
        const url = liked
            ? `${Friend_Link_Server.Server()}/like/delete/${type === 'post' ? isPostLiked?.likeId : commentData?.likeId}`
            : `${Friend_Link_Server.Server()}/like/create`;

        try {
            const res = liked
                ? await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`,
                    },
                })
                : await axios.post(url, type === 'post' ? { postId: mediaId } : { commentId: mediaId }, {
                    headers: {
                        Authorization: `Bearer ${authenticatedToken}`,
                    },
                });

            if (type === 'post') {
                setIsPostLiked((prevState) => ({
                    ...prevState,
                    liked: !liked,
                    likeId: liked ? '' : res.data.likeId,
                }));
            } else if (type === 'comment') {
                setCommentData((prevData) => ({
                    ...prevData,
                    likeId: liked ? '' : res.data.likeId,
                }));
            }

            setRefresh(!refresh);
        } catch (error) {
            handleAppLog(`Error ${liked ? 'unliking' : 'liking'} ${type}: ${error}`, true);
        }
    };

    const handleAddComment = async () => {
        if (addCmt) {
            const url = `${Friend_Link_Server.Server()}/comment/create`;

            try {
                const res = await axios.post(
                    url,
                    { comment: addCmt, postId: post?.postId },
                    { headers: { Authorization: `Bearer ${authenticatedToken}` } }
                );
                setRefresh(!refresh);
            } catch (error) {
                handleAppLog('Error adding comment', true);
            }
        }
        setAddCmt('');
    };

    const handleDeleteComment = async (cmtId) => {
        const url = `${Friend_Link_Server.Server()}/comment/delete/${cmtId}`;

        try {
            const res = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${authenticatedToken}`,
                },
            });

            if (res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error) {
            handleAppLog('Error deleting comment', true);
        }
    };

    if (isLoading) return <Loader size={'12'} />;

    return (
        <div className="flex flex-col items-center w-full max-w-96 relative rounded-2xl">
            <div className="flex gap-2 items-center w-full p-2">
                <img
                    src={`${Friend_Link_Server.DataBase.User_Avatar()}/${post?.profile_pic}`}
                    className="size-8 rounded-full cursor-pointer"
                    alt="Profile"
                />
                <div className="flex flex-col items-center cursor-pointer">
                    <p className="font-semibold text-sm">{wrapText(post?.name)}</p>
                    <p className="font-semibold text-xs sec-text">@{wrapText(post?.userId)}</p>
                </div>

                <div className="flex gap-2 ml-auto items-center">
                    <IoBookmark className="size-5 cursor-pointer" />
                    <IoEllipsisVertical className="size-5 cursor-pointer" />
                </div>
            </div>

            {post?.type === 'image' && (
                <img
                    src={`${Friend_Link_Server.DataBase.User_Posts()}/${post?.media}`}
                    className="size-full max-size-96"
                    alt="Post Media"
                />
            )}

            {post?.type === 'video' && (
                <VideoPlayer url={`${Friend_Link_Server.DataBase.User_Posts()}/${post?.media}`} />
            )}

            <div className="flex gap-4 items-center w-full p-2 h-10">
                <div className="flex items-center gap-2 w-16">
                    <GoHeartFill
                        className={`size-6 cursor-pointer ${isPostLiked.liked ? 'text-orange-2' : ''}`}
                        onClick={() => handlePostCommentLikes('post', isPostLiked.liked, post?.postId)}
                    />
                    <p className="font-semibold">{formatNumber(post?.likes)}</p>
                </div>
                <div className="flex items-center gap-2 w-16">
                    <IoChatbubbleEllipses
                        className="size-[22px] cursor-pointer"
                        onClick={() => setOpenCommentBox(!openCommentBox)}
                    />
                    <p className="font-semibold">{formatNumber(post?.comments)}</p>
                </div>
                <div className="flex gap-2 items-center ml-auto">
                    <p className="text-sm font-semibold sec-text">{formatDate(post?.created)}</p>
                    <IoCalendar className="size-5" />
                </div>
            </div>

            <div className="flex w-full gap-2 px-2 items-center flex-wrap">
                <p className="font-semibold sec-text">@{wrapText(post?.userId)}</p>
                <p
                    className={`text-sm cursor-pointer ${showCaption ? 'hidden' : ''}`}
                    onClick={handleShowCaption}
                >
                    {wrapText(post?.caption, 35)}
                    {captionLength > 35 && <span className="sec-text">.more</span>}
                </p>
                <div className="flex w-full flex-wrap">
                    <p
                        className={`text-sm cursor-pointer ${!showCaption ? 'hidden' : ''}`}
                        onClick={handleShowCaption}
                    >
                        {post?.caption}
                        {captionLength > 35 && <span className="sec-text">...less</span>}
                    </p>
                </div>
            </div>

            {openCommentBox && (
                <div className="flex flex-col w-full h-80 p-2 gap-2 absolute bottom-0 dark:bg-dark-2 bg-light-2 rounded-2xl">
                    <div className="flex w-full px-2 gap-2 items-center">
                        <IoChatbubbleEllipses className="size-6 cursor-pointer" />
                        <p>Comments:</p>
                        <p className="font-semibold">{formatNumber(post?.comments)}</p>
                        <IoClose
                            className="size-6 ml-auto text-orange-2 cursor-pointer"
                            onClick={() => setOpenCommentBox(false)}
                        />
                    </div>
                    <div className="flex w-full gap-4 justify-between h-12 items-center px-4 dark:bg-dark-2 bg-light-2 rounded-lg">
                        <img
                            src={`${Friend_Link_Server.DataBase.User_Avatar()}/${userData?.profile_pic}`}
                            className="size-8 rounded-full cursor-pointer"
                            alt="Profile"
                        />
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={addCmt}
                            onChange={(e) => setAddCmt(e.target.value)}
                            className="w-full px-3 h-full rounded-lg text-sm text-light-2"
                        />
                        <IoSend className="size-6 cursor-pointer text-orange-2" onClick={handleAddComment} />
                    </div>

                    <div className="flex flex-col w-full px-2">
                        {commentData?.map((cmt, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <img
                                    src={`${Friend_Link_Server.DataBase.User_Avatar()}/${cmt?.profile_pic}`}
                                    className="size-8 rounded-full cursor-pointer"
                                    alt="Commenter Avatar"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold text-xs">{wrapText(cmt?.name)}</p>
                                    <p className="font-normal text-sm">{wrapText(cmt?.comment)}</p>
                                    <div className="flex gap-2">
                                        <GoHeartFill
                                            className={`size-6 cursor-pointer ${cmt?.liked ? 'text-orange-2' : ''}`}
                                            onClick={() => handlePostCommentLikes('comment', cmt?.liked, cmt?.commentId)}
                                        />
                                        <MdDeleteForever
                                            className="size-6 cursor-pointer"
                                            onClick={() => handleDeleteComment(cmt?.commentId)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
