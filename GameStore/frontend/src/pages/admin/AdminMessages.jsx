import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, AlertCircle, Trash2, Send } from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.get('/api/contact/admin/contacts', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.put(`/api/contact/admin/contacts/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this transmission?")) return;
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.delete(`/api/contact/admin/contacts/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setMessages(messages.filter(msg => msg._id !== id));
        } catch (err) {
            console.error('Error deleting message', err);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center">
                        <Mail className="w-8 h-8 text-[#d4af37] mr-3" />
                        User <span className="text-[#d4af37] ml-2">Transmissions</span>
                    </h1>
                    <button onClick={fetchMessages} className="flex items-center text-sm font-bold bg-[#111] border border-gray-800 px-4 py-2 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Database
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32"><RefreshCw className="w-12 h-12 text-[#d4af37] animate-spin" /></div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="bg-[#111] border border-gray-800 p-8 rounded-xl text-center">
                                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest">No transmissions active in the queue.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    className={`p-6 rounded-xl border transition-all ${msg.isRead ? 'bg-[#111] border-gray-800 opacity-60' : 'bg-[#0a0a0a] border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]'}`}
                                >
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-white flex items-center">
                                                {msg.name}
                                                {!msg.isRead && (
                                                    <span className="ml-3 bg-red-600 px-2 py-0.5 rounded text-[10px] text-white uppercase tracking-widest font-black animate-pulse">New</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-[#d4af37] font-mono mt-1">{msg.email}</p>
                                            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wide">Subject: <span className="text-white">{msg.subject}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">{new Date(msg.createdAt).toLocaleString()}</p>
                                            {!msg.isRead && (
                                                <button
                                                    onClick={() => markAsRead(msg._id)}
                                                    className="flex items-center space-x-1 text-xs px-3 py-1 bg-green-900/40 text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors font-bold uppercase tracking-widest ml-auto"
                                                >
                                                    <CheckCircle className="w-3 h-3" /> <span>Mark Resolved</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteMessage(msg._id)}
                                                className="flex items-center space-x-1 text-xs px-3 py-1 bg-red-900/40 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-black transition-colors font-bold uppercase tracking-widest mt-2 ml-auto"
                                            >
                                                <Trash2 className="w-3 h-3" /> <span>Erase</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>

                                    <div className="border-t border-gray-800 pt-4 mt-4 flex justify-end">
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Support Request')}&body=${encodeURIComponent('\n\n\n---\nOn ' + new Date(msg.createdAt).toLocaleString() + ', ' + msg.name + ' wrote:\n' + msg.message)}`}
                                            className="flex items-center justify-center space-x-2 bg-[#d4af37] text-black font-extrabold px-6 py-2 rounded-lg hover:bg-[#e8c65f] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all uppercase tracking-widest text-xs"
                                        >
                                            <Send className="w-4 h-4" /> <span>Dispatch Email Reply</span>
                                        </a>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
