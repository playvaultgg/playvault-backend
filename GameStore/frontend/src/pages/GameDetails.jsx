import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Flame, Monitor, Download, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const { data } = await axios.get(`/api/games/${id}`);
                setGame(data);
            } catch (err) {
                console.error('Error fetching game details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
        window.scrollTo(0, 0); // Reset scroll on load
    }, [id]);

    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden">
                <div className="w-full h-[65vh] bg-gray-900 animate-pulse border-b border-gray-800"></div>
                <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="glass-card h-[300px] animate-pulse rounded-2xl"></div>
                        <div className="glass-card h-[250px] animate-pulse rounded-2xl"></div>
                    </div>
                    <div>
                        <div className="glass-card h-[400px] animate-pulse rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white flex-col">
                <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest text-[#d4af37]">Data Corrupted</h2>
                <Link to="/browse" className="bg-[#111] px-6 py-3 border border-gray-800 rounded hover:border-[#d4af37] transition-all">Return to Browse</Link>
            </div>
        );
    }

    const handleAdd = () => {
        addToCart(game);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 blur-[150px] pointer-events-none rounded-full"></div>

            {/* Premium Hero Header */}
            <div className="relative h-[65vh] w-full bg-[#111] flex items-end border-b border-[#d4af37]/20 shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {game.imageUrl && (
                    <motion.img
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        transition={{ duration: 1.2 }}
                        src={game.imageUrl}
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"; }}
                    />
                )}

                {/* Advanced Multi-Gradient Overlay logic */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent"></div>

                <div className="relative container mx-auto px-6 pb-10 md:pb-16 z-10 flex flex-col md:flex-row items-end justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                            {game.trending && (
                                <motion.span whileHover={{ y: -2 }} className="bg-red-600/20 border border-red-500 text-red-400 text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 flex items-center rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.4)]"><Flame className="w-3 md:w-4 h-3 md:h-4 mr-1 animate-pulse text-red-500" /> Trending</motion.span>
                            )}
                            <span className="bg-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-sm uppercase tracking-widest">
                                {game.category}
                            </span>
                            <span className="bg-[#111] border border-gray-700 text-white text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-sm uppercase tracking-widest flex items-center">
                                <Monitor className="w-3 h-3 mr-1 md:mr-2" /> {game.platform}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter text-white drop-shadow-2xl uppercase">
                            {game.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-400 font-bold tracking-wide text-xs md:text-sm">
                            <span className="flex items-center text-[#d4af37]"><Star className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 fill-current" /> {game.rating} / 5</span>
                            <span className="flex items-center text-green-500"><ShieldCheck className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" /> Verified Key</span>
                            <span className="flex items-center"><Zap className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 text-blue-400" /> Instant Access</span>
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Content & Purchasing Details Layout */}
            <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-12"
                >
                    {/* Description Box */}
                    <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-2xl p-8 md:p-10">
                        <h2 className="text-2xl font-black text-[#d4af37] mb-8 uppercase tracking-widest border-l-4 border-[#d4af37] pl-4 glow-text">Secure Intel Access</h2>
                        <p className="text-gray-300 leading-relaxed text-lg tracking-wide whitespace-pre-line font-medium drop-shadow-md">
                            {game.description}
                        </p>
                    </motion.div>

                    {/* System Requirements */}
                    <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden group">
                        <Monitor className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] text-gray-900 group-hover:text-gray-800 opacity-20 transition-colors duration-500 pointer-events-none" />
                        <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-widest border-l-4 border-gray-600 pl-4 relative z-10 glow-text">System Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="bg-[rgba(10,10,10,0.5)] p-6 rounded-xl border border-gray-800">
                                <p className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-3">Minimum</p>
                                <ul className="text-gray-400 text-sm space-y-2">
                                    <li><span className="text-white font-black">OS:</span> Windows 10 64-bit</li>
                                    <li><span className="text-white font-black">Processor:</span> Intel Core i5 / AMD Ryzen 5</li>
                                    <li><span className="text-white font-black">Memory:</span> 8 GB RAM</li>
                                    <li><span className="text-white font-black">Graphics:</span> NVIDIA GTX 1060</li>
                                </ul>
                            </div>
                            <div className="bg-[rgba(212,175,55,0.05)] p-6 rounded-xl border border-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                                <p className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-3">Recommended</p>
                                <ul className="text-gray-400 text-sm space-y-2">
                                    <li><span className="text-white font-black">OS:</span> Windows 11 64-bit</li>
                                    <li><span className="text-white font-black">Processor:</span> Intel Core i7 / AMD Ryzen 7</li>
                                    <li><span className="text-white font-black">Memory:</span> 16 GB RAM</li>
                                    <li><span className="text-white font-black">Graphics:</span> NVIDIA RTX 3070</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sticky Purchase Sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative lg:order-last order-first"
                >
                    <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gray-800 rounded-2xl p-6 md:p-8 lg:sticky lg:top-32 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                        <div className="text-center mb-6 md:mb-8 border-b border-gray-800/50 pb-6 md:pb-8">
                            <p className="text-[#d4af37] font-bold text-[10px] uppercase tracking-widest mb-3 bg-[#d4af37]/10 inline-block px-4 py-1 rounded-full">{game.platform} Edition</p>
                            <div className="flex justify-center items-start mt-2 md:mt-4">
                                <span className="text-2xl text-white font-bold mt-2">₹</span>
                                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                    {Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAdd}
                            disabled={added}
                            className={`w-full py-4 md:py-5 flex items-center justify-center space-x-3 rounded-xl font-extrabold uppercase tracking-widest transition-all mb-4 text-sm md:text-base ${added ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)] glow-btn' : 'bg-[#d4af37] text-black glow-btn glow-btn-gold'}`}
                        >
                            <ShoppingBag className="w-5 md:w-6 h-5 md:h-6" />
                            <span>{added ? 'ACQUIRED IN VAULT' : 'PURCHASE KEY'}</span>
                        </motion.button>

                        <div className="mt-6 md:mt-8 space-y-4">
                            <div className="flex items-center text-gray-400 text-sm">
                                <ShieldCheck className="w-5 h-5 text-green-500 mr-4 shrink-0" />
                                <div>
                                    <p className="text-white font-bold">Guaranteed Safe Checkout</p>
                                    <p className="text-xs mt-1">Encrypted via FamPay Gateway</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <Download className="w-5 h-5 text-blue-400 mr-4 shrink-0" />
                                <div>
                                    <p className="text-white font-bold">Instant Digital Download</p>
                                    <p className="text-xs mt-1">Code delivered instantly to dashboard</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 pt-6 border-t border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 items-center justify-center flex">
                                <ShieldCheck className="w-3 h-3 mr-1" /> FamPay Certified
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default GameDetails;
