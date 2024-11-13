import { useEffect } from "react";

const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        if (socket) {
            Object.entries(handlers).forEach(([events, handler]) => {
                socket.on(events, handler);
            });
        }
        return () => {
            if (socket) {
                Object.entries(handlers).forEach(([events, handler]) => {
                    socket.off(events, handler);
                });
            }
        };
    }, [socket, handlers]);
}

export default useSocketEvents;