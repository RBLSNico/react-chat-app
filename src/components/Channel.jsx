import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Channel = ({ db, darkMode }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch messages from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [db]);

    // Send a new message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return; // Prevent sending empty messages

        const user = getAuth().currentUser; // Get the current user
        if (user) {
            try {
                await addDoc(collection(db, 'messages'), {
                    text: newMessage,
                    uid: user.uid,
                    userName: user.displayName,
                    userImage: user.photoURL,
                    createdAt: new Date(),
                });
                setNewMessage(''); // Clear input field
            } catch (error) {
                console.error("Error adding message: ", error);
            }
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Chat Room</h2>
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {messages.map(message => (
                    <div key={message.id} className="flex items-center mb-2">
                        {message.userImage && (
                            <img
                                src={message.userImage}
                                alt={message.userName}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                        )}
                        <div className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-200'} text-black`}>
                            <strong>{message.userName}</strong>
                            <p className={`text-gray-700 ${darkMode ? 'text-gray-300' : 'text-black'}`}>{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-gray-800 text-white p-2 rounded-r-lg hover:bg-gray-700 transition">Send</button>
            </form>
        </div>
    );
}

export default Channel;
