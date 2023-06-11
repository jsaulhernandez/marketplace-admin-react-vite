import 'moment/dist/locale/es';
import './index.css';

import { ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

moment.locale('es');
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider locale={es_ES}>
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
