import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Filters, Pagination } from "../../types";
import { RootState } from "../store";

export interface TodoState {
  todos: Todo[];
  tags: string[];
  filters: Filters;
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const API_URL = "http://localhost:5000/api/todos";

// Fetch todos with pagination, filtering, and search
export const fetchTodos = createAsyncThunk<
  { todos: Todo[]; totalPages: number },
  void,
  { state: RootState }
>("todos/fetchTodos", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { currentUser } = state.users;
    const { filters, pagination } = state.todos;
    const userId = currentUser?._id || "";
    const page = pagination.currentPage || 1;

    const response = await fetch(
      `${API_URL}?userId=${userId}&page=${page}&priority=${filters.priority.join()}&tags=${filters.tags.join()}&search=${
        filters.search
      }`
    );
    if (!response.ok) {
      const { message } = await response.json();
      return rejectWithValue(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to fetch todos");
  }
});

// Fetch unique tags for a user
export const fetchTags = createAsyncThunk<
  string[],
  string,
  { rejectValue: string }
>("todos/fetchTags", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/tags?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to fetch tags");
  }
});

// Create a new todo
export const createTodo = createAsyncThunk<
  Todo,
  { todoData: Partial<Todo> },
  { rejectValue: string }
>("todos/createTodo", async ({ todoData }, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todoData)
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    const data = await response.json();
    console.log("Created todo:", data);
    return data.todo;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to create todo");
  }
});

// Update an existing todo
export const updateTodo = createAsyncThunk<
  Todo,
  { id: string; todoData: Partial<Todo> },
  { rejectValue: string }
>("todos/updateTodo", async ({ id, todoData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todoData)
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to update todo");
  }
});

// Delete a todo
export const deleteTodo = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("todos/deleteTodo", async (id, { rejectWithValue }) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to delete todo");
  }
});

// Add a note to a todo
export const addNote = createAsyncThunk<
  Todo,
  { todoId: string; content: string },
  { rejectValue: string }
>("todos/addNote", async ({ todoId, content }, { rejectWithValue }) => {
  try {
    console.log(
      "Adding note to todo with ID:",
      todoId,
      "and content:",
      content
    );
    const response = await fetch(`${API_URL}/${todoId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      throw new Error("Failed to add note");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message || "Failed to add note");
  }
});

// Export todos as CSV
export const exportTodos = createAsyncThunk<
  Blob,
  string,
  { rejectValue: string }
>("todos/exportTodos", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/export?userId=${userId}`, {
      method: "GET",
      headers: {
        Accept: "text/csv"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to export todos");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || "Failed to export todos"
    );
  }
});

// Initial State
const initialState: TodoState = {
  todos: [],
  tags: [],
  filters: {
    priority: [],
    tags: [],
    search: ""
  },
  pagination: {
    currentPage: 1,
    totalPages: 1
  },
  status: "idle",
  error: null
};

// Todo Slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to page 1 on filter change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTags: (state) => {
      state.filters.tags = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload.todos;
        state.pagination.totalPages = action.payload.totalPages;
      });
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tags = action.payload;
      });
    builder
      .addCase(createTodo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = [action.payload, ...state.todos];
        state.tags = Array.from(
          new Set([...state.tags, ...action.payload.tags])
        );
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
    builder
      .addCase(updateTodo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.tags = Array.from(
          new Set([...state.tags, ...action.payload.tags])
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });

    // Delete Todo
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });

    // Add Note
    builder
      .addCase(addNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(addNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });

    // // Export Todos
    // builder
    //   .addCase(exportTodos.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(exportTodos.fulfilled, (state) => {
    //     state.status = "succeeded";
    //   })
    //   .addCase(exportTodos.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.payload || "Unknown error";
    //   });
  }
});

// Export actions
export const { setFilters, setPage, clearError, resetTags } = todoSlice.actions;

// Export selectors
export const selectTodos = (state: { todos: TodoState }) => state.todos.todos;
export const todoReducer = todoSlice.reducer;
