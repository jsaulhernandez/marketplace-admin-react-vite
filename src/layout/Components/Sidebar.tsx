import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import styled from 'styled-components';

import { RoutesList } from '../../routes';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export interface SidebarProps {
    collapsed: boolean;
    onCollapsed: (value: boolean) => void;
}

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const Sidebar: FC<SidebarProps> = (props) => {
    const items: MenuItem[] = RoutesList.map((r, i) =>
        getItem(<Link to={r.path}>{r.title}</Link>, i, r.icon),
    );

    return (
        <Wrapper
            collapsible
            collapsed={props.collapsed}
            onCollapse={(value) => props.onCollapsed(value)}
            breakpoint="lg"
            collapsedWidth={50}
            width={272}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="demo-logo-vertical p-2 flex items-center justify-center">
                {!props.collapsed ? (
                    <img src="/images/logo/logo.webp" alt="logo" height={30} />
                ) : (
                    <img src="/kplace.svg" alt="logo" height={30} />
                )}
            </div>
            <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" items={items} />
        </Wrapper>
    );
};

const Wrapper = styled(Sider)``;

export default Sidebar;
