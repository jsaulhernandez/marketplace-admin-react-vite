import {
    AndroidOutlined,
    ContainerOutlined,
    EyeOutlined,
    FilterOutlined,
    LaptopOutlined,
    PayCircleOutlined,
} from '@ant-design/icons';

import { Navigate } from 'react-router-dom';

import MainLayout from '@layout/MainLayout';
import Product from '@pages/Product';
import Category from '@pages/Category';
import Color from '@pages/Color';
import MemorySize from '@pages/MemorySize';
import Processor from '@pages/Processor';
import PaymentMethod from '@pages/PaymentMethod';

const RoutesList = [
    {
        path: '/categories',
        element: <Category />,
        title: 'Categorías',
        icon: <FilterOutlined />,
    },
    {
        path: '/colors',
        element: <Color />,
        title: 'Colores',
        icon: <EyeOutlined />,
    },
    {
        path: '/memory-size',
        element: <MemorySize />,
        title: 'Tamaños de memorias',
        icon: <AndroidOutlined />,
    },
    {
        path: '/pay-method',
        element: <PaymentMethod />,
        title: 'Metodos de pagos',
        icon: <PayCircleOutlined />,
    },
    {
        path: '/processor',
        element: <Processor />,
        title: 'Procesadores',
        icon: <LaptopOutlined />,
    },
    {
        path: '/products',
        element: <Product />,
        title: 'Productos',
        icon: <ContainerOutlined />,
    },
];

const Routes = [
    { path: '*', element: <Navigate to="/products" replace /> },
    {
        path: '/',
        element: <MainLayout />,
        children: RoutesList,
    },
];

export { Routes, RoutesList };
