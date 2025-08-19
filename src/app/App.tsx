import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppRoutes } from './routes';

import { store } from '@/app/store/store';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
