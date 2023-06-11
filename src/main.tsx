import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';

import moment from 'moment';
import 'moment/dist/locale/es';

import App from './App.tsx';
import './index.css';

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
