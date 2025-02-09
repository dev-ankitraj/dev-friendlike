import React, { useRef, useState, useEffect } from 'react';
import './player.css';
import { IoPlay, IoPause, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'

export default function VideoPlayer({ url }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start with muted
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const videoElement = videoRef.current;

        // IntersectionObserver to handle play/pause when the video enters/exits the viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoElement.play();
                        videoElement.loop = true;
                        setIsPlaying(true);
                        videoElement.muted = false; // Unmute when playing
                        setIsMuted(false);
                    } else {
                        videoElement.pause();
                        setIsPlaying(false);
                        videoElement.muted = true; // Mute when paused
                        setIsMuted(true);
                    }
                });
            },
            { threshold: 0.5 } // Adjust this threshold as needed
        );

        // Observe the video element
        if (videoElement) {
            observer.observe(videoElement);

            // Check if the video is already in view on initial load
            const rect = videoElement.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                videoElement.play();
                setIsPlaying(true);
                videoElement.muted = false; // Unmute when playing
                setIsMuted(false);
            }
        }

        // Event listener for progress bar update
        const updateProgress = () => {
            const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
            setProgress(currentProgress);
        };

        videoElement.addEventListener('timeupdate', updateProgress);

        // Cleanup observer on component unmount
        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
                videoElement.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleMuteUnmute = () => {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className='video-container '>
            <video ref={videoRef} className='video-player' muted>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className='video-overlay' onClick={handlePlayPause}></div>

            <div className='video-status'>
                <button type='button' onClick={handlePlayPause}>
                    {isPlaying ? <IoPause /> : <IoPlay />}
                </button>
                <button type='button' onClick={handleMuteUnmute}>
                    {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
                </button>
            </div>

            <div className="progress-bar-container">
                <div className='progress-bar' style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

