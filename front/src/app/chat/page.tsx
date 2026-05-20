'use client';

import { useState } from 'react';
import { useChat } from '@/src/hooks/useChat';

export default function ChatPage() {
    const { messages, sendMessage } = useChat();

    const [text, setText] = useState('');
    const [user, setUser] = useState(
        'Dev' + Math.floor(Math.random() * 100)
    );

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(user, text);
            setText('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-10">

            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-bold text-white mb-6">
                    Live Chat Campo Real
                </h1>

                <div className="h-96 overflow-y-auto p-4 rounded-lg bg-gray-100">

                    {messages.map((m, i) => {

                        const isMe = m.sender === user;

                        return (

                            <div
                                key={i}
                                className={`flex mb-3 ${isMe
                                        ? 'justify-end'
                                        : 'justify-start'
                                    }`}
                            >

                                <div
                                    className={`max-w-xs p-3 rounded-lg ${isMe
                                            ? 'bg-blue-900 text-white ml-auto'
                                            : 'bg-white text-black mr-auto border'
                                        }`}
                                >

                                    <div className="font-bold mb-1">
                                        {isMe ? 'Você' : m.sender}
                                    </div>

                                    <div>
                                        {m.message}
                                    </div>

                                    <small className="block mt-1 opacity-70">
                                        {
                                            m.createdAt
                                                ? new Date(
                                                    m.createdAt
                                                ).toLocaleTimeString()
                                                : m.time
                                        }
                                    </small>

                                </div>

                            </div>

                        );

                    })}

                </div>

                <div className="flex gap-2 mt-4">

                    <input
                        className="flex-1 p-3 rounded border bg-white text-black"
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === 'Enter' &&
                            handleSend()
                        }
                        placeholder="Digite sua mensagem..."
                    />

                    <button
                        onClick={handleSend}
                        className="bg-blue-900 px-5 py-3 rounded text-white hover:bg-blue-800"
                    >
                        Enviar
                    </button>

                </div>

            </div>

        </div>
    );
}