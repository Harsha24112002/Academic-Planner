import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userRole: null,
        isSignedIn: false,
    },
    reducers: {
        updaterole: (state, action) => {
            state.userRole = action.payload.role;
        },
        signin: (state, action) => {
            state.isSignedIn = true;
        },
        signout: (state) => {
            state.userRole = null;
            state.isSignedIn = false;
        },
    },
});

export const { updaterole, signin, signout } = authSlice.actions;

export const selectUserRole = (state) => state.auth.userRole;
export const selectIsSignedIn = (state) => state.auth.isSignedIn;

export default authSlice.reducer;