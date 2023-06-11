import { useRoutes } from 'react-router-dom';

import { Routes } from './routes';

const App = () => {
    const routes = useRoutes(Routes);
    return routes;
};

export default App;
