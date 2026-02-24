import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/admin/login', { email, password });

            // Store strictly separated Admin Info
            localStorage.setItem('adminInfo', JSON.stringify(data));
            localStorage.setItem('adminToken', data.token);

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-50%] left-[50%] transform -translate-x-1/2 w-[600px] h-[600px] bg-red-600 blur-[200px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-[#0a0a0a] border border-gray-800/80 p-10 rounded-2xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.1)]"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest">Admin Login</h2>
                    <p className="text-gray-500 text-sm mt-2 uppercase tracking-wide font-bold">Secure Gateway Portal</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-900/20 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm text-center font-bold tracking-widest uppercase overflow-hidden"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Administrator Email</label>
                        <input
                            type="email"
                            className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Master Key (Password)</label>
                        <input
                            type="password"
                            className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50 mt-4"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'AUTHORIZE ADMIN'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
