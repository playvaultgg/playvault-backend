import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.role === 'admin') {
        return <Outlet />;
    }

    return <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
