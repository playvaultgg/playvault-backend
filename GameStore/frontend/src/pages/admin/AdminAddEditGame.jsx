import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader, AlertTriangle, UploadCloud, X, Image as ImageIcon } from 'lucide-react';


const AdminAddEditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [useExternalLink, setUseExternalLink] = useState(false);



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
                if (!isEditMode) {
                    if (data.length > 0) {
                        setFormData(prev => ({ ...prev, category: data[0].name }));
                    } else {
                        setFormData(prev => ({ ...prev, category: 'General' }));
                    }
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
                    setImagePreview(data.imageUrl);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB limit.');
                return;
            }
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                setError('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData({ ...formData, imageUrl: '' });
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.imageUrl;

        setUploading(true);
        setUploadProgress(0);

        try {
            const adminToken = localStorage.getItem('adminToken');
            const data = new FormData();
            data.append('image', imageFile);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${adminToken}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            const response = await axios.post('/api/admin/upload-image', data, config);
            setUploading(false);
            return response.data.imageUrl;
        } catch (err) {
            setUploading(false);
            const status = err.response?.status;
            let msg = err.response?.data?.message || 'Image Upload Failed';

            if (status === 400 && msg.includes('cloud_name')) {
                msg = "CRITICAL: Cloudinary Configuration Missing. Please update .env file with CLOUDINARY_CLOUD_NAME.";
            } else if (status === 400) {
                msg = "UPLOAD REJECTED: " + msg + " (Check file type and size)";
            }

            setError(msg);
            throw err;
        }
    };



    const submitHandler = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            // Step 1: Upload image if in upload mode and a new file is selected
            let finalImageUrl = formData.imageUrl;
            if (!useExternalLink && imageFile) {
                finalImageUrl = await uploadImage();
            } else if (useExternalLink) {
                finalImageUrl = formData.imageUrl;
            }

            if (!finalImageUrl) {
                setError('Image protocol is required.');
                setActionLoading(false);
                return;
            }


            const adminToken = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${adminToken}` } };

            const finalData = { ...formData, imageUrl: finalImageUrl };

            if (isEditMode) {
                await axios.put(`/api/admin/games/${id}`, finalData, config);
            } else {
                await axios.post('/api/admin/games', finalData, config);
            }
            navigate('/admin/games');
        } catch (err) {
            console.error('Submit Error:', err);
            const msg = err.response?.data?.message || err.message || 'Database Transaction Failed';
            setError(msg);
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
                    <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-xl mb-8 flex flex-col font-bold text-sm tracking-wide">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                            <span>{error}</span>
                        </div>
                        {error.includes('Cloudinary') && (
                            <div className="mt-3 p-3 bg-black/40 rounded-lg border border-red-500/20 text-xs font-medium text-gray-300">
                                <p className="mb-2">⚠️ Cloud storage is not configured for your server.</p>
                                <button
                                    type="button"
                                    onClick={() => setUseExternalLink(true)}
                                    className="text-red-400 hover:text-red-300 underline"
                                >
                                    Switch to "External Link" mode to bypass this error.
                                </button>
                            </div>
                        )}
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
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors">
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Execution Platform</label>
                            <input type="text" name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors" placeholder="e.g. PC / PlayStation" />
                        </div>


                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest">Protocol Image Target</label>
                                <div className="flex bg-[#111] p-1 rounded-lg border border-gray-800">
                                    <button
                                        type="button"
                                        onClick={() => { setUseExternalLink(false); setImagePreview(imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl); }}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all ${!useExternalLink ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setUseExternalLink(true); setImagePreview(formData.imageUrl); }}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all ${useExternalLink ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Link
                                    </button>
                                </div>
                            </div>

                            {useExternalLink ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setImagePreview(e.target.value);
                                        }}
                                        className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors"
                                        placeholder="Enter secure image URL (https://...)"
                                    />
                                    {imagePreview && (
                                        <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {!imagePreview ? (
                                        <div className="relative border-2 border-dashed border-gray-800 rounded-2xl p-12 text-center hover:border-red-600 transition-colors group cursor-pointer overflow-hidden">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <UploadCloud className="w-12 h-12 text-gray-600 group-hover:text-red-600 mx-auto mb-4 transition-colors" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Drop Image or Click to Upload</p>
                                            <p className="text-gray-700 text-[10px] mt-2 font-medium">WEBP, PNG, JPG (MAX 5MB)</p>
                                        </div>
                                    ) : (
                                        <div className="relative group rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                                <label className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs uppercase cursor-pointer hover:bg-gray-200 transition-colors flex items-center">
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                    Replace
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-500 transition-colors flex items-center"
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Remove
                                                </button>
                                            </div>

                                            {uploading && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 overflow-hidden">
                                                    <div
                                                        className="h-full bg-red-600 transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {uploading && (
                                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                                            <span className="flex items-center">
                                                <Loader className="w-3 h-3 animate-spin mr-2" />
                                                Uploading to Neural Cloud...
                                            </span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>



                        <div className="md:col-span-2">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">Encrypted Metadata (Description)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-red-600 transition-colors"></textarea>
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
