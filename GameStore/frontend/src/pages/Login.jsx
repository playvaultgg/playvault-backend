import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Gamepad2, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                navigate('/');
                window.location.reload(); // Refresh to update auth state globally
            }, 1000); // little delay for animation
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37] blur-[150px] opacity-20 rounded-full z-0 pointer-events-none"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 blur-[150px] opacity-20 rounded-full z-0 pointer-events-none"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="glass-card p-8 md:p-10 rounded-2xl w-full max-w-md z-10 relative">

                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Gamepad2 className="w-12 h-12 text-[#d4af37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase">Vault Login</h2>
                    <p className="text-gray-500 text-sm mt-1">Access your premium game collection.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                            placeholder="agent@playvault.gg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all pr-12"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-gray-500 hover:text-[#d4af37] focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#d4af37] text-black font-extrabold py-4 rounded-xl transition-all uppercase tracking-widest flex justify-center items-center mt-6 glow-btn glow-btn-gold">
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'A U T H E N T I C A T E'}
                    </motion.button>
                </form>

                <div className="mt-8 text-center border-t border-gray-800 pt-6">
                    <p className="text-gray-400 text-sm mb-4">
                        New to PlayVault?{' '}
                        <Link to="/register" className="text-[#d4af37] hover:underline font-bold transition-all ml-1">
                            REGISTER NOW
                        </Link>
                    </p>
                    <Link to="/admin/login" className="text-gray-700 text-[10px] hover:text-red-600 transition-colors uppercase font-bold tracking-[0.2em]">
                        [ Admin Override Gateway ]
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
