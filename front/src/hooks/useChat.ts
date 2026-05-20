import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(
    'http://localhost:3000'
);

export const useChat = () => {

    const [messages, setMessages] =
        useState<any[]>([]);

    useEffect(() => {

        socket.on(
            'chatHistory',
            (history) => {

                setMessages(history);

            }
        );

        socket.on(
            'msgToClient',
            (newMsg) => {

                setMessages(prev => [
                    ...prev,
                    newMsg
                ]);

            }
        );

        return () => {

            socket.off(
                'chatHistory'
            );

            socket.off(
                'msgToClient'
            );

        };

    }, []);

    const sendMessage = (sender: string, message: string) => {

        socket.emit(
            'msgToServer',
            {
                sender,
                message
            }
        );

    };

    return {
        messages,
        sendMessage
    };

};