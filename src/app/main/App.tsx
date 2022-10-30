import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import Dashboard from '../../features/landing/Dashboard';
import { selectUser, UserState } from '../../slices/login.slice';
import { useAppSelector } from '../../store/hooks';

import UnloggedApp from './UnloggedApp';

function App() {
  const [isLogged, toggleIsLogged] = useState(false);

  const user: UserState = useAppSelector<UserState>((state)=>selectUser(state));


  useEffect(()=>{
    if(user.status.status === 'OK') {
      toggleIsLogged(true);
    } else {
      toggleIsLogged(false);
    }
  }, [user])

  console.log(user)

  return (
    <>
      <CssBaseline />
      {
        isLogged ? <Dashboard/> :       <UnloggedApp />
      }
    </>
  );
}

export default App;
