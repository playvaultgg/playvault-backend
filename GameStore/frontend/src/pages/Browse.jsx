import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingBag, Filter, Flame } from 'lucide-react';

const Browse = () => {
    const [games, setGames] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            setFetchError('');
            try {
                const { data } = await axios.get('/api/games');
                setGames(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching games:', err);
                setFetchError('Could not load games. Check your connection or try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const filteredGames = games.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white pt-12 pb-24 overflow-x-hidden relative">
            {/* Animated Background Gradients */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#d4af37] blur-[150px] opacity-10 pointer-events-none rounded-full z-0"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900 blur-[150px] opacity-10 pointer-events-none rounded-full z-0"
            ></motion.div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800/50 pb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                            Complete <span className="text-[#d4af37]">Catalog</span>
                        </h1>
                        <p className="text-gray-400 font-medium tracking-wide">Explore our entire vault of premium game keys.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-[400px] mt-6 md:mt-0 relative"
                    >
                        <input
                            type="text"
                            placeholder="Search games..."
                            className="w-full bg-[#111111] border border-gray-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition shadow-[0_0_15px_rgba(0,0,0,0.5)] placeholder-gray-600 font-medium tracking-wide"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                    </motion.div>
                </div>

                {/* Filter Tags Layout (Visual Only for now) */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                    <button className="flex items-center px-4 py-2 bg-[#d4af37] text-black rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap"><Filter className="w-3 h-3 mr-2" /> All Games</button>
                    <button className="px-4 py-2 bg-[#111] border border-gray-800 text-white rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap hover:border-[#d4af37] transition">Action</button>
                    <button className="px-4 py-2 bg-[#111] border border-gray-800 text-white rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap hover:border-[#d4af37] transition">RPG</button>
                    <button className="px-4 py-2 bg-[#111] border border-gray-800 text-white rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap hover:border-[#d4af37] transition">PlayStation</button>
                    <button className="px-4 py-2 bg-[#111] border border-gray-800 text-white rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap hover:border-[#d4af37] transition">PC</button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-10">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse rounded-xl h-[340px] w-full p-4 flex flex-col justify-between overflow-hidden">
                                <div className="w-full h-40 bg-gray-800 rounded-lg mb-4"></div>
                                <div className="w-1/3 h-3 bg-gray-800 rounded mb-2"></div>
                                <div className="w-full h-5 bg-gray-800 rounded mb-4"></div>
                                <div className="w-full h-8 bg-gray-800 rounded mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {filteredGames.map(game => (
                            <motion.div
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                key={game._id}
                                className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-800 hover:border-[#d4af37]/50 transition duration-300 shadow-lg group flex flex-col h-full relative"
                            >
                                <Link to={`/game/${game._id}`} className="block relative h-48 overflow-hidden bg-gray-900 border-b border-gray-800/50 flex-shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"; }}
                                    />
                                    {game.trending && (
                                        <motion.span whileHover={{ y: -2 }} className="absolute top-2 right-2 bg-red-600/90 text-white text-[9px] font-black px-2 py-1 flex items-center rounded z-20 uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)]"><Flame className="w-3 h-3 mr-1 animate-pulse" /> Hot</motion.span>
                                    )}
                                </Link>

                                <div className="p-4 flex flex-col flex-grow relative bg-gradient-to-t from-[#000] to-transparent">
                                    <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{game.platform}</p>
                                    <h3 className="font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#d4af37] transition-colors">{game.title}</h3>

                                    <div className="flex justify-between items-center mt-auto border-t border-gray-800/80 pt-3">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 text-[#d4af37] fill-current" />
                                            <span className="text-gray-400 text-xs font-bold">{game.rating}</span>
                                        </div>
                                        <span className="text-[#d4af37] font-black tracking-wide">
                                            ₹{Number(game.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    <Link to={`/game/${game._id}`} className="mt-4 block w-full text-center py-2.5 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/50 uppercase text-xs font-bold tracking-widest rounded transition-all group-hover:bg-[#d4af37] group-hover:text-black hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                                        View Data
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {filteredGames.length === 0 && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        {fetchError ? (
                            <>
                                <h3 className="text-2xl font-bold text-red-400 uppercase tracking-widest">Could not load games</h3>
                                <p className="text-gray-500 mt-2">{fetchError}</p>
                                <p className="text-gray-600 mt-1 text-sm">The database may be unavailable. Check Railway deploy logs for &quot;MongoDB connected&quot;.</p>
                            </>
                        ) : games.length === 0 ? (
                            <>
                                <h3 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">No games in the vault yet</h3>
                                <p className="text-gray-600 mt-2">Add games via Admin, or run the seeder to populate the database.</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">No matching games found</h3>
                                <p className="text-gray-600 mt-2">Try adjusting your search query.</p>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Browse;
