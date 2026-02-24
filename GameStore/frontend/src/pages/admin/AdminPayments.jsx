import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, X, CreditCard, Loader, RefreshCw, AlertCircle } from 'lucide-react';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [configSaving, setConfigSaving] = useState(false);
    const [configError, setConfigError] = useState('');

    const fetchPendingPayments = async () => {
        setLoading(true);
        setError('');
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.get('/api/admin/payments/pending', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setPayments(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending payments');
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentConfig = async () => {
        setConfigLoading(true);
        setConfigError('');
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.get('/api/admin/payments/config', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setConfig(data);
        } catch (err) {
            setConfigError(err.response?.data?.message || 'Failed to load payment QR config');
        } finally {
            setConfigLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPayments();
        fetchPaymentConfig();
    }, []);

    const handleConfirm = async (id) => {
        setActionLoading(id);
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.post(`/api/admin/payments/${id}/confirm`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setPayments(payments.filter(p => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to confirm payment');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this transaction?')) return;
        setActionLoading(id);
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.post(`/api/admin/payments/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setPayments(payments.filter(p => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reject payment');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveConfig = async (e) => {
        e.preventDefault();
        if (!config?.upiId || !config?.payeeName) {
            setConfigError('UPI ID and Name are required');
            return;
        }
        setConfigSaving(true);
        setConfigError('');
        try {
            const adminToken = localStorage.getItem('adminToken');
            const { data } = await axios.put(
                '/api/admin/payments/config',
                { upiId: config.upiId, payeeName: config.payeeName },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            setConfig(data);
        } catch (err) {
            setConfigError(err.response?.data?.message || 'Failed to save config');
        } finally {
            setConfigSaving(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const rowVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center">
                        <CreditCard className="w-8 h-8 text-[#d4af37] mr-3" />
                        Pending <span className="text-[#d4af37] ml-2">QR Payments</span>
                    </h1>
                    <button
                        onClick={fetchPendingPayments}
                        className="flex items-center text-sm font-bold bg-[#111] border border-gray-800 px-4 py-2 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Payment QR / UPI Config Editor */}
                <div className="mb-6 bg-[#111] border border-gray-800 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Payment QR Settings</h2>
                        {configLoading && <Loader className="w-4 h-4 text-[#d4af37] animate-spin" />}
                    </div>
                    {configError && (
                        <div className="bg-red-900/20 border border-red-800 text-red-500 p-2 rounded mb-3 text-xs flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" /> {configError}
                        </div>
                    )}
                    {config && !configLoading && (
                        <form
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                            onSubmit={handleSaveConfig}
                        >
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                    UPI ID (pa)
                                </label>
                                <input
                                    type="text"
                                    value={config.upiId}
                                    onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                    Payee Name (pn)
                                </label>
                                <input
                                    type="text"
                                    value={config.payeeName}
                                    onChange={(e) => setConfig({ ...config, payeeName: e.target.value })}
                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={configSaving}
                                    className="flex-1 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {configSaving && <Loader className="w-4 h-4 animate-spin mr-2" />}
                                    Save QR Settings
                                </button>
                            </div>
                        </form>
                    )}
                    {!config && !configLoading && !configError && (
                        <p className="text-xs text-gray-500">
                            No config found. Defaults are being used. Save to create a custom UPI configuration.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-500 p-4 rounded-lg mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-3" /> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader className="w-12 h-12 text-[#d4af37] animate-spin" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-12 text-center shadow-lg">
                        <CreditCard className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">No Pending Payments</h2>
                        <p className="text-gray-600 mt-2">All scanned QR orders have been resolved.</p>
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Transaction ID / UTR</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <motion.tr variants={rowVariants} key={payment._id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors group">
                                            <td className="p-4 text-sm text-gray-400">
                                                {new Date(payment.createdAt).toLocaleDateString()} <br />
                                                <span className="text-[10px] text-gray-600">{new Date(payment.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{payment.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{payment.user?.email || 'N/A'}</div>
                                            </td>
                                            <td className="p-4 font-mono text-sm text-[#d4af37]">
                                                {payment.transactionId}
                                            </td>
                                            <td className="p-4 font-black text-lg">
                                                ₹{Number(payment.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="p-4 flex justify-center space-x-3">
                                                <button
                                                    onClick={() => handleConfirm(payment._id)}
                                                    disabled={actionLoading === payment._id}
                                                    className="bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500 hover:text-black p-2 rounded-lg transition-all"
                                                    title="Approve Order"
                                                >
                                                    {actionLoading === payment._id ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(payment._id)}
                                                    disabled={actionLoading === payment._id}
                                                    className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                                    title="Reject Order"
                                                >
                                                    {actionLoading === payment._id ? <Loader className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminPayments;
