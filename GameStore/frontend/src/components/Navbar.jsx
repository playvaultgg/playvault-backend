import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Settings, PackageOpen, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.overflowX = 'hidden';
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await axios.get('/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(data);
                } catch (err) {
                    console.error('Invalid session or token expired', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            }
        };
        fetchUser();

        // Listen for storage events (login completion edge cases across tabs)
        window.addEventListener('storage', fetchUser);
        return () => window.removeEventListener('storage', fetchUser);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="sticky top-0 z-[100] border-b border-[rgba(255,255,255,0.05)] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                style={{ backgroundColor: 'rgba(5, 5, 5, 0.98)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
                    <Link to="/" className="text-[#d4af37] font-black text-xl md:text-3xl tracking-widest uppercase hover:text-white transition-colors duration-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] shrink-0" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        PLAY<span className="text-white">VAULT</span>
                    </Link>


                    <div className="hidden lg:flex items-center space-x-6 lg:space-x-8 text-gray-400 font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase shrink-0">
                        {['Home', 'Catalog', 'FAQ'].map((item, idx) => {
                            const paths = { "Home": "/", "Catalog": "/browse", "FAQ": "/faq" };
                            return (
                                <Link key={idx} to={paths[item]} className="relative group hover:text-[#d4af37] transition duration-300">
                                    {item}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#d4af37] transition-all duration-300 group-hover:w-full box-shadow-[0_0_10px_#d4af37]"></span>
                                </Link>
                            );
                        })}
                        <Link to="/browse" className="bg-[#d4af37] text-black px-3 lg:px-4 py-1.5 rounded-lg font-black text-[9px] lg:text-[11px] hover:bg-white transition-all shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 ring-1 ring-[#d4af37]/30 whitespace-nowrap">
                            SHOP NOW
                        </Link>
                    </div>



                    <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6 shrink-0">
                        {/* Hamburger Mobile Menu Toggle (Available on all small/tablet viewports) */}
                        <button className="lg:hidden text-white hover:text-[#d4af37] transition-colors touch-target p-2" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="w-8 h-8" />
                        </button>


                        <div className="relative hidden xl:block group">
                            <input
                                type="text"
                                placeholder="SEARCH VAULT..."
                                className="bg-[rgba(10,10,10,0.5)] text-gray-300 px-6 py-2.5 rounded-full border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#d4af37] w-64 text-xs font-bold tracking-widest uppercase transition-all duration-300 focus:w-72 focus:bg-[rgba(10,10,10,0.8)] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            />
                            <Search className="absolute right-4 top-3 text-gray-500 w-4 h-4 cursor-pointer hover:text-[#d4af37] transition-colors" />
                        </div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden lg:block">
                            <Link to="/cart" className="relative text-gray-400 hover:text-[#d4af37] transition-all p-3 bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-full hover:border-[#d4af37] shadow-lg flex items-center justify-center group touch-target">
                                <ShoppingCart className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                                <AnimatePresence>
                                    {cartItems.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1.5 -right-1.5 bg-[#d4af37] border-2 border-[#050505] text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                        >
                                            {cartItems.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>
                        {user ? (
                            <div className="relative hidden md:block">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 text-[#d4af37] font-black uppercase tracking-widest text-[10px] lg:text-[11px] hover:text-white transition-all p-2 lg:p-2.5 px-3 lg:px-4 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                >
                                    <span className="drop-shadow-[0_0_5px_rgba(212,175,55,0.5)] truncate max-w-[80px] lg:max-w-none">{user.name}</span>
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="glass-card absolute right-0 mt-4 w-56 rounded-2xl overflow-hidden z-50 p-2"
                                        >
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] rounded-xl hover:text-[#d4af37] transition-all text-xs font-bold uppercase tracking-wider text-gray-400 group">
                                                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> <span>Profile Config</span>
                                            </Link>
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] rounded-xl hover:text-[#d4af37] transition-all text-xs font-bold uppercase tracking-wider text-gray-400 group">
                                                <PackageOpen className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> <span>Active Orders</span>
                                            </Link>

                                            <div className="h-[1px] bg-[rgba(255,255,255,0.1)] my-2"></div>

                                            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[rgba(220,38,38,0.1)] rounded-xl hover:text-red-500 transition-all text-xs font-bold uppercase tracking-wider text-gray-500 group">
                                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Terminate Session</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden lg:block">
                                <Link to="/login" className="flex items-center space-x-2 text-white hover:text-[#d4af37] transition-all p-2 lg:p-2.5 px-4 lg:px-5 bg-gradient-to-r from-[rgba(212,175,55,0.2)] to-transparent border border-[rgba(212,175,55,0.3)] rounded-full hover:border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] group touch-target">
                                    <User className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]" />
                                    <span className="text-[10px] lg:text-xs uppercase font-black tracking-[0.2em] hidden sm:block">Authenticate</span>
                                </Link>
                            </motion.div>
                        )}

                    </div>

                </div>
            </motion.nav>

            {/* Mobile Drawer (Outside transformed parent) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="bg-[#050505] w-[85%] max-w-sm h-full border-r border-[#d4af37]/20 flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drawer Content with Safe Area Padding */}
                            <div className="p-6 h-full flex flex-col" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
                                <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-800">
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-[#d4af37] font-black text-2xl tracking-widest uppercase text-shadow-gold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                        PLAY<span className="text-white">VAULT</span>
                                    </Link>
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2">
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>


                                <div className="flex flex-col space-y-6 flex-grow">
                                    {['Home', 'Catalog', 'FAQ', 'CONTACT US'].map((item, idx) => {
                                        const paths = { "Home": "/", "Catalog": "/browse", "FAQ": "/faq", "CONTACT US": "/contact" };
                                        return (
                                            <Link key={idx} to={paths[item]} onClick={() => setMobileMenuOpen(false)} className="text-white font-bold text-xl tracking-[0.2em] uppercase hover:text-[#d4af37] transition duration-300">
                                                {item}
                                            </Link>
                                        );
                                    })}

                                    <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col space-y-4">
                                        {user ? (
                                            <>
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-12 h-12 bg-[#d4af37]/20 border border-[#d4af37] rounded-full flex items-center justify-center">
                                                        <span className="text-[#d4af37] font-black text-xl">{user.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[#d4af37] font-black uppercase tracking-widest text-sm">{user.name}</p>
                                                        <p className="text-gray-500 text-xs font-mono">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="bg-[#111] p-4 rounded-xl border border-gray-800 flex items-center shadow-lg">
                                                    <Settings className="w-5 h-5 mr-3 text-gray-400" /> <span className="text-white font-bold uppercase tracking-wider text-sm">Dashboard</span>
                                                </Link>
                                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="bg-red-900/10 p-4 rounded-xl border border-red-900/30 flex items-center justify-center mt-2 group hover:bg-red-900/30 transition-colors">
                                                    <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:scle-110" /> <span className="text-red-500 font-bold uppercase tracking-wider text-sm">Terminate Session</span>
                                                </button>
                                            </>
                                        ) : (
                                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-[#d4af37] text-black font-extrabold p-4 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)] flex justify-center uppercase tracking-widest text-sm text-center touch-target glow-btn glow-btn-gold">
                                                SECURE AUTHENTICATE
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fixed Mobile Cart Button (Outside transformed parent) */}
            <div className="sm:hidden fixed z-[120]" style={{ right: 'max(1.5rem, env(safe-area-inset-right))', bottom: 'calc(max(1.5rem, env(safe-area-inset-bottom)) + 1rem)' }}>
                <motion.div whileTap={{ scale: 0.9 }}>
                    <Link to="/cart" className="relative text-black bg-[#d4af37] p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center glow-btn glow-btn-gold touch-target h-14 w-14">
                        <ShoppingCart className="w-7 h-7" />
                        <AnimatePresence>
                            {cartItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute top-0 right-0 bg-black text-[#d4af37] border-2 border-[#d4af37] font-black text-xs w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                    {cartItems.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default Navbar;

