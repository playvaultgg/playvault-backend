import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, AlertCircle, Loader, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/auth/register', { name, email, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#d4af37] blur-[150px] opacity-20 rounded-full z-0 pointer-events-none"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900 blur-[150px] opacity-20 rounded-full z-0 pointer-events-none"
            ></motion.div>

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="bg-[#111] border border-[#d4af37] p-12 rounded-xl text-center shadow-[0_0_50px_rgba(212,175,55,0.2)] max-w-md w-full relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <ShieldCheck className="w-24 h-24 text-green-500 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4 text-white tracking-widest uppercase">Vault Created</h2>
                        <p className="text-gray-400 mb-8">Your premium account has been securely synchronized.</p>
                        <p className="text-[#d4af37] font-bold text-sm tracking-wider flex items-center justify-center">
                            <Loader className="w-5 h-5 animate-spin mr-2" /> Initializing Login Protocol...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-card p-8 md:p-10 rounded-2xl w-full max-w-md z-10 relative">

                        <div className="flex flex-col items-center mb-8">
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <UserPlus className="w-12 h-12 text-[#d4af37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase mt-2">Enlist Now</h2>
                            <p className="text-gray-500 text-sm mt-1">Create your secure PlayVault identity.</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg mb-6 flex items-center text-sm">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Agent Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Secure Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    placeholder="agent@playvault.gg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Master Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 hover:text-[#d4af37]"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Verify Password</label>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    className="w-full bg-[#0a0a0a] text-white border border-gray-700 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-[34px] text-gray-500 hover:text-[#d4af37]"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                className="w-full bg-[#d4af37] text-black font-extrabold py-4 rounded-xl transition-all flex justify-center items-center mt-6 uppercase tracking-widest glow-btn glow-btn-gold">
                                {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'S E C U R E  A C C O U N T'}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center border-t border-gray-800 pt-6">
                            <p className="text-gray-400 text-sm">
                                Already enlisted?{' '}
                                <Link to="/login" className="text-[#d4af37] hover:underline font-bold transition-all ml-1">
                                    LOGIN HERE
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Register;
