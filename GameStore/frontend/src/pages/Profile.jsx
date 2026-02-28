import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShoppingBag, ShieldCheck, FileText, Loader, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const userRes = await axios.get('/api/users/me', config);
                setUser(userRes.data);

                const orderRes = await axios.get('/api/orders/myorders', config);
                setOrders(orderRes.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 text-[#d4af37] animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white pt-16 pb-24 px-6 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37] blur-[150px] opacity-10 rounded-full z-0 pointer-events-none"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 blur-[150px] opacity-10 rounded-full z-0 pointer-events-none"
            ></motion.div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">

                {/* Profile Widget */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-2xl p-8 lg:sticky lg:top-32 h-fit"
                    >

                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-24 h-24 bg-[#d4af37]/10 border border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            <span className="text-4xl font-black text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]">{user?.name?.charAt(0).toUpperCase()}</span>
                        </motion.div>
                        <h2 className="text-center text-2xl font-black text-white uppercase tracking-widest glow-text">{user?.name}</h2>
                        <div className="flex items-center justify-center text-gray-400 mt-2 mb-8 text-sm font-bold">
                            <Mail className="w-4 h-4 mr-2" /> {user?.email}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm bg-black border border-gray-800 p-4 rounded-xl">
                                <span className="text-gray-500 font-bold uppercase tracking-wider">Clearance</span>
                                <span className="text-[#d4af37] font-black uppercase tracking-widest">{user?.role}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm bg-black border border-gray-800 p-4 rounded-xl">
                                <span className="text-gray-500 font-bold uppercase tracking-wider">Joined</span>
                                <span className="font-mono text-gray-300">{new Date(user?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Orders Overview */}
                <div className="lg:col-span-2">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black uppercase text-white tracking-widest mb-8 flex items-center glow-text"
                    >
                        <ShoppingBag className="w-8 h-8 text-[#d4af37] mr-3" /> Acquisition History
                    </motion.h2>

                    {orders.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-12 text-center">
                            <p className="text-gray-500 font-bold uppercase tracking-widest">No vaults unlocked yet.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                // Detection of Payment Success securely utilizing the populated DB record
                                const paymentStatus = order.paymentId?.paymentStatus;
                                const isSuccess = paymentStatus === 'SUCCESS' || paymentStatus === 'success' || order.isPaid;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={order._id}
                                        className="glass-card rounded-2xl p-6 transition-all hover:bg-[rgba(255,255,255,0.02)] group"
                                    >

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 mb-4">
                                            <div>
                                                <p className="font-mono text-xs text-gray-500 tracking-wider">ORDER: {order._id}</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-left md:text-right flex flex-col items-start md:items-end">
                                                <span className="text-xl font-black text-white">
                                                    ₹{Number(order.totalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                                {isSuccess ? (
                                                    <span className="flex items-center text-green-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Payment Successful
                                                    </span>
                                                ) : paymentStatus === 'UNDER_REVIEW' ? (
                                                    <span className="flex items-center text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mt-1">
                                                        <ShieldCheck className="w-3 h-3 mr-1" /> Pending Admin Approval
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                        Status: {paymentStatus || 'PENDING'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-black border border-gray-800/50 p-3 rounded-lg">
                                                    <span className="font-bold text-gray-300">{item.title}</span>
                                                    <span className="text-gray-500 font-mono text-xs">
                                                        ₹{Number(item.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {isSuccess && (
                                            <motion.a
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={`/api/payments/receipt/${order._id}`}
                                                target="_blank" rel="noreferrer"
                                                className="w-full flex items-center justify-center bg-[#d4af37]/10 border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors text-[#d4af37] font-bold py-3 rounded-xl uppercase text-xs tracking-widest glow-btn glow-btn-gold"
                                            >
                                                <FileText className="w-4 h-4 mr-2" /> View Official Receipt
                                            </motion.a>
                                        )}

                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
