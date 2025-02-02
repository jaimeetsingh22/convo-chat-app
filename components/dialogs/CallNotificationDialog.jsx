"use client"
import { CallEnd as CallEndIcon, Call as CallIcon } from "@mui/icons-material";
import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { getSocket } from "@/socket";
import { setIsRinging, setOnGoingCall } from "@/redux/reducers/chat";
import Peer from "simple-peer"
import { STREAM, WEB_RTC_SIGNAL } from "@/constants/events";

const CallNotificationDialog = () => {
  const { onGoingCall, isRinging } = useSelector((state) => state.chat);
  const [isHovered, setIsHovered] = useState(false);
  const { handleJoinCall, handleHangUp } = getSocket();
  const dispatch = useDispatch();



  if (!isRinging) return null;

  return (
    <Dialog
      open={isRinging}
      onClose={() => { }}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
        transition: { duration: 0.3, ease: "easeInOut" },
        sx: { borderRadius: "12px", p: 2, maxWidth: "350px" },
      }}
    >
      <Stack sx={{ p: 2, textAlign: "center" }}>
        <DialogTitle>
          Call from{" "}
          <Typography
            variant="span"
            sx={{ fontWeight: "bold", color: "black", textTransform: "capitalize" }}
          >
            {onGoingCall?.participants?.caller?.name?.split(" ")[0] || "Unknown"}
          </Typography>
        </DialogTitle>

        <Avatar
          sx={{
            alignSelf: "center",
            width: 100,
            height: 100,
            boxShadow: 3,
          }}
          src={onGoingCall?.participants?.caller?.avatar || ""}
        />

        <DialogContent>
          <DialogContentText>
            <Typography variant="span" sx={{ textTransform: "capitalize" }}>
              {onGoingCall?.participants?.caller?.name || "Unknown"}
            </Typography>{" "}
            is calling you
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 4 }}>
          {/* Answer Call Button with Jumping Animation */}
          <motion.div
            animate={isHovered ? {} : { y: [0, -10, 0] }}
            transition={isHovered ? {} : { repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              setIsHovered(true);
              handleJoinCall(onGoingCall);
            }}
          >
            <IconButton
              aria-label="answer call"
              sx={{
                backgroundColor: "green",
                color: "white",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
            >
              <CallIcon />
            </IconButton>
          </motion.div>

          {/* Decline Call Button */}
          <IconButton
            onClick={() => handleHangUp( {onGoingCall: onGoingCall ? onGoingCall : undefined, isEmitHangUp: true }) }
            color="secondary"
            aria-label="decline call"
            sx={{
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "darkred" },
            }}

          >
            <CallEndIcon />
          </IconButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

export default CallNotificationDialog;
