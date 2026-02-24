import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, RefreshCw, X, ShieldAlert, UserCheck, Trash2 } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.get('/api/admin/orders', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeleteOrder = async (e, orderId) => {
        e.stopPropagation();
        if (!window.confirm('Delete this order? This cannot be undone.')) return;
        setDeletingId(orderId);
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.delete(`/api/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setOrders(orders.filter(o => o._id !== orderId));
            if (selectedUser) setSelectedUser(null);
        } catch (err) {
            console.error('Failed to delete order', err);
            alert(err.response?.data?.message || 'Failed to delete order');
        } finally {
            setDeletingId(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    // Calculate details for selected user overlay
    const userOrdersDetails = selectedUser ? orders.filter(o => o.user._id === selectedUser._id) : [];
    const totalUserSpend = userOrdersDetails.reduce((sum, o) => sum + o.totalPrice, 0);

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center">
                        <ShoppingCart className="w-8 h-8 text-[#d4af37] mr-3" />
                        Platform <span className="text-[#d4af37] ml-2">Purchases</span>
                    </h1>
                    <button onClick={fetchOrders} className="flex items-center text-sm font-bold bg-[#111] border border-gray-800 px-4 py-2 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Orders
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32"><RefreshCw className="w-12 h-12 text-[#d4af37] animate-spin" /></div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                        <div className="hidden md:block overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Agent Identification</th>
                                        <th className="p-4">Items Secured</th>
                                        <th className="p-4">Capital</th>
                                        <th className="p-4">Gateway</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right">Timestamp</th>
                                        <th className="p-4 text-right w-20">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}
                                            onClick={() => setSelectedUser(order.user)}
                                            className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors cursor-pointer group">

                                            <td className="p-4 font-mono text-xs text-gray-500 flex items-center">
                                                <span className="truncate w-32 block" title={order.orderId || order._id}>
                                                    {order.orderId || order._id}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="font-bold text-white group-hover:text-[#d4af37] transition">{order.user?.name || 'Unknown'}</div>
                                                <div className="text-[10px] text-gray-500 group-hover:text-gray-400">{order.user?.email || 'N/A'} - {order.user?._id}</div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-col space-y-1">
                                                    {order.orderItems.map((item, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-300 w-fit">
                                                            {item.title} (x1)
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-4 text-lg font-black text-[#d4af37]">
                                                ₹{Number(order.totalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>

                                            <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                {order.paymentMethod}
                                            </td>

                                            <td className="p-4 text-center">
                                                {order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'success' || order.isPaid ? (
                                                    <span className="bg-green-900/40 border border-green-500 text-green-500 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">PAID</span>
                                                ) : order.paymentStatus === 'UNDER_REVIEW' ? (
                                                    <span className="bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">REVIEW</span>
                                                ) : order.paymentStatus === 'failed' || order.paymentStatus === 'REJECTED' ? (
                                                    <span className="bg-red-900/40 border border-red-500 text-red-500 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">REJECTED</span>
                                                ) : (
                                                    <span className="bg-gray-800/40 border border-gray-600 text-gray-400 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">PENDING</span>
                                                )}
                                            </td>

                                            <td className="p-4 text-xs text-gray-400 font-mono">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => handleDeleteOrder(e, order._id)}
                                                    disabled={deletingId === order._id}
                                                    className="p-2 rounded-lg border border-red-900/50 text-red-500 hover:bg-red-900/30 hover:border-red-500 transition-colors disabled:opacity-50"
                                                    title="Delete order"
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
                            {orders.map((order) => (
                                <motion.div
                                    key={order._id}
                                    onClick={() => setSelectedUser(order.user)}
                                    className="bg-[#111] rounded-xl p-4 border border-gray-800 shadow-lg relative flex flex-col cursor-pointer hover:border-[#d4af37]/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-3">
                                        <div>
                                            <div className="font-bold text-white group-hover:text-[#d4af37] transition text-sm">{order.user?.name || 'Unknown'}</div>
                                            <div className="text-[10px] text-gray-500 font-mono max-w-[200px] truncate">
                                                Order: {order.orderId || order._id}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-red-500 text-lg">
                                                ₹{Number(order.totalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 mb-4">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Items Secured</span>
                                        <div className="flex flex-wrap gap-1">
                                            {order.orderItems.map((item, idx) => (
                                                <span key={idx} className="text-[10px] bg-gray-900 px-2 py-1 rounded text-gray-300">
                                                    {item.title} (x1)
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto border-t border-gray-800 pt-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-black px-2 py-1 rounded border border-gray-800">
                                            {order.paymentMethod}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'success' || order.isPaid ? (
                                                <span className="bg-green-900/40 border border-green-500 text-green-500 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">PAID</span>
                                            ) : order.paymentStatus === 'UNDER_REVIEW' ? (
                                                <span className="bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">REVIEW</span>
                                            ) : order.paymentStatus === 'failed' || order.paymentStatus === 'REJECTED' ? (
                                                <span className="bg-red-900/40 border border-red-500 text-red-500 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">REJECTED</span>
                                            ) : (
                                                <span className="bg-gray-800/40 border border-gray-600 text-gray-400 font-bold px-3 py-1 text-[10px] rounded uppercase tracking-widest">PENDING</span>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteOrder(e, order._id); }} disabled={deletingId === order._id} className="p-1.5 rounded border border-red-900/50 text-red-500 hover:bg-red-900/30" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* User Details Modal Overlay */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedUser(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">

                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#050505] border border-[#d4af37]/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(212,175,55,0.1)] relative"
                        >
                            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-8 border-b border-gray-800 bg-gradient-to-b from-[#111] to-[#050505]">
                                <h2 className="text-3xl font-black uppercase text-white flex items-center tracking-widest">
                                    <UserCheck className="w-8 h-8 mr-3 text-[#d4af37]" /> Agent Dossier
                                </h2>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Name</p>
                                        <p className="font-bold text-white text-lg">{selectedUser.name}</p>
                                    </div>
                                    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Email Config</p>
                                        <p className="font-bold text-gray-400 font-mono text-sm mt-1">{selectedUser.email}</p>
                                    </div>
                                    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Encrypted ID Code</p>
                                        <p className="font-bold text-[#d4af37] font-mono text-xs mt-1 truncate">{selectedUser._id}</p>
                                    </div>
                                    <div className="bg-[#111] p-4 rounded-xl border border-[rgba(255,255,255,0.05)] text-right flex flex-col items-end shadow-lg shadow-green-900/5">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold">Total Vault Investment</p>
                                        <p className="font-black text-green-500 text-2xl md:text-3xl tracking-tighter">
                                            ₹{Number(totalUserSpend || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2 mb-4">Historical Acquisitions</h3>
                                {userOrdersDetails.length === 0 ? (
                                    <p className="text-gray-600 text-sm">No recorded transactions for this agent.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {userOrdersDetails.map(uo => (
                                            <div key={uo._id} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-center border border-gray-800/50 hover:border-[#d4af37]/30 transition">
                                                <div>
                                                    <p className="font-mono text-xs text-gray-500 mb-2">Order {uo._id}</p>
                                                    <div className="flex gap-2">
                                                        {uo.orderItems.map((item, idxx) => (
                                                            <span key={idxx} className="bg-black border border-gray-700 font-bold text-white px-2 py-1 rounded text-xs">{item.title}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-[#d4af37]">
                                                        ₹{Number(uo.totalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </p>
                                                    <p className="text-[10px] mt-1 font-bold text-gray-500 tracking-wider">
                                                        {new Date(uo.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminOrders;
