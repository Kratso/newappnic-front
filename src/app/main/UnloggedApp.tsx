import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '../../features/forgotPassword/ForgotPassword';
import LoginPage from '../../features/login/Login';
import NewPasswordPage from '../../features/newPassword/NewPassword';
import SignupPage from '../../features/signup/Signup';

function UnloggedApp() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='*' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='forgot-password/' element={<ForgotPassword />} />
        <Route path='reset-password/:email/:token' element={<NewPasswordPage />} />
      </Routes>
    </>
  );
}

export default UnloggedApp;
