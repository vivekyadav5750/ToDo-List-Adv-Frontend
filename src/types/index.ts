export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  content: string;
  createdAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  userId: string;
  tags: string[];
  assignedUsers?: User[];
  notes: Note[];
  createdAt?: string;
  updatedAt?: string;
}
export interface Filters {
  priority: string[];
  tags: string[];
  search: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
}

// export interface CreateTodoData {
//   title: string;
//   description?: string;
//   priority: "low" | "medium" | "high";
//   tags: string[];
//   assignedUsers: string[];
//   userId: string;
// }

// export interface UpdateTodoData {
//   id: string;
//   todoData: Partial<Todo>;
// }

// export interface AddNoteData {
//   todoId: string;
//   content: string;
// }
