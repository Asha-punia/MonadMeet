import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import "./VideoMeet.css";
import { experimental_sx } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../components/Navbar";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Badge from '@mui/material/Badge';


const socket = io(import.meta.env.VITE_API_URL);

export default function VideoMeet() {
    const pcRef = useRef(null);
    const pendingCandidateRef = useRef([]);
    const { user } = useContext(AuthContext);
    let localVideoRef = useRef(null);
    let remoteVideoRef = useRef(null);
    let [username, setUsername] = useState(user.username);
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [isMuted, setIsMuted] = useState(false);
    let [isCameraOn, setIsCameraOn] = useState(true);
    let [inCall, setInCall] = useState(false);
    let [screenAvailable, setScreenAvaiable] = useState();
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [message, setMessage] = useState("");
    let [messages, setMessages] = useState([]);
    let [isRemoteConnected, setIsRemoteconnected] = useState(false);
    let [showInvite, setShowInvite] = useState(false);
    let [copied, setCopied] = useState(false);
    let [showChat, setShowChat] = useState(false);
    let [unreadMessages, setUnreadMessages] = useState(0);

    const { url } = useParams();
    let [roomId, setRoomId] = useState(url);
    const meetingLink = window.location.href;
    const copyMeetingLink = async() => {
        await navigator.clipboard.writeText(meetingLink);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    const getPermissions = async () => {
        try {
            console.log("getPermissions called");
            const pc = pcRef.current;
            //Video and Audio
            const userMediaStream = await navigator.mediaDevices.getUserMedia({video : true, audio : true});
            setVideoAvailable(true);
            setAudioAvailable(true);
         
            //Screen Sharing
            if(navigator.mediaDevices.getDisplayMedia) {
                setScreenAvaiable(true);
            }else {
                setScreenAvaiable(false);
            }
            //stream
            window.localStream = userMediaStream;
            localVideoRef.current.srcObject = userMediaStream;

            userMediaStream.getTracks().forEach((track) => {
                pc.addTrack(track, userMediaStream);
            });

        }catch(err) {
            setVideoAvailable(false);
            setAudioAvailable(false);            
            console.log("Streaming Failed!", err);
        }
    }

    const createPeerConnection = () => {
        pcRef.current = new RTCPeerConnection({
            iceServers : [
                { urls : "stun:stun.l.google.com:19302" }
            ]
        });
        pcRef.current.ontrack = (event) => {
            const remoteMediaStream = event.streams[0];
            if(remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteMediaStream;
            }
            setIsRemoteconnected(true);
        }  
        //send ice-candidate

        pcRef.current.onicecandidate = (event) => {
            if(event.candidate) {
                socket.emit("ice-candidate", event.candidate);
            }
        }
          
    }

    //Socket connected
    useEffect(() => {
        if (socket.connected) {
            console.log("connected!", socket.id);
        }

        const onConnect = () => {
            console.log("connected!", socket.id);
        };

        socket.on("connect", onConnect);
        return () => {
            socket.off("connect", onConnect);
        };

    }, []);

    const joinRoom = async () => {
        try {
            if(!roomId.trim()) {
                alert("Enter valid Room-Id!");
                return;
            }
            createPeerConnection();
            setInCall(true);
            await getPermissions();
            if(socket.connected) {
                socket.emit("room-id", roomId);
            }else {
                socket.connect();
                socket.once("connect", () => {
                    socket.emit("room-id", roomId);
                });
            }
        }catch(e) {
            console.log("error occured!", e);
        }
    }

    const createOffer = async () => {
        try {
            const pc = pcRef.current;
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", offer);
        }catch(e) {
            console.log("Error while creating offfer", e);
        }
    }
    //mute/unmute
    const toggleMute = () => {
        const audioTrack = window.localStream.getAudioTracks()[0];
        audioTrack.enabled = !(audioTrack.enabled);
        setIsMuted(!audioTrack.enabled);
    }
    //camera on/off
    const toggleCameraState = () => {
        const videoTrack = window.localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
    }
    //leave meeting
    const leaveMeeting = () => {
        window.localStream.getTracks().forEach((track) => {
            track.stop();
        });
        localVideoRef.current.srcObject = null;

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        window.localStream = null;

        pcRef.current.close();
        socket.disconnect();
        setInCall(false);
        setRoomId("");
    }
    //Screen Sharing
    const shareScreen = async () => {
        try {
            if(!navigator.mediaDevices?.getDisplayMedia) {
                alert("Screen sharing is not supported by this browser.");
                return;
            }
            //A sender is a pipeline. The track is the source flowing through that pipeline. replaceTrack() changes the source, not the pipeline.
            const screenStream = await navigator.mediaDevices.getDisplayMedia({video : true});
            localVideoRef.current.srcObject = screenStream;
            const screenTrack = screenStream.getVideoTracks()[0];
            const videoSender = pcRef.current.getSenders().find((sender) => sender.track?.kind === "video");
            if(!videoSender) {
                console.log("no video sender found!");
                return;
            }
            await videoSender.replaceTrack(screenTrack);
            screenTrack.onended = async () => {
                const screenSender = pcRef.current.getSenders().find((sender) => sender.track.kind === "video");
                const videoTrack = window.localStream.getVideoTracks()[0];
                await screenSender.replaceTrack(videoTrack);
                localVideoRef.current.srcObject = window.localStream;
            }
        }catch(e) {
            console.log("screen sharing failed!" , e);
            if(e.name !== "NotAllowedError") {
                alert("Unable to start screen sharing on this device.");
            }
        }
    }
    //Chat Section
    const sendMessage = () => {
        if(!message.trim()) {
            setMessage("");
            return;
        }
        socket.emit("chat-message", {
            username,
            message,
        });
        setMessage("");
    }
    useEffect(() => {
        socket.on("user-joined", () => {
            createOffer();
        });
    }, []);
    useEffect(() => {
        const handleMessage = (data) => {
            setMessages((prevData) => [...prevData, data]);
            console.log(data);
            if(!showChat && data.username != user.username) {
                setUnreadMessages((prev) => prev + 1);
            }
        }
        socket.on("chat-message", handleMessage);
        return () => {
            socket.off("chat-message", handleMessage);
        }
    }, [showChat, user]);

    useEffect(() => {
        const handleAnswer = async (answer) => {
            const pc = pcRef.current;
            if(!pc) {
                return;
            }
            if (pc.signalingState !== "have-local-offer") {
                return;
            }
            await pc.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
            while(pendingCandidateRef.current.length > 0) {
                const candidate = pendingCandidateRef.current.shift();
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }

        }
        socket.on("answer", handleAnswer);
        return () => {
            socket.off("answer", handleAnswer);
        };
    }, []);

    useEffect(() => {
            const handleOffer = async (offer) => {
                if(!pcRef.current) {
                    createPeerConnection();
                    await getPermissions();
                }
                const pc = pcRef.current;
                setInCall(true);
                await pc.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );
                while(pendingCandidateRef.current.length > 0) {
                    const candidate = pendingCandidateRef.current.shift();
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", answer);
            }
            socket.on("offer", handleOffer);
            return () => {
                socket.off("offer", handleOffer);
            }
    }, []);        

        //ice-candidate

        useEffect(() => {
            //receive ice-candidate

            const handleCandidate = async (candidate) => {
            try {
                const pc = pcRef.current;
                if(!pc) {
                    return;
                }
                if(!pc.remoteDescription) {
                    pendingCandidateRef.current.push(candidate);
                    return;
                }
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }catch (err) {
                console.log("Error adding ice candidate", err);
            }
            }

            socket.on("ice-candidate", handleCandidate);

            //cleanup

            return () => {
                socket.off("ice-candidate", handleCandidate);
            }

        }, []);      
    
    useEffect(() => {
        socket.on("user-disconnected", () => {
            // setIsUserDisconnected(true);
            if(remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }

            setIsRemoteconnected(false);
            setMessages([]);
        });
    }, []);

    return (
        <>
        {inCall ? (
            <div className="meeting-room">
                <div className="meeting-body">
                    <div className="video-section">
                        <div className="video-container">
                            {!isRemoteConnected && (
                                <div className="waiting-screen">
                                    <div className="waiting-avatar">
                                        <AccountCircleIcon style={{fontSize : 80}} />
                                    </div>
                                    <div className="waiting-title">
                                        waiting for participant...
                                    </div>
                                    <div className="waiting-subtitle">
                                        Share the meeting link to start the meeting.
                                    </div>
                                </div>
                            )}
                            <video ref={localVideoRef} autoPlay muted className="local-video" ></video>
                            <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" ></video>
                        </div>
                    </div>
                    <div className={`chat-section ${showChat ? "chat-open" : "chat-closed"}`}>
                        <div className="chat-header">
                            Chat
                            <IconButton onClick={() => setShowChat(false)} className="mobile-chat-close">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg) => {
                                return (
                                    <div className={`message-row ${(msg.username === username) ? "sent" : "received"}`}>
                                        <div className="message-bubble">
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div> 
                        <div className="chat-input">
                            <div className="chat-input-field">
                                <TextField
                                    fullWidth
                                    id="chat"
                                    placeholder="Type a message..."
                                    variant="outlined"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key == "Enter") {
                                            sendMessage();  
                                        }
                                    }}
                                >
                                </TextField>
                            </div>
                            <IconButton className="send-btn" onClick={sendMessage}><SendIcon /></IconButton>
                        </div>
                    </div>
                </div>
                <div className="control-bar">
                    <div className="control-buttons">
                        <IconButton onClick={toggleMute} >{isMuted ? <MicOffIcon /> : <MicIcon />}</IconButton>
                        <IconButton onClick={toggleCameraState}>{isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                        <IconButton onClick={shareScreen}><ScreenShareIcon /></IconButton>
                        <IconButton onClick={() => setShowInvite(true)}>
                            <PersonAddAltRoundedIcon />
                        </IconButton>
                        <IconButton className="mobile-chat-icon" onClick={() => {
                            setShowChat(true);
                            setUnreadMessages(0);
                        }}>
                            <Badge
                                badgeContent={unreadMessages}
                                color="error"
                                invisible={unreadMessages === 0}
                            >
                                <ChatOutlinedIcon />
                            </Badge>
                        </IconButton>
                        <IconButton className="leave-btn" onClick={leaveMeeting}><CallEndIcon /></IconButton>
                    </div>
                </div>
                {showInvite && (
                    <div className="invite-overlay">
                        <div className="invite-popup">
                            <IconButton onClick={() => setShowInvite(false)}>
                                <CloseIcon />
                            </IconButton>
                            <div className="invite-popup-main">
                                <h2>Invite to Meeting</h2>
                                <p>Share this meeting link with others to invite them to the call.</p>
                                <div className="meeting-link-container">
                                    <input type="text" value={meetingLink} readOnly />
                                    <IconButton onClick={copyMeetingLink}>
                                        {copied ? <DoneIcon /> : <ContentCopyRoundedIcon />}
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : 
        (
            <div className="lobbyContainter">
            <Navbar />
            <div className="lobby">
                <div className="lobby-card">
                    <h1 className="lobby-title">
                        <VideoCameraFrontIcon className="logo"/>
                        <span className="logo-text">
                            Meet<span className="logo-highLight">Sync</span>
                        </span>
                    </h1>
                    <p className="lobby-subtitle">Connect with anyone, anywhere.</p>
                    <div className="share-meeting-link">
                        <input value={meetingLink} readOnly/>
                        <IconButton onClick={copyMeetingLink}>
                            {copied ? <DoneIcon /> : <ContentCopyRoundedIcon />}
                        </IconButton>
                    </div>
                    <TextField id="username" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value) } required />
                    <TextField id="roomId" label="Room-Id" variant="outlined" value={roomId} onChange={(e) => setRoomId(e.target.value)} required />
                    <Button variant="contained" onClick={joinRoom}>Join Meeting</Button>
                </div>
            </div>
            </div>
        )}
    </>

    );

}

