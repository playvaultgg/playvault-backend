import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="bg-[#050505] min-h-screen text-white pt-12 pb-24 relative overflow-hidden">
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

            <div className="container mx-auto max-w-6xl px-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 border-b border-gray-800 pb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                            Encrypted <span className="text-[#d4af37]">Vault</span>
                        </h1>
                        <p className="text-gray-400 font-medium tracking-wide">Review your selected digital keys before secure checkout.</p>
                    </div>
                </motion.div>

                {cartItems.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-16 text-center max-w-2xl mx-auto mt-16 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                            <ShieldCheck className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-widest">Vault is Empty</h2>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">You haven't added any encrypted keys to your cart yet. Explore our premium catalog.</p>
                        <Link to="/browse" className="inline-block bg-white text-black font-extrabold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#d4af37] transition-all">Explore Games <ChevronRight className="inline w-5 h-5 ml-1" /></Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] mb-6 pb-4 border-b border-gray-800/50">Stored Keys ({cartItems.length})</h3>
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {cartItems.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className="bg-[#111] border border-gray-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between group hover:border-[#d4af37]/30 transition-colors"
                                            >
                                                <div className="flex items-center space-x-6 w-full sm:w-auto mb-4 sm:mb-0">
                                                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-900 rounded-md overflow-hidden">
                                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"; }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{item.platform}</p>
                                                        <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{item.title}</h3>
                                                        <p className="text-[#d4af37] font-black text-xl">
                                                            ₹{Number(item.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button onClick={() => removeFromCart(item._id)} className="w-full sm:w-auto py-3 sm:py-0 sm:px-4 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                                    <Trash2 className="w-5 h-5" /> <span className="sm:hidden font-bold uppercase tracking-widest text-xs">Remove</span>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Order Summary Layer */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-fit order-first lg:order-last">
                            <div className="glass-card rounded-2xl p-6 md:p-8 lg:sticky lg:top-32 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                                <h3 className="text-xl font-black text-white mb-6 border-b border-gray-800 pb-4 uppercase tracking-widest">Transaction <span className="text-[#d4af37]">Summary</span></h3>

                                <div className="space-y-4 mb-6 text-sm font-bold tracking-wide">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="text-white font-black uppercase">
                                            ₹{Number(getCartTotal()).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 pb-4 border-b border-gray-800">
                                        <span>Delivery Fee</span>
                                        <span className="bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded text-[10px] uppercase font-black tracking-widest border border-[#d4af37]/30">Instant</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-8 pt-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Due</span>
                                    <div className="flex items-start text-white">
                                        <span className="text-xl font-bold mt-1 mr-1">₹</span>
                                        <span className="text-5xl font-black tracking-tighter">
                                            {Number(getCartTotal()).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="w-full bg-[#d4af37] text-black font-black py-5 rounded-xl transition-all uppercase tracking-[0.2em] flex justify-center items-center glow-btn glow-btn-gold mt-4 text-sm">
                                    SECURE CHECKOUT <ShieldCheck className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </motion.div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
