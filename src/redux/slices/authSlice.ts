import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    username: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
}

const getStoredUser = () => {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const stored = localStorage.getItem("user");
        if (!stored || stored === "undefined") {
            return null;
        }
        return JSON.parse(stored);
    } catch (error) {
        return null;
    }

}


const initialState: AuthState = {
    user: getStoredUser()
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout(state) {
            state.user = null;
            localStorage.removeItem("user");
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;