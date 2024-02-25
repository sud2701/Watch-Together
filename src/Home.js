import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        console.log(`Joining room ${roomCode} as ${userName}`);
        navigate("/room");
    };

    const handleCreateRoom = () => {
        console.log(`Creating a new room as ${userName}`);
        navigate("/room");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-md shadow-lg"
            >
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Watch Together</h1>
                <div className="mb-4">
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="userName"
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="roomCode" className="block text-sm font-medium text-gray-600">
                        Room Code
                    </label>
                    <input
                        type="text"
                        id="roomCode"
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleJoinRoom}
                        className="w-1/2 bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300 mr-2"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={handleCreateRoom}
                        className="w-1/2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 ml-2"
                    >
                        Create New Room
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
