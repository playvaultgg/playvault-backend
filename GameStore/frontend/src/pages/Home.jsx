import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, ShoppingBag, Flame } from 'lucide-react';

import FAQ from '../components/FAQ';

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const { data } = await axios.get('/api/games');
                setGames(data);
            } catch (err) {
                console.error('Error fetching games:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const heroImages = [
        '/images/hero-gta5.png',
        '/images/black-myth-wukong.png',
        '/images/cyberpunk-2077.png'
    ];

    // Rotate hero image logic
    const [currentHero, setCurrentHero] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            {/* HEROBANNER */}
            <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden border-b border-[#d4af37]/30">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentHero}
                        src={heroImages[currentHero]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Gradient Overlay for seamless blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-0"></div>
            </div>

            {/* TRENDING GAMES SECTION */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#d4af37] tracking-widest uppercase flex items-center">
                        <Flame className="w-8 h-8 mr-3 text-orange-500" /> Trending Now
                    </h2>
                    <Link to="/browse" className="text-sm font-bold text-gray-400 hover:text-white transition uppercase tracking-widest flex items-center">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-10">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse rounded-xl h-[380px] w-full p-4 flex flex-col justify-between overflow-hidden">
                                <div className="w-full h-48 bg-gray-800 rounded-lg mb-4"></div>
                                <div className="w-1/3 h-4 bg-gray-800 rounded mb-2"></div>
                                <div className="w-3/4 h-6 bg-gray-800 rounded mb-4"></div>
                                <div className="w-full border-t border-gray-800 pt-4 flex justify-between items-center">
                                    <div className="w-1/4 h-8 bg-gray-800 rounded"></div>
                                    <div className="w-10 h-10 bg-gray-800 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    >
                        {games.slice(0, 8).map(game => (
                            <motion.div
                                variants={cardVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                key={game._id}
                                className="glass-card rounded-xl overflow-hidden group relative block group"
                            >
                                <Link to={`/game/${game._id}`} className="block relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"; }}
                                    />

                                    {/* Glassmorphic Overlay badges */}
                                    <div className="absolute top-3 left-3 z-20 flex gap-2">
                                        {game.trending && <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-lg">Hot</span>}
                                        <span className="bg-[#d4af37]/90 backdrop-blur-md text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">{game.platform}</span>
                                    </div>

                                    <div className="absolute bottom-3 right-3 z-20">
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="bg-black/80 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/50 text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                        >
                                            <Star className="w-3 h-3 mr-1 fill-current" /> {game.rating}
                                        </motion.span>
                                    </div>
                                </Link>

                                <div className="p-5 flex flex-col justify-between h-[140px]">
                                    <div>
                                        <p className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase mb-2">{game.category}</p>
                                        <h3 className="font-extrabold text-lg text-white mb-2 line-clamp-1 group-hover:text-[#d4af37] transition-colors">{game.title}</h3>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-gray-800 pt-3">
                                        <span className="text-2xl font-black text-white">
                                            ₹{Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                        <Link to={`/game/${game._id}`} className="p-2 bg-gray-900 rounded-lg hover:bg-[#d4af37] hover:text-black transition-colors">
                                            <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* CALL TO ACTION BANNER */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-6 py-16 mb-16"
            >
                <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/50 shadow-[0_0_50px_rgba(212,175,55,0.2)] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 10, ease: "linear" }}
                        src="/images/ghost-of-tsushima.png"
                        className="absolute inset-0 w-full h-full object-cover object-right"
                        alt="promo"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop"; }}
                    />

                    <div className="relative z-20 p-10 md:p-16 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg">Unleash The <span className="text-[#d4af37] glow-text">Samurai</span></h2>
                        <p className="text-gray-300 font-medium mb-8 text-lg drop-shadow-md">Ghost of Tsushima is now available. Instant delivery with zero hidden fees. Enhance your collection today.</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                            <Link to="/browse" className="inline-block px-8 py-4 bg-white text-black font-extrabold tracking-widest uppercase rounded-xl hover:bg-[#d4af37] transition-all glow-btn glow-btn-gold">
                                Shop New Releases
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* INTEL FAQ MODULE */}
            <div className="container mx-auto px-6 py-16 border-t border-gray-900 mt-10">
                <FAQ />
            </div>
        </div>
    );
};

export default Home;
