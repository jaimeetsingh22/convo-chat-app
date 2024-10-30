import { useEffect } from "react";

const useSocketEvents = (socket,handlers)=>{
    useEffect(() => {
        Object.entries(handlers).forEach(([events,handler]) => {
            socket.on(events, handler);
        });
    
        return () => {
            Object.entries(handlers).forEach(([events,handler]) => {
                socket.off(events, handler);
            });
        };
      }, [socket,handlers]);
}

export default useSocketEvents;