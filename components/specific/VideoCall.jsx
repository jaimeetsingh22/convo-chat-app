'use client'
import { getSocket } from "@/socket";
import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const VideoContainer = ({ stream, isLocalStream, isCall }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream,isCall,isLocalStream]);

    return (
        <video
            style={{
                width: (isCall && isLocalStream) ? "30%" : "100%",
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#000",
                position: (isCall && isLocalStream)? "absolute" : "",
                top: (isCall && isLocalStream) ? "66%" : "",
                right: (isCall && isLocalStream) ? "5%" : "",
                transition:"all 0.3s ease-in"
            }}
            autoPlay
            playsInline
            muted={isLocalStream}
            ref={videoRef}
        />
    );
};

const VideoCall = () => {
    const { localStream, peer,handleHangUp,isCallEnded } = getSocket();
    const [isMicON, setIsMicON] = useState(true);
    const [isVideoON, setIsVideoON] = useState(true);
    const { onGoingCall,isVoiceCall } = useSelector(state => state.chat);



    useEffect(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            const audioTrack = localStream.getAudioTracks()[0];
            if(isVoiceCall){
                setIsVideoON(videoTrack.enabled = false);
            }else{
                setIsVideoON(videoTrack.enabled = true);
            }

            setIsMicON(audioTrack.enabled);
        }
    }, [localStream]);

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoON(videoTrack.enabled);
        }
    }, [localStream]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicON(audioTrack.enabled);
        }
    }, [localStream]);
    const isCall = localStream && peer && onGoingCall ? true : false;

    if(!localStream && !peer) return;
    return (
        <Dialog open={localStream} onClose={() => { }} maxWidth="md">
            <DialogContent sx={{ bgcolor: "#121212", color: "white", p: 2, borderRadius: 2,transition:"all 0.4s ease" }}>
                <Stack spacing={2} alignItems="center">
                    {peer && peer?.stream && <VideoContainer stream={peer.stream} isLocalStream={false} isCall={isCall} />}
                    
                    {localStream && <VideoContainer stream={localStream} isLocalStream={true} isCall={isCall} />}
                    <Stack direction="row" spacing={3} justifyContent="center">
                        <IconButton
                            sx={{
                                color: "white",
                                backgroundColor: isVideoON ? "black" : "grey",
                                borderRadius: "50%",
                                "&:hover": { backgroundColor: "#444" },
                            }}
                            onClick={toggleCamera}
                        >
                            {isVideoON ? <Videocam /> : <VideocamOff />}
                        </IconButton>
                        <IconButton
                            color="secondary"
                            sx={{
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                "&:hover": { backgroundColor: "darkred" },
                            }}
                            onClick={() => {handleHangUp({onGoingCall: onGoingCall ? onGoingCall : undefined , isEmitHangUp: true})}}
                        >
                            <CallEnd />
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: isMicON ? "black" : "grey",
                                color: "white",
                                borderRadius: "50%",
                                "&:hover": { backgroundColor: "#444" },
                            }}
                            onClick={toggleMic}
                        >
                            {isMicON ? <Mic /> : <MicOff />}
                        </IconButton>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default VideoCall;
