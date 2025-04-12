import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

const initialState = {
  currentUser: null as User | null,
  users: [] as User[]
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("http://localhost:5000/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  return data as User[];
});

const mainSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add any async actions here if needed
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.currentUser = action.payload[0];
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      console.error("Failed to fetch users:", action.error.message);
    });
  }
});

export const { setCurrentUser, setUsers } = mainSlice.actions;
export const userReducer = mainSlice.reducer;
