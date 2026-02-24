import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, Users, ShoppingCart, DollarSign, LogOut, PackagePlus, ListCheck, LayoutGrid, Mail, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { adminInfo, loading, logoutAdmin } = useAdminAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 animate-pulse font-black text-2xl uppercase tracking-widest">
                Accessing Mainframe...
            </div>
        );
    }

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
        { path: '/admin/games', icon: ListCheck, label: 'Games' },
        { path: '/admin/games/new', icon: PackagePlus, label: 'Add Game' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/payments', icon: DollarSign, label: 'Payments' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/messages', icon: Mail, label: 'Contact Messages' },
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-[-10%] w-[30%] h-[50%] bg-red-600/5 blur-[150px] pointer-events-none rounded-full z-0"></div>

            {/* Admin Sidebar (Desktop) */}
            <div className="w-full md:w-64 bg-[#0a0a0a] border-r border-gray-800 p-6 hidden md:flex flex-col justify-between min-h-screen sticky top-0 z-10 shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-white mb-10 tracking-widest shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                        VAULT<span className="text-red-600">ADMIN</span>
                    </h2>

                    {adminInfo && (
                        <div className="mb-8 p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Admin</p>
                            <p className="text-white font-bold text-sm truncate">{adminInfo.name}</p>
                            <p className="text-red-500 text-xs truncate">{adminInfo.email}</p>
                        </div>
                    )}

                    <nav className="space-y-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path === '/admin/games' && location.pathname.includes('/edit'));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold tracking-widest text-xs uppercase ${isActive ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'text-gray-400 hover:bg-[#111] hover:text-white'}`}
                                >
                                    <item.icon className="w-5 h-5" /> <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <button
                    onClick={logoutAdmin}
                    className="flex items-center text-gray-500 hover:text-red-500 px-4 py-2 font-bold uppercase text-xs tracking-widest transition-colors mt-8 touch-target"
                >
                    <LogOut className="w-4 h-4 mr-2" /> End Session
                </button>
            </div>

            {/* Mobile/Tablet Sidebar (Drawer) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-72 bg-[#0a0a0a] border-r border-red-500/20 h-full p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-y-auto"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-black text-white tracking-widest shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                                        VAULT<span className="text-red-600">ADMIN</span>
                                    </h2>
                                    <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white touch-target"><X className="w-6 h-6" /></button>
                                </div>

                                {adminInfo && (
                                    <div className="mb-8 p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Admin</p>
                                        <p className="text-white font-bold text-sm truncate">{adminInfo.name}</p>
                                        <p className="text-red-500 text-xs truncate">{adminInfo.email}</p>
                                    </div>
                                )}

                                <nav className="space-y-4">
                                    {navItems.map((item) => {
                                        const isActive = location.pathname === item.path || (item.path === '/admin/games' && location.pathname.includes('/edit'));
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold tracking-widest text-xs uppercase touch-target ${isActive ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'text-gray-400 hover:bg-[#111] hover:text-white'}`}
                                            >
                                                <item.icon className="w-5 h-5" /> <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <button
                                onClick={() => { logoutAdmin(); setSidebarOpen(false); }}
                                className="flex items-center text-gray-500 hover:text-red-500 px-4 py-2 font-bold uppercase text-xs tracking-widest transition-colors mt-8 touch-target"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> End Session
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Header -> Replaced with Floating Action Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-30 bg-red-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] touch-target flex items-center justify-center glow-btn glow-btn-red"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Main Content Area */}
            <main className="flex-1 w-full relative z-10 overflow-x-hidden min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
