import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                if (!adminToken) {
                    throw new Error('No admin token found');
                }

                const { data } = await axios.get('/api/admin/me', {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });

                if (data.role === 'admin') {
                    setAdminInfo(data);
                } else {
                    throw new Error('Unauthorized role');
                }
            } catch (error) {
                console.error('Admin Auth Error:', error);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminInfo');
                navigate('/admin/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    const logoutAdmin = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setAdminInfo(null);
        navigate('/', { replace: true });
    };

    return { adminInfo, loading, logoutAdmin };
};
