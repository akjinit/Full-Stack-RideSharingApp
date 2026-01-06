import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext();

export const SocketContext = ({ children }) => {

    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const url = import.meta.env.VITE_BASE_URL;

        const instance = io(url);

        socketRef.current = instance;
        setSocket(instance);          // ← this triggers provider re-render

        instance.on("connect", () => {
            console.log("Connected:", instance.id);
        });

        instance.on("disconnect", () => {
            console.log("Disconnected");
        });

        return () => {
            instance.disconnect();
            setSocket(null);
        };
    }, []);

    const sendMessage = (event, message) => {
        socketRef.current?.emit(event, message);
    };

    const recieveMessage = (event, callback) => {
        socketRef.current?.on(event, callback);
    };

    return (
        <SocketDataContext.Provider
            value={{ sendMessage, recieveMessage, socket }}
        >
            {children}
        </SocketDataContext.Provider>
    );
};
