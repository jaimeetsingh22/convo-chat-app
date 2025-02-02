"use client"

import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import io from "socket.io-client";
import { HANG_UP, ONGOING_CALL, USER_OFFLINE, USER_ONLINE, WEB_RTC_SIGNAL } from "./constants/events";
import useSocketEvents from "./hooks/useSocketEvents";
import { setIsRinging, setIsVoiceCall, setOnGoingCall, setOnlineUsers } from "./redux/reducers/chat";
import CallNotificationDialog from "./components/dialogs/CallNotificationDialog";
import VideoCall from "./components/specific/VideoCall";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isCallEnded, setIsCallEnded] = useState(false)
  const [participant, setParticiapant] = useState({
    participants: {
      caller: {
        name: "",
        avatar: "",
        id: ""
      },
      receiver: {
        name: "",
        avatar: "",
        id: ""
      }
    }
  })
  const { onGoingCall, isRinging } = useSelector((state) => state.chat);
  const [peer, setPeer] = useState(null);
  const dispatch = useDispatch();
  const { data: userData } = useSession();

  const onlineUsersHandler = useCallback((users) => {

    dispatch(setOnlineUsers(users));
  }, [
    dispatch, socket
  ]);

  const getMediaStream = useCallback(async (faceMode) => {
    if (localStream) return localStream;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 360, ideal: 720, max: 1080 },
          frameRate: { min: 16, ideal: 30, max: 60 },
          facingMode: videoDevices.length > 0 ? faceMode : undefined
        }
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      toast.error("failed to access camera");
      console.log("something went wrong", error);
      dispatch(setLocalStream(null));
      return null;
    }
  }, [localStream]);

  const onIncomingCall = useCallback((data) => {
    // if (data.caller.id === userData?.user?.id) return;
    // console.log("inside incoming call", data);
    dispatch(setOnGoingCall({
      participants: data
    }));
    if (data.isVoiceCall) {
      dispatch(setIsVoiceCall(true));
    }
    setParticiapant({
      participants: data
    });
    dispatch(setIsRinging(true));
  }, [dispatch, userData?.user?.id]);

  const handleHangUp = useCallback((data) => {
    // console.log("inside the handlHandUp",data);
    if (socket && userData.user && data?.onGoingCall && data?.isEmitHangUp) {
      socket.emit(HANG_UP, {
        onGoingCall: data.onGoingCall,
        userHangingUpId: userData.user.id
      })
    }
    dispatch(setOnGoingCall({ onGoingCall: {} }));
    dispatch(setIsRinging(false));
    setPeer(null);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null);
    }
    setIsCallEnded(true);
  }, [dispatch, socket, userData, localStream])

  const createPeer = useCallback((stream, initiator) => {
    const iceServers = [{
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
      ]
    }];
    const peer = new Peer({
      stream,
      initiator,
      trickle: true,
      config: { iceServers }
    });

    peer.on('stream', (remoteStream) => {
      setPeer((prevPeer) => {
        if (prevPeer) {
          return { ...prevPeer, stream: remoteStream };
        }
        return prevPeer;
      })
    })
    peer.on('error', console.error);
    peer.on('close', () => handleHangUp({ isEmitHangUp: true }));

    const rtcPeerConnection = peer._pc
    rtcPeerConnection.oniceconnectionstatechange = async () => {
      if (rtcPeerConnection.iceConnectionState === 'disconnected' || rtcPeerConnection.iceConnectionState === 'failed') {
        handleHangUp({});
      }
    }

    return peer;
  }, [onGoingCall, setPeer]);

  const completePeerConnection = useCallback(async (connectionData) => {

    if (!localStream) {
      console.log("Missing the localStream ");
      return;
    }
    if (!connectionData) {
      console.log("Missing the connectionData");
      return;
    }
    if (peer) {
      peer?.peerConnection?.signal(connectionData.sdp)
      return;
    }

    const newPeer = createPeer(localStream, true);
    // console.log("inside complete peer",onGoingCall.participants?.reciever);
    setPeer({
      peerConnection: newPeer,
      participantUser: onGoingCall.participants?.reciever,
      stream: undefined,
    });
    newPeer.on('signal', async (data) => {
      if (socket) {
        // emit offer 
        socket.emit(WEB_RTC_SIGNAL, {
          sdp: data,
          onGoingCall,
          isCaller: true
        })
      }
    })

  }, [localStream, peer, createPeer, onGoingCall, socket])

  const handleJoinCall = useCallback(async (onGoingCall) => {
    setIsCallEnded(false);
    dispatch(setIsRinging(false));
    const stream = await getMediaStream();
    if (!stream) {
      console.log('could not get stream in handleJoinCall');
      return;
    }

    const newPeer = createPeer(stream, true);
    setPeer({
      peerConnection: newPeer,
      participantUser: onGoingCall.participants.caller,
      stream: undefined,
    });
    newPeer.on('signal', async (data) => {
      if (socket) {
        // emit offer 
        socket.emit(WEB_RTC_SIGNAL, {
          sdp: data,
          onGoingCall,
          isCaller: false
        })
      }
    })
  }, [socket]);

  const eventHandlers = {
    [USER_ONLINE]: onlineUsersHandler,
    [USER_OFFLINE]: onlineUsersHandler,
    [ONGOING_CALL]: onIncomingCall,
    [WEB_RTC_SIGNAL]: completePeerConnection,
    [HANG_UP]: handleHangUp
  }
  useSocketEvents(socket, eventHandlers);


  useEffect(() => {
    const newSocket = io();

    newSocket.on("connect", () => {
      console.log("Connected to socket server with ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    newSocket.on("reconnect", () => {
      console.log("Socket reconnected:", newSocket.id);
    });

    newSocket.on("reconnect_attempt", () => {
      console.log("Reconnecting...");
    });

    newSocket.on("reconnect_failed", () => {
      console.log("Reconnection failed");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, localStream, getMediaStream, handleJoinCall, handleHangUp, peer, setIsCallEnded, isCallEnded }}>
      <CallNotificationDialog />
      <VideoCall />
      {children}
    </SocketContext.Provider>
  );
};


export { getSocket, SocketProvider };
