import { useState } from "react";
import EditTodoModal from "./EditTodoModal";
import NoteModal from "./NoteModal";
import { Todo } from "../types/index";
import { useAppDispatch } from "../redux/hook";
import { deleteTodo, updateTodo } from "../redux/reducers/todoSlice";
import { FaEdit, FaStickyNote } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function TodoItem({ key, todo }: { key: string; todo: Todo }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      dispatch(deleteTodo(todo._id));
    }
  };

  const handleToggleComplete = () => {
    dispatch(
      updateTodo({ id: todo._id, todoData: { completed: !todo.completed } })
    );
  };

  return (
    <>
      <div
        className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-4"
      >
        <div className="flex items-center mr-4">
          <div className="relative">
            <input
              type="checkbox"
              id={`todo-${todo._id}`}
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all duration-200 hover:border-green-500 checked:border-green-500 checked:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1" onClick={() => setIsDetailsOpen(true)}>
          <h3 className={`text-lg font-medium ${todo.completed ? ' text-gray-400' : 'text-gray-800'}`}>{todo.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${todo.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : todo.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
            >
              {todo.priority}
            </span>
            <div className="flex flex-wrap gap-2">
              {todo.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {todo.assignedUsers?.map((user) => (
                <span
                  key={key}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  @{user.username}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-blue-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 transition-all duration-200"
            title="Add note"
            onClick={(e) => {
              e.stopPropagation();
              setIsNoteModalOpen(true);
            }}
          >
            <FaStickyNote />
          </button>
          <button
            className="text-gray-500 hover:text-yellow-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-50 transition-all duration-200"
            title="Edit todo"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-all duration-200"
            title="Delete todo"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <MdDelete />
          </button>
        </div>
      </div>
      {isEditModalOpen && (
        <EditTodoModal
          todo={todo}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isNoteModalOpen && (
        <NoteModal
          todoId={todo._id}
          onClose={() => setIsNoteModalOpen(false)}
        />
      )}
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{todo.title}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-700">{todo.description || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${todo.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : todo.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {todo.priority}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Users</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {todo.assignedUsers?.map((user) => (
                    <span
                      key={user._id}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      @{user.username}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                {todo.notes.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {todo.notes.map((note, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-gray-500">No notes</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TodoItem;
