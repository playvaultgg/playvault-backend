import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Gamepad2, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative bg-[#050505] text-gray-400 pt-16 pb-8 overflow-hidden">
            {/* Animated Gradient Top Border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
                <div>
                    <Link to="/" className="flex items-center space-x-2 text-[#d4af37] mb-6 inline-block">
                        <Gamepad2 className="w-8 h-8" />
                        <h3 className="text-2xl font-black tracking-widest uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>PLAYVAULT</h3>
                    </Link>
                    <p className="text-sm font-bold tracking-wide leading-relaxed text-gray-500">Your premium destination for the best games across all platforms. Level up your gaming experience today.</p>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-[0.3em] text-xs">Quick Links</h4>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-widest">
                        <li><Link to="/" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><span className="w-0 h-[1px] bg-[#d4af37] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span> Home</Link></li>
                        <li><Link to="/browse" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><span className="w-0 h-[1px] bg-[#d4af37] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span> Browse Games</Link></li>
                        <li><Link to="/contact" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><span className="w-0 h-[1px] bg-[#d4af37] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span> Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-[0.3em] text-xs">Support</h4>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-widest">
                        <li><a href="mailto:playvaultgg258@gmail.com" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><Mail className="w-4 h-4 mr-2" /> playvaultgg258@gmail.com</a></li>
                        <li><a href="tel:+918909786621" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><Phone className="w-4 h-4 mr-2" /> +91 89097 86621</a></li>
                        <li><Link to="/faq" className="text-gray-500 hover:text-[#d4af37] transition-all flex items-center group"><span className="w-0 h-[1px] bg-[#d4af37] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span> FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-[0.3em] text-xs">Connect</h4>
                    <div className="flex space-x-4">
                        <motion.a whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }} href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                            <Instagram className="w-5 h-5" />
                        </motion.a>
                        <motion.a whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }} href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                            <Twitter className="w-5 h-5" />
                        </motion.a>
                        <motion.a whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }} href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                            <Youtube className="w-5 h-5" />
                        </motion.a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-8 border-t border-gray-800/50 text-center text-xs font-bold tracking-widest uppercase flex flex-col md:flex-row justify-between items-center relative z-10">
                <p className="text-gray-600">© 2026 PLAYVAULT.GG. All rights reserved.</p>
                <div className="mt-4 md:mt-0 space-x-6">
                    <Link to="/privacy" className="text-gray-600 hover:text-[#d4af37] transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="text-gray-600 hover:text-[#d4af37] transition-colors">Terms of Service</Link>
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#d4af37] opacity-[0.02] blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-red-600 opacity-[0.02] blur-[150px] rounded-full pointer-events-none"></div>
        </footer>
    );
};

export default Footer;
