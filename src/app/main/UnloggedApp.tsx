import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../../features/login/Login';
import SignupPage from '../../features/signup/Signup';

function UnloggedApp() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='*' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default UnloggedApp;
