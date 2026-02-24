import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Mail, RefreshCw, Shield, Clock, Trash2 } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        setDeletingId(userId);
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            console.error('Failed to delete user', err);
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center">
                        <Users className="w-8 h-8 text-[#d4af37] mr-3" />
                        Platform <span className="text-[#d4af37] ml-2">Agents</span>
                    </h1>
                    <button onClick={fetchUsers} className="flex items-center text-sm font-bold bg-[#111] border border-gray-800 px-4 py-2 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Database
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32"><RefreshCw className="w-12 h-12 text-[#d4af37] animate-spin" /></div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                        <div className="hidden md:block overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                        <th className="p-4">Agent Name</th>
                                        <th className="p-4">Clearance</th>
                                        <th className="p-4">Contact Protocol</th>
                                        <th className="p-4">Last Authorized Login</th>
                                        <th className="p-4 text-right">Account Created</th>
                                        <th className="p-4 text-right w-20">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                                            <td className="p-4 font-bold text-white flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{user.name}</span>
                                            </td>
                                            <td className="p-4">
                                                {user.role === 'admin' ? (
                                                    <span className="bg-red-900/40 text-red-500 border border-red-500 text-xs font-bold px-2 py-1 rounded flex items-center w-max uppercase tracking-widest">
                                                        <Shield className="w-3 h-3 mr-1" /> SYS_ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="bg-blue-900/40 text-blue-500 border border-blue-500 text-xs font-bold px-2 py-1 rounded w-max flex uppercase tracking-widest">
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-2 opacity-50" /> {user.email}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-mono text-[#d4af37]">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-xs text-gray-500 font-bold uppercase">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={deletingId === user._id}
                                                    className="p-2 rounded-lg border border-red-900/50 text-red-500 hover:bg-red-900/30 hover:border-red-500 transition-colors disabled:opacity-50"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Scrollable Cards */}
                        <div className="md:hidden flex flex-col space-y-4 p-4">
                            {users.map((user) => (
                                <div key={user._id} className="bg-[#111] rounded-xl p-4 border border-gray-800 shadow-lg relative flex flex-col hover:border-[#d4af37]/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                                <span className="text-[#d4af37] font-black">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base">{user.name}</div>
                                                <div className="flex items-center text-[10px] text-gray-500 font-mono mt-1">
                                                    <Mail className="w-3 h-3 mr-1" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3 mb-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500 font-bold uppercase tracking-widest">Clearance</span>
                                            {user.role === 'admin' ? (
                                                <span className="bg-red-900/40 text-red-500 border border-red-500 text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase tracking-widest gap-1">
                                                    <Shield className="w-3 h-3" /> SYS_ADMIN
                                                </span>
                                            ) : (
                                                <span className="bg-blue-900/40 text-blue-500 border border-blue-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                                                    User
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500 font-bold uppercase tracking-widest">Last Authorized</span>
                                            <span className="text-[#d4af37] font-mono whitespace-nowrap flex items-center">
                                                <Clock className="w-3 h-3 mr-1 inline-block" />
                                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[10px]">
                                        <span className="text-gray-600 font-mono truncate max-w-[120px]">ID: {user._id}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-bold uppercase">Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                                            <button onClick={() => handleDeleteUser(user._id)} disabled={deletingId === user._id} className="p-1.5 rounded border border-red-900/50 text-red-500 hover:bg-red-900/30" title="Delete user"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
