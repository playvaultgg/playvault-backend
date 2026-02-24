import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, CheckCircle2, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('LOADING');
        setErrorMsg('');

        try {
            await axios.post('/api/contact', formData);
            setStatus('SUCCESS');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('ERROR');
            setErrorMsg(err.response?.data?.message || 'Failed to dispatch transmission.');
        }
    };
    return (
        <div className="bg-[#050505] min-h-screen text-white p-8 border-t border-gray-800">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold text-[#d4af37] mb-8 text-center" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    CONTACT US
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#111111] p-8 rounded-lg border border-gray-800 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
                        <p className="text-gray-400 mb-8">
                            Have a question about a game, an order, or your account?
                            Fill out the form or reach out to us directly on Instagram for the fastest response!
                        </p>

                        <div className="space-y-4 text-gray-300">
                            <p><strong>Email:</strong> <a href="mailto:playvaultgg258@gmail.com" className="text-[#d4af37] hover:underline">playvaultgg258@gmail.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+918909786621" className="text-[#d4af37] hover:underline">+91 89097 86621</a></p>
                            <p><strong>Support Hours:</strong> 24/7</p>
                        </div>

                        <a
                            href="https://instagram.com/playvault_gg"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded hover:scale-105 transition transform"
                        >
                            <Instagram className="w-5 h-5" />
                            <span>DM us on Instagram</span>
                        </a>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4 relative">
                            {status === 'SUCCESS' && (
                                <div className="absolute inset-0 bg-[#111]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                    <h3 className="text-xl font-bold uppercase tracking-widest text-[#d4af37]">Transmission Sent</h3>
                                    <p className="text-sm text-gray-400 mt-2 text-center px-6">Your message has been received by our terminal. A Vault Guardian will reply shortly.</p>
                                    <button onClick={() => setStatus('IDLE')} className="mt-6 text-[#d4af37] text-xs font-bold uppercase tracking-widest border border-[#d4af37] rounded px-4 py-2 hover:bg-[#d4af37] hover:text-black transition">
                                        Send Another
                                    </button>
                                </div>
                            )}

                            {status === 'ERROR' && (
                                <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-center text-sm">
                                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">Agent ID</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-[#050505] border border-gray-700 p-3 rounded focus:outline-none focus:border-[#d4af37]"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">Contact Node</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-[#050505] border border-gray-700 p-3 rounded focus:outline-none focus:border-[#d4af37]"
                                    placeholder="Your Email Address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">Transmission Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    className="w-full bg-[#050505] border border-gray-700 p-3 rounded focus:outline-none focus:border-[#d4af37]"
                                    placeholder="Subject of Inquiry"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">Directives</label>
                                <textarea
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    className="w-full bg-[#050505] border border-gray-700 p-3 rounded focus:outline-none focus:border-[#d4af37]"
                                    placeholder="How can we assist your operational needs?">
                                </textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'LOADING'}
                                className="w-full bg-[#d4af37] disabled:opacity-50 text-black font-extrabold py-3 flex items-center justify-center uppercase tracking-widest rounded hover:bg-[#e8c65f] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition"
                            >
                                {status === 'LOADING' ? <Loader className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> DISPATCH</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
