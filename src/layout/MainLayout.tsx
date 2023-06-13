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

                <Content style={{ margin: '0 16px' }}>
                    <div className="title-component">{getTitle(router.pathname)}</div>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: 'var(--secondary-color)',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

                <Footer className="flex items-center justify-center">
                    <KPText text={`&#169; KPlace ${year}`} fontWeight={500} />
                </Footer>
            </Layout>
        </WrapperLayout>
    );
};

const WrapperLayout = styled(Layout)`
    background-color: var(--tertiary-color);

    .ant-layout-content,
    .ant-layout-footer {
        background-color: var(--tertiary-color);
    }

    .title-component {
        font-size: 20px;
        font-weight: 700 !important;
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 28px;
        color: var(--primary-text-color);
    }
`;

export default MainLayout;
