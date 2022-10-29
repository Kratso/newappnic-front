import { CssBaseline } from '@mui/material';
import { useState } from 'react';

import UnloggedApp from './UnloggedApp';

function App() {
  const [isLogged, toggleIsLogged] = useState(false);

  return (
    <>
      <CssBaseline />
      {
        isLogged ? <div></div> :       <UnloggedApp />
      }
    </>
  );
}

export default App;
