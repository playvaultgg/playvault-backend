import React from 'react';
import FAQ from '../components/FAQ';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const FaqPage = () => {
    return (
        <div className="bg-[#050505] min-h-screen text-white pt-10 pb-20 relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute top-[10%] left-[-10%] w-[30%] h-[50%] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center flex flex-col items-center"
                >
                    <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-6 border border-gray-800 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <HelpCircle className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        Vault <span className="text-[#d4af37]">Support</span>
                    </h1>
                    <p className="text-gray-400 font-medium tracking-wide max-w-xl mx-auto">
                        Everything you need to know about our digital key encryption, order processing, and account security.
                    </p>
                </motion.div>

                {/* FAQ Component imported directly here */}
                <div className="bg-[#0a0a0a] border border-gray-800/80 rounded-2xl p-6 md:p-12 shadow-2xl relative z-10 max-w-4xl mx-auto">
                    <FAQ />
                </div>

                <div className="mt-16 text-center text-gray-400 uppercase tracking-widest text-xs font-bold border-t border-gray-900 pt-8">
                    Still need assistance? Contact us at support@playvault.gg or send a transmission via Instagram.
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
