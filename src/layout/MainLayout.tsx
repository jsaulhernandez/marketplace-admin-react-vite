import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Layout } from 'antd';
import styled from 'styled-components';

import { RoutesList } from '../routes';

import KPText from '@components/KPText';
import MainHeader from './components/Header';
import Sidebar from './components/Sidebar';

const { Content, Footer } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useLocation();

    const getTitle = (path?: string): string => {
        if (!path) return '';

        const result = RoutesList.find((item) => item.path === path);
        if (!result) return '';

        return result.title;
    };

    const year = new Date().getFullYear();

    return (
        <WrapperLayout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onCollapsed={setCollapsed} />

            <Layout>
                <MainHeader collapsed={collapsed} />

                <WrapperContent collapsed={collapsed}>
                    <div className="title-component">{getTitle(router.pathname)}</div>
                    <div className="container">
                        <Outlet />
                    </div>
                </WrapperContent>

                <WrapperFooter
                    className="flex items-center justify-center"
                    collapsed={collapsed}
                >
                    <KPText text={<>&#169;{` KPlace ${year}`}</>} fontWeight={500} />
                </WrapperFooter>
            </Layout>
        </WrapperLayout>
    );
};

const WrapperLayout = styled(Layout)`
    background-color: var(--tertiary-color);

    .ant-layout,
    .ant-layout-content,
    .ant-layout-footer {
        background-color: var(--tertiary-color);
    }
`;

const WrapperContent = styled(Content)<{
    collapsed: boolean;
}>`
    margin: 67px 16px 0px ${({ collapsed }) => (collapsed ? '66px' : '288px')};
    transition: all 0.2s, background 0s;
    -webkit-transition: all 0.2s, background 0s;
    -moz-transition: all 0.2s, background 0s;
    -o-transition: all 0.2s, background 0s;
    -ms-transition: all 0.2s, background 0s;

    .title-component {
        font-size: 20px;
        font-weight: 700 !important;
        padding: 24px 0px 12px 24px;
        line-height: 28px;
        color: var(--primary-text-color);
    }

    .container {
        padding: 24px;
        min-height: 360px;
        border-radius: 10px;
    }
`;

const WrapperFooter = styled(Footer)<{
    collapsed: boolean;
}>`
    margin-left: ${({ collapsed }) => (collapsed ? '66px' : '288px')};
    transition: all 0.2s, background 0s;
    -webkit-transition: all 0.2s, background 0s;
    -moz-transition: all 0.2s, background 0s;
    -o-transition: all 0.2s, background 0s;
    -ms-transition: all 0.2s, background 0s;
`;

export default MainLayout;
