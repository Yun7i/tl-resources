import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import AppThemeProvider from './providers/ThemeProvider';

function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppThemeProvider>
  );
}

export default App;
