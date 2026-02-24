import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, PackagePlus, ArrowLeft, Loader } from 'lucide-react';

const AdminGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    const fetchGames = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${adminToken}` } };
            const { data } = await axios.get('/api/admin/games', config);
            setGames(data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Delete this game permanently from the vault?')) {
            setActionLoading(true);
            try {
                const adminToken = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${adminToken}` } };
                await axios.delete(`/api/admin/games/${id}`, config);
                fetchGames();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            } finally {
                setActionLoading(false);
            }
        }
    };

    if (loading) return null; // Loading handled by AdminLayout

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-800 pb-6">
                    <div>
                        <Link to="/admin/dashboard" className="text-gray-500 hover:text-red-500 font-bold tracking-widest uppercase text-xs mb-4 flex items-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Active <span className="text-red-600">Inventory</span></h1>
                        <p className="text-gray-400 font-medium tracking-wide mt-2 text-sm">Manage entire catalog, stock logic, and cover art metadata.</p>
                    </div>
                    <Link to="/admin/games/new" className="mt-6 md:mt-0 flex items-center justify-center w-full md:w-auto px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase tracking-widest text-sm rounded-xl transition-all shadow-lg shadow-red-600/20 touch-target glow-btn glow-btn-red">
                        <PackagePlus className="w-5 h-5 mr-2" /> Inject New Title
                    </Link>
                </div>

                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(220,38,38,0.05)]">
                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#111] text-gray-500 text-xs uppercase tracking-widest font-black">
                                    <th className="p-4 border-b border-gray-800">System ID</th>
                                    <th className="p-4 border-b border-gray-800">Cover & Title</th>
                                    <th className="p-4 border-b border-gray-800">Value (INR)</th>
                                    <th className="p-4 border-b border-gray-800">Category</th>
                                    <th className="p-4 border-b border-gray-800">Stock Count</th>
                                    <th className="p-4 border-b border-gray-800 text-center">Protocol</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {games.map((game, idx) => (
                                        <motion.tr
                                            key={game._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-800/50 hover:bg-[#111] hover:text-white transition-colors group"
                                        >
                                            <td className="p-4 text-xs font-mono text-gray-600 truncate max-w-[100px]">{game._id}</td>
                                            <td className="p-4 flex items-center space-x-4">
                                                <img src={game.imageUrl} className="w-10 h-10 object-cover rounded border border-gray-700 group-hover:border-red-500 transition-colors shrink-0" alt={game.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-gray-200 group-hover:text-white line-clamp-1">{game.title}</span>
                                                    {!game.isActive && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">OFFLINE</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 font-black text-red-500">
                                                ₹{Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{game.category}</td>
                                            <td className="p-4 font-black">
                                                {game.countInStock > 0 ? (
                                                    <span className="text-green-500">{game.countInStock}</span>
                                                ) : (
                                                    <span className="text-red-500">DEPLETED</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center space-x-4">
                                                    <Link to={`/admin/games/${game._id}/edit`} className="text-gray-500 hover:text-[#d4af37] transition-colors touch-target flex items-center justify-center" title="Edit Metadata">
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteHandler(game._id)}
                                                        disabled={actionLoading}
                                                        className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 touch-target flex items-center justify-center"
                                                        title="Purge Object"
                                                    >
                                                        {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Scrollable Cards */}
                    <div className="md:hidden flex flex-col space-y-4 p-4">
                        <AnimatePresence>
                            {games.map((game, idx) => (
                                <motion.div
                                    key={game._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-[#111] rounded-xl p-4 border border-gray-800 shadow-lg relative flex flex-col"
                                >
                                    <div className="flex space-x-4 mb-4">
                                        <img src={game.imageUrl} className="w-16 h-16 object-cover rounded border border-gray-700 shrink-0" alt={game.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-base text-gray-200 truncate pr-2">{game.title}</span>
                                                <span className="font-black text-red-500">
                                                    ₹{Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono truncate mb-1">ID: {game._id}</div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{game.category}</span>
                                                <span className="text-gray-600 text-[10px]">•</span>
                                                {game.countInStock > 0 ? (
                                                    <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">{game.countInStock} Left</span>
                                                ) : (
                                                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">DEPLETED</span>
                                                )}
                                                {!game.isActive && <span className="ml-2 px-1 py-0.5 bg-red-900/30 text-[9px] text-red-500 font-bold uppercase tracking-widest rounded leading-none">OFFLINE</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bottom Sheet for Card */}
                                    <div className="flex items-center justify-between border-t border-gray-800 pt-3 mt-auto">
                                        <Link to={`/admin/games/${game._id}/edit`} className="flex-1 flex items-center justify-center text-gray-400 hover:text-white py-2 transition-colors text-xs uppercase font-bold tracking-widest touch-target bg-gray-900 rounded-lg mr-2">
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(game._id)}
                                            disabled={actionLoading}
                                            className="flex-1 flex items-center justify-center text-red-500 hover:text-red-400 py-2 transition-colors text-xs uppercase font-bold tracking-widest touch-target bg-red-900/10 border border-red-900/30 rounded-lg"
                                        >
                                            {actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGames;
