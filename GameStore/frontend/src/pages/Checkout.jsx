import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, ShieldCheck, Instagram, HelpCircle, Loader, QrCode, Copy, CheckCircle, Mail, ExternalLink, Phone } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // QR State
    const [qrData, setQrData] = useState(null); // Will hold the UP string
    const [transactionState, setTransactionState] = useState(null); // Details of pending txn

    // Status
    const [success, setSuccess] = useState(false);
    const [errorDesc, setErrorDesc] = useState('');
    const [copied, setCopied] = useState(false);

    const [upiConfig, setUpiConfig] = useState({ upiId: 'playvault@fampay', payeeName: '' });

    useEffect(() => {
        const fetchUpiConfig = async () => {
            try {
                const { data } = await axios.get('/api/payments/config');
                if (data?.upiId) {
                    setUpiConfig({ upiId: data.upiId, payeeName: data.payeeName || '' });
                }
            } catch (err) {
                // silently ignore, fallback text will be used
            }
        };
        fetchUpiConfig();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(upiConfig.upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerateQR = async (e) => {
        e.preventDefault();
        setErrorDesc('');
        const total = Number(getCartTotal());
        if (cartItems.length === 0) {
            setErrorDesc('Your cart is empty. Add games before checkout.');
            return;
        }
        if (!total || total <= 0) {
            setErrorDesc('Cart total must be greater than zero.');
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                orderItems: cartItems.map(i => ({
                    title: i.title,
                    price: i.price,
                    game: i._id
                })),
                totalPrice: total
            };

            const { data } = await axios.post('/api/payments/fampay/qr/create', payload, config);

            // Dynamically assign tracking IDs to the frontend state
            setTransactionState({
                paymentId: data.paymentId,
                orderId: data.orderId
            });
            // Proceed to render exactly the deep link base64 QR payload
            setQrData(data.qrImage);

        } catch (err) {
            setErrorDesc(err.response?.data?.message || 'Failed to generate QR Code from FamPay.');
        } finally {
            setLoading(false);
        }
    };

    const [formTransactionId, setFormTransactionId] = useState('');

    const handleVerifyPayment = async () => {
        if (!formTransactionId.trim()) {
            setErrorDesc('Please enter your UPI or FamPay Transaction ID to verify your transaction.');
            return;
        }

        setLoading(true);
        setErrorDesc('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                paymentId: transactionState.paymentId,
                transactionId: formTransactionId
            };

            await axios.post('/api/payments/fampay/qr/verify', payload, config);
            setTimeout(() => navigate('/profile'), 5 * 60 * 1000); // hold 5 minutes then redirect

            setSuccess(true);
            clearCart();
        } catch (err) {
            setErrorDesc(err.response?.data?.message || 'Verification Failed. Make sure payment was processed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setQrData(null);
        setTransactionState(null);
    };

    if (cartItems.length === 0 && !success) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <p className="text-gray-400 text-xl font-bold">Your vault cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white p-8 overflow-hidden relative">
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

            <div className="container mx-auto max-w-5xl relative z-10">

                {/* Contact Us */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-end mb-6">
                    <a
                        href="https://instagram.com/playvault_gg"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 bg-gray-900/80 border border-gray-700 rounded-full px-4 py-2 hover:border-[#d4af37] hover:text-[#d4af37] transition text-xs sm:text-sm text-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Need help? Contact us on Instagram</span>
                        <Instagram className="w-4 h-4 ml-1" />
                    </a>
                </motion.div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-[#111111] border border-[#d4af37] mt-16 p-12 rounded-xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center max-w-2xl mx-auto">
                            <ShieldCheck className="w-24 h-24 text-green-500 mb-6" />
                            <h2 className="text-4xl font-extrabold mb-4 text-white uppercase tracking-wider">Payment Complete</h2>
                            <p className="text-gray-400 text-lg mb-8">Your transaction has been submitted. Your Steam ID & password will be sent to you via the contact details below.</p>

                            <div className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 mb-8 text-left space-y-4">
                                <h3 className="text-[#d4af37] font-bold uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Contact — Get your Steam credentials</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span className="text-gray-400 text-sm">Email:</span>
                                    <a href="mailto:playvaultgg258@gmail.com" className="text-white font-mono text-sm hover:text-[#d4af37] break-all">playvaultgg258@gmail.com</a>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span className="text-gray-400 text-sm">Phone:</span>
                                    <a href="tel:+918909786621" className="text-white font-mono text-sm hover:text-[#d4af37]">+91 89097 86621</a>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <Instagram className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span className="text-gray-400 text-sm">Instagram:</span>
                                    <a href="https://instagram.com/playvault_gg" target="_blank" rel="noreferrer" className="text-white font-mono text-sm hover:text-[#d4af37] inline-flex items-center">
                                        @playvault_gg <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Message us with your order details to receive your Steam ID and password. You can open Steam below when ready.</p>
                                <a
                                    href="https://store.steampowered.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#1b2838] hover:bg-[#2a475e] text-white font-bold rounded-lg transition-colors"
                                >
                                    Open Steam <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/profile')}
                                className="px-8 py-4 bg-[#d4af37] text-black font-extrabold rounded-xl uppercase tracking-wider"
                            >
                                Go to my dashboard
                            </motion.button>
                            <p className="text-gray-500 text-xs mt-4">This page will stay for 5 minutes, then redirect automatically.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="checkout-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16"
                        >
                            {/* Payment Section */}
                            <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
                                <h2 className="text-3xl font-bold text-[#d4af37] mb-8 flex items-center tracking-tight glow-text"><QrCode className="mr-3 w-8 h-8" /> FAMPAY SECURE CHECKOUT</h2>

                                {errorDesc && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mb-6 p-4 bg-red-900/10 border border-red-800/50 rounded-lg">
                                        {errorDesc}
                                    </motion.p>
                                )}

                                {!qrData ? (
                                    <form onSubmit={handleGenerateQR} className="space-y-8">
                                        <div className="p-5 border border-[#d4af37] bg-black rounded-xl">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                                                    <div className="w-2 h-2 bg-black rounded-full" />
                                                </div>
                                                <span className="font-bold text-xl text-white">FamPay QR Scanner</span>
                                            </div>
                                            <p className="text-sm text-gray-500 ml-10">Generate a unique QR code to scan securely with your FamPay App or any UPI app.</p>
                                        </div>

                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} type="submit"
                                            className="w-full text-black font-extrabold text-lg py-5 rounded-xl transition-all flex justify-center items-center bg-[#d4af37] disabled:opacity-50 uppercase tracking-widest glow-btn glow-btn-gold">
                                            {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'GENERATE INVOICE & PAY'}
                                        </motion.button>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center p-6 bg-black border border-gray-800 rounded-xl pb-32 md:pb-6"
                                    >
                                        <h3 className="text-xl font-bold mb-2">Scan to Pay via FamPay</h3>
                                        <p className="text-gray-400 text-sm mb-6 pb-4 border-b border-gray-800 w-full text-center tracking-wider uppercase">Order: <span className="font-mono text-[#d4af37]"> {transactionState?.orderId}</span></p>

                                        <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6 relative w-full h-[280px] sm:max-w-[280px] flex items-center justify-center overflow-hidden">
                                            <img
                                                src={qrData}
                                                alt="Payment QR Code"
                                                className="w-full h-full object-contain mx-auto rounded-lg scale-[1.2] sm:scale-100"
                                                style={{ imageRendering: 'pixelated' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <p className="text-black text-center text-sm font-bold mt-2 uppercase">Scan with any UPI app</p>

                                        <button onClick={handleCopy} className="mb-6 flex items-center justify-center px-4 py-2 bg-[#111] border border-gray-800 rounded-lg text-gray-300 hover:text-[#d4af37] transition-colors text-sm font-mono touch-target">
                                            {copied ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                            {copied ? 'Copied!' : `Copy UPI ID: ${upiConfig.upiId}`}
                                        </button>

                                        <div className="w-full mb-6">
                                            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Enter UPI Transaction ID</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 312567890123"
                                                value={formTransactionId}
                                                onChange={(e) => setFormTransactionId(e.target.value)}
                                                className="w-full bg-[#111] border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all text-sm"
                                            />
                                        </div>

                                        <div className="flex space-x-3 w-full fixed bottom-0 left-0 p-4 bg-[#050505] md:bg-transparent md:relative md:p-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] md:shadow-none border-t border-gray-800 md:border-none" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleVerifyPayment} disabled={loading} className="flex-1 bg-[#d4af37] text-black font-black py-4 md:py-4 rounded-xl flex justify-center transition-all items-center uppercase text-sm md:text-sm tracking-wider glow-btn glow-btn-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'I HAVE PAID'}
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCancel} disabled={loading} className="flex-[0.5] border border-gray-600 hover:border-red-500 hover:text-red-500 text-gray-400 font-bold py-4 md:py-4 rounded-xl transition-colors uppercase text-xs md:text-xs tracking-wider flex items-center justify-center">
                                                Cancel
                                            </motion.button>
                                        </div>

                                    </motion.div>
                                )}

                                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center border-t border-gray-900 pt-6">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> End-to-End Encrypted via FamPay API
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="glass-card rounded-2xl p-8 h-fit sticky top-24">
                                <h3 className="text-xl font-black text-white mb-6 border-b border-gray-800 pb-4 uppercase tracking-widest flex items-center justify-between">
                                    Transaction <span className="text-[#d4af37]">({cartItems.length})</span>
                                </h3>

                                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-[#0a0a0a] p-4 rounded-lg border border-gray-800/50 hover:border-[#d4af37]/30 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold tracking-wide truncate w-48" title={item.title}>{item.title}</span>
                                                <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Digital Key</span>
                                            </div>
                                            <span className="text-[#d4af37] font-black">
                                                ₹{Number(item.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-gray-800">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Due</span>
                                    <div className="flex items-start text-white">
                                        <span className="text-xl font-bold mt-1">₹</span>
                                        <span className="text-4xl font-black tracking-tighter">
                                            {Number(getCartTotal()).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Checkout;
