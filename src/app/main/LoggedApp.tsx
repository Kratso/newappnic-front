import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../../features/login/Login';

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
