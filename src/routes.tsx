import MainLayout from '@layout/MainLayout';
import Products from '@pages/Products';
import { Navigate } from 'react-router-dom';

const RoutesList = [{ path: '/products', element: <Products />, title: 'Productos' }];

const Routes = [
    { path: '*', element: <Navigate to="/products" replace /> },
    {
        path: '/',
        element: <MainLayout />,
        children: RoutesList,
    },
];

export { Routes, RoutesList };
