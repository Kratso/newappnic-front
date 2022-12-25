import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store/store";

import userService from "../services/user.service";
import { User } from "./login.slice";

export interface UsersStatus {
    status: "idle" | "loading" | "OK" | "KO";
    error: string | null | undefined;
}

export interface UsersState {
    status: UsersStatus;
    users: User[]|null;
}

const initialState: UsersState = {
    status: {
        status: "idle",
        error: null,
    },
    users: null,
};

const usersData = createSlice({
    name: "usersData",
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            getAllUsersMiddle.fulfilled,
            (state, action) => {
                state.status.status = "OK";
                state.users = action.payload;
            }
        );
        builder.addCase(
            getAllUsersMiddle.rejected,
            (state, action) => {
                state.status.status = "KO";
                state.status.error = action.error.message;
            }
        );
        builder.addCase(
            getAllUsersMiddle.pending,
            (state, action) => {
                state.status.status = "loading";
            }
        );
    }
});

export const { setUsers } = usersData.actions;

export const selectUsers = (state: RootState) => state.usersData.users;

export default usersData.reducer;

export const getAllUsersMiddle = createAsyncThunk<User[], string, { rejectValue: UsersStatus }>("usersData/getAllUsers", async (access_token) => {
    return (await userService.getAllUsers(access_token)) as User[];
}) 