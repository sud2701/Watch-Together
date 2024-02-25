import { useState, useRef } from 'react';
import Card from './Card';
import VideoEntry from './VideoEntry';
import { checkYoutubeUrl, getYoutubeVideoId, getVideoTitle } from './utilities';
import YouTubePlayer from './YoutubePlayer';
import apiKey from './api';
function Room() {
    const [pause, setPause] = useState(false);
    const [theater, setTheater] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [showVol, setShowVol] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [playList, setPlayList] = useState([]);
    const videoRef = useRef(null);
    const [videoStyle, setVideoStyle] = useState("m-6 w-3/4");
    const [videoUrl, setVideoUrl] = useState('');

    const handleYoutube = async (e) => {
        e.preventDefault();
        console.log("Received URL: " + videoUrl);
        if (checkYoutubeUrl(videoUrl)) {
            console.log("URL check completed");
            const videoID = getYoutubeVideoId(videoUrl);
            let videoTitle = await getVideoTitle(videoID, apiKey);
            if(videoTitle === null){
                videoTitle = `Youtube Video - ${videoID}`;
            }
            if (videoID !== '') {
                console.log("Video ID received: " + videoID);
                const ytVideo = new VideoEntry(videoTitle, "Youtube Video", videoID);
                console.log("Created youtube video: ", ytVideo);
                let newPlayList = [...playList, ytVideo];
                setPlayList(newPlayList);
            }
        }
    };
    const handleVolumeChange = (e) => {
        videoRef.current.volume = e.target.value;
        videoRef.current.muted = e.target.value === 0;
    };

    const addVideos = (e) => {
        let newVideos = e.target.files;
        let videosToAdd = [];

        for (let i = 0; i < newVideos.length; i++) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const videoEntry = new VideoEntry(newVideos[i].name, "Local Video", event.target.result);
                videosToAdd.push(videoEntry);
                if (videosToAdd.length === newVideos.length) {
                    setPlayList(playList.concat(videosToAdd));
                }
            };
            reader.readAsDataURL(newVideos[i]);
        }
    };

    const deleteVideo = (index) => {
        let newPlaylist = [...playList.slice(0, index), ...playList.slice(index + 1)];
        setPlayList(newPlaylist);
    };

    const muteClicked = () => {
        setShowVol(!showVol);
    };
    const handleFullScreen = () => {
        if (theater) {
            setTheater(false);
            setVideoStyle("m-6 w-3/4");
        }
        let container = document.getElementById('video-container');
        if (videoRef.current) {
            if (document.fullscreenElement == null) {
                container.requestFullscreen();
            }
            else {
                document.exitFullscreen();
            }
            setFullscreen(!fullscreen);
        }
    };

    const handleKeyDown = (e) => {
        switch (e.key.toLowerCase()) {
            case " ":
            case "k":
                handlePlayPause();
                break;
            default: break;
        }
    };
    const handlePlayPause = () => {
        if (!pause) {
            videoRef.current.pause();
            videoRef.current.classList.add("paused");
        }
        else {
            videoRef.current.play();
            videoRef.current.classList.remove("paused");
        }
        setPause(!pause);
    };

    

    const changeVideo = (index) => {
        if (index < playList.length) {
            setPlayingVideo(playList[index]);
            deleteVideo(index);
        }
    };
    return (
        <div className="App" onKeyDown={handleKeyDown}>
            <div className="group">
                <div id="video-container" className={`${videoStyle} bg-black self-center flex flex-row justify-center align-center relative`}>
                    <div className="video-controls z-20 transition ease-in-out delay-100 opacity-0 group-hover:opacity-100 absolute bottom-0 w-full bg-gradient-to-t from-gray-900 to-transparent pb-2">
                        <div className="timeline">
                        </div>
                        {(playingVideo === null || playingVideo.type === "Local Video") && <div className="controls flex flex-row mx-4 align-center gap-12">
                            <button className="play-pause" onClick={() => {
                                handlePlayPause();
                            }}>
                                {pause && <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke="#ffffff"
                                    className="w-12 h-12 bottom-0"
                                >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#ffffff"></path>
                                    </g>
                                </svg>}
                                {
                                    !pause &&
                                    <svg viewBox="0 0 512 512" className="w-8 h-8 bottom-1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"></path></g></svg>
                                }
                            </button>
                            <div className="volume-container flex align-middle">
                                <button className="mute-volume" onClick={muteClicked}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                    </svg>

                                </button>
                                {showVol && <input className="volume-slider mx-2 transition-width duration-150 ease-in-out" type="range" min={0} max={1} step="any" onChange={handleVolumeChange}></input>}
                            </div>

                            <button className="theater-mode" onClick={() => {
                                if (fullscreen) {
                                    setFullscreen(false);
                                }
                                if (!theater) {
                                    setVideoStyle("m-0 max-h-[90vh]");
                                }
                                else {
                                    setVideoStyle("m-6 w-3/4");
                                }
                                setTheater(!theater);


                            }}>
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7V17C1 18.6569 2.34315 20 4 20H20C21.6569 20 23 18.6569 23 17V7ZM21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44771 3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7Z" fill="#ffffff"></path> </g></svg>
                            </button>
                            <button className="full-screen" onClick={handleFullScreen}>
                                {!fullscreen && <svg viewBox="0 0 26 26" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_710" data-name="Group 710" transform="translate(-200 -100)"> <path id="Path_1492" data-name="Path 1492" d="M224,126h-5v-2h5v-5h2v5A2.006,2.006,0,0,1,224,126Zm-4-4H208a1,1,0,0,1,0-2h12V106H206v11a1,1,0,0,1-2,0V106a2.006,2.006,0,0,1,2-2h14a2.006,2.006,0,0,1,2,2v14A2.006,2.006,0,0,1,220,122Zm-18-20v5h-2v-5a2.006,2.006,0,0,1,2-2h5v2Z" fill="#ffffff"></path> </g> </g></svg>}
                                {fullscreen && <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M.293 23.71c.2.19.45.29.71.29s.51-.1.71-.29l4.79-4.79.35.34 1.44 1.45c.197.19.447.29.707.29.13 0 .26-.03.38-.08.38-.15.62-.52.62-.92v-5c0-.55-.45-1-1-1H4.002c-.4 0-.77.24-.92.62-.16.37-.07.8.21 1.09l1.45 1.44.34.35-4.79 4.79c-.39.39-.39 1.03 0 1.42zm23.413 0c-.2.19-.45.29-.71.29s-.51-.1-.71-.29l-4.79-4.79-.35.34-1.44 1.45c-.196.19-.446.29-.706.29-.13 0-.26-.03-.38-.08-.38-.15-.62-.52-.62-.92v-5c0-.55.45-1 1-1h5c.4 0 .77.24.92.62.16.37.07.8-.21 1.09l-1.45 1.44-.34.35 4.788 4.79c.39.39.39 1.03-.002 1.42zM.293.29c.2-.19.45-.29.71-.29s.51.1.71.29L6.5 5.08l.35-.34 1.44-1.45C8.49 3.1 8.74 3 9 3c.13 0 .26.03.38.08.38.15.62.52.62.92v5c0 .55-.45 1-1 1H4.002c-.4 0-.77-.24-.92-.62-.16-.37-.07-.8.21-1.09l1.45-1.44.34-.35-4.79-4.79c-.39-.39-.39-1.03 0-1.42zm23.413 0c-.2-.19-.45-.29-.71-.29s-.51.1-.71.29L17.5 5.08l-.35-.34-1.44-1.45C15.51 3.1 15.26 3 15 3c-.13 0-.26.03-.38.08-.38.15-.62.52-.62.92v5c0 .55.45 1 1 1h5c.4 0 .77-.24.92-.62.16-.37.07-.8-.21-1.09l-1.45-1.44-.34-.35 4.788-4.79c.39-.39.39-1.03-.002-1.42z"></path> </g></svg>}
                            </button>
                            <button className="mini-view" onClick={() => { }}>
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM6 5H18C18.5523 5 19 5.44772 19 6V12.2676C18.7058 12.0974 18.3643 12 18 12H14C12.8954 12 12 12.8954 12 14V18C12 18.3643 12.0974 18.7058 12.2676 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5Z" fill="#ffffff"></path> </g></svg>
                            </button>

                        </div>}
                    </div>

                    {playingVideo === null ? (
                        <video src="Video.mp4" controls={false} ref={videoRef} className={theater ? 'w-min' : fullscreen ? 'h-full' : 'w-full'} id="video-view" autoPlay loop muted onEnded={() => { changeVideo(0) }}></video>
                    ) : (
                        playingVideo.type === "Local Video" ? (
                            <video src={playingVideo.url} controls={false} ref={videoRef} className={theater ? 'w-min' : fullscreen ? 'h-full' : 'w-full'} id="video-view" autoPlay muted onEnded={() => { changeVideo(0) }}></video>
                        ) : (
                            playingVideo.type === "Youtube Video" ? (
                                <YouTubePlayer videoUrl={playingVideo.url}></YouTubePlayer>
                            ) : null
                        )
                    )}
                </div>
                <p className="text-lg font-bold mx-10 mb-2">Add Videos to your playlist</p>
                <div className="flex justify-around items-center">
                    <div className="flex flex-col">
                        <h2 className="text-md font-semibold mb-4">Local Video Upload</h2>
                        <input type="file" accept="video/*" onChange={(e) => { addVideos(e); }} multiple className="mx-8"></input>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-md font-semibold mb-2">YouTube Video URL</h2>
                        <form onSubmit={handleYoutube}>
                            <div className="flex items-center w-full border-b-2 shadow-lg rounded border-gray-300 py-2 px-3">
                                <input
                                    type="url"
                                    placeholder="Enter YouTube video URL"
                                    className="w-full appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="flex-shrink-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col mx-10 justify-start">
                    <p className="font-bold text-lg">Your Playlist</p>
                    {playList.map((videoEntry, index) => {
                        return (
                            <div className="flex h-fit w-3/4 items-center" key={index}>
                                <div onClick={() => changeVideo(index)} className="w-full"><Card video={videoEntry}></Card></div>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 h-fit rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => { deleteVideo(index) }}>
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Room;