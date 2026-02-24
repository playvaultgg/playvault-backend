import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader, AlertTriangle } from 'lucide-react';

const AdminAddEditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        description: '',
        imageUrl: '',
        category: '',
        platform: 'PC',
        countInStock: 0,
        isActive: true
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${adminToken}` } };
                const { data } = await axios.get('/api/admin/categories', config);
                setCategories(data);
                if (!isEditMode && data.length > 0) {
                    setFormData(prev => ({ ...prev, category: data[0].name }));
                }
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, [isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            const fetchGame = async () => {
                try {
                    const adminToken = localStorage.getItem('adminToken');
                    const config = { headers: { Authorization: `Bearer ${adminToken}` } };
                    const { data } = await axios.get(`/api/games/${id}`, config);
                    setFormData({
                        title: data.title,
                        price: data.price,
                        description: data.description,
                        imageUrl: data.imageUrl,
                        category: data.category,
                        platform: data.platform,
                        countInStock: data.countInStock,
                        isActive: data.isActive
                    });
                } catch (err) {
                    setError('Game protocol not found.');
                } finally {
                    setLoading(false);
                }
            };
            fetchGame();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            const adminToken = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${adminToken}` } };

            if (isEditMode) {
                await axios.put(`/api/admin/games/${id}`, formData, config);
            } else {
                await axios.post('/api/admin/games', formData, config);
            }
            navigate('/admin/games');
        } catch (err) {
            setError(err.response?.data?.message || 'Database Transaction Failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return null; // Loading handled by AdminLayout

    return (
        <div className="p-8 md:p-12 relative z-10 w-full animate-fadeIn">

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-10 border-b border-gray-800 pb-6">
                    <Link to="/admin/games" className="text-gray-500 hover:text-red-500 font-bold tracking-widest uppercase text-xs mb-4 flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        {isEditMode ? 'Modify' : 'Inject'} <span className="text-red-600">Protocol</span>
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-xl mb-8 flex items-center font-bold text-sm tracking-wide">
                        <AlertTriangle className="w-5 h-5 mr-3" /> {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-[0_4px_30px_rgba(220,38,38,0.05)] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Protocol Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" />
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Pricing (INR)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" />
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Vault Stock Count</label>
                            <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" />
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Category / Axis</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors">
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Execution Platform</label>
                            <input type="text" name="platform" value={formData.platform} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" placeholder="e.g. PC / PlayStation" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Cover Art Target (URL Link)</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Encrypted Metadata (Description)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors"></textarea>
                        </div>

                        <div className="md:col-span-2 flex items-center space-x-3 pt-4 border-t border-gray-800">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-red-600 bg-[#111] border-gray-800" />
                            <label className="text-gray-400 font-bold uppercase tracking-widest text-xs">Authorize Public Deployment (Active Status)</label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" disabled={actionLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center disabled:opacity-50">
                            {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                            {isEditMode ? 'OVERWRITE PROTOCOL' : 'INJECT PROTOCOL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddEditGame;
