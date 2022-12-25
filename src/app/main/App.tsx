import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Dashboard from "../../features/landing/Dashboard";
import userService from "../../services/user.service";
import {
  selectAccessToken,
  selectIsLogged,
  setUser,
} from "../../slices/login.slice";
import { useAppSelector } from "../../store/hooks";
import { AppDispatch } from "../../store/store";

import UnloggedApp from "./UnloggedApp";

function App() {
  const isLogged = useAppSelector((state) => selectIsLogged(state));
  const access_token = useAppSelector((state) => selectAccessToken(state));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkUser = async (access_token: string) => {
      if (!isLogged && access_token) {
        const checkedUser = await userService.checkUser(access_token);
        dispatch(setUser(checkedUser));
      }
    };
    checkUser(access_token ?? "");
  }, [isLogged]);

  return (
    <>
      <CssBaseline />
      {isLogged ? <Dashboard /> : <UnloggedApp />}
    </>
  );
}

export default App;
