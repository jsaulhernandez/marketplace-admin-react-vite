import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header } = Layout;

export interface MainHeaderProps {
    collapsed: boolean;
}

const MainHeader: FC<MainHeaderProps> = (props) => {
    return (
        <Wrapper
            style={{
                marginLeft: `${props.collapsed ? '50px' : '272px'}`,
                width: `${props.collapsed ? 'calc(100% - 50px)' : 'calc(100% - 272px)'}`,
            }}
        >
            <Menu mode="horizontal" style={{ float: 'right' }}>
                <div className="user-name">Saul</div>
                <Menu.Item>
                    <Link to="/">
                        Cerrar Sesi&oacute;n <LoginOutlined />
                    </Link>
                </Menu.Item>
            </Menu>
        </Wrapper>
    );
};

const Wrapper = styled(Header)`
    height: 67px;
    background-color: var(--secondary-color);
    border: 2px solid var(--quaternary-color);
    position: fixed;
    transition: all 0.2s, background 0s;
    -webkit-transition: all 0.2s, background 0s;
    -moz-transition: all 0.2s, background 0s;
    -o-transition: all 0.2s, background 0s;
    -ms-transition: all 0.2s, background 0s;
    z-index: 3;
`;

export default MainHeader;
