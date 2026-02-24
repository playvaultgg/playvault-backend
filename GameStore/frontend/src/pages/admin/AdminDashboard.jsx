import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Users, ShoppingCart, DollarSign, LogOut, PackagePlus, ListCheck, LayoutGrid, Mail } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${adminToken}` } };
                const { data } = await axios.get('/api/admin/stats', config);
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [navigate]);

    if (loading) return null; // Loading handled by AdminLayout

    // Total revenue is already stored in INR in the backend
    const revenueINR = Number(stats.totalRevenue) || 0;
    const revenueDisplay = `₹${revenueINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const statCards = [
        { title: 'Total Revenue', value: revenueDisplay, icon: DollarSign, color: 'text-green-500', border: 'border-green-500/20' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-500', border: 'border-blue-500/20' },
        { title: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500', border: 'border-purple-500/20' },
        { title: 'Vault Catalog', value: stats.totalGames, icon: Database, color: 'text-red-500', border: 'border-red-500/20' }
    ];

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">Systems Online</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Monitoring core game selling operations.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className={`bg-[#0a0a0a] border ${card.border} p-6 rounded-2xl shadow-lg relative overflow-hidden`}
                    >
                        <card.icon className={`absolute top-4 right-4 w-12 h-12 ${card.color} opacity-20`} />
                        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">{card.title}</h3>
                        <p className="text-3xl font-black text-white tracking-tighter">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Additions List */}
            <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-gray-800 pb-2 flex justify-between">
                    Recent Database Additions
                    <Link to="/admin/games" className="text-xs font-bold text-red-500 hover:text-white transition-colors">VIEW ALL</Link>
                </h2>
                <div className="space-y-4">
                    {stats.recentGames.map((game, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.05) }}
                            key={game._id}
                            className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-red-500/30 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden border border-gray-800">
                                    <img src={game.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{game.platform} • {game.category}</p>
                                    <h3 className="text-white font-bold">{game.title}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-red-500 font-black text-lg">₹{Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">{game.countInStock} Units</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
