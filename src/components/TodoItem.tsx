import { useState } from "react";
import EditTodoModal from "./EditTodoModal";
import NoteModal from "./NoteModal";
import { Todo } from "../types/index";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { deleteTodo, updateTodo } from "../redux/reducers/todoSlice";
import { FaEdit, FaStickyNote } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function TodoItem({ key, todo }: { key: string; todo: Todo }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { filters } = useAppSelector((state) => state.todos);
  console.log("filters", filters);

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
        className="flex items-start p-4 bg-white border-b border-medium-gray hover:bg-light-gray transition cursor-pointer"
      >
        <div className="todo-checkbox mr-4">
          <input
            type="checkbox"
            id={`todo-${todo._id}`}
            checked={todo.completed}
            onChange={handleToggleComplete}
          />
          <label htmlFor={`todo-${todo._id}`}></label>
        </div>
        <div className="flex-1" onClick={() => setIsDetailsOpen(true)}>
          <h3 className="text-lg font-medium">{todo.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`px-2 py-1 rounded ${todo.priority === "high"
                ? "bg-red-100 text-danger"
                : todo.priority === "medium"
                  ? "bg-yellow-100 text-warning"
                  : "bg-green-100 text-success"
                }`}
            >
              {todo.priority}
            </span>
            <div className="flex flex-wrap gap-2">
              {todo.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-300 text-gray-800 px-2 py-1 rounded text-xs "
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {todo.assignedUsers?.map((user) => (
                <span
                  key={key}
                  className="bg-light-gray text-dark-gray px-2 py-1 rounded text-xs"
                >
                  @{user.username}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-secondary hover:text-primary w-8 h-8 flex items-center justify-center rounded-full hover:bg-medium-gray"
            title="Add note"
            onClick={(e) => {
              e.stopPropagation();
              setIsNoteModalOpen(true);
            }}
          >
            <FaStickyNote />
          </button>
          <button
            className="text-secondary hover:text-warning w-8 h-8 flex items-center justify-center rounded-full hover:bg-medium-gray"
            title="Edit todo"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="text-secondary hover:text-danger w-8 h-8 flex items-center justify-center rounded-full hover:bg-medium-gray"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{todo.title}</h2>
            <p className="mb-2">
              <strong>Description:</strong> {todo.description || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Priority:</strong> {todo.priority}
            </p>
            <p className="mb-2">
              <strong>Tags:</strong> {todo.tags.join(", ") || "None"}
            </p>
            <p className="mb-2">
              <strong>Assigned Users:</strong>{" "}
              {/* {todo.assignedUsers?.join(", ") || "None"} */}
              {todo.assignedUsers?.map((user) => (
                <span
                  key={user._id}
                  className="bg-light-gray text-dark-gray px-2 py-1 rounded text-xs"
                >
                  {user.username}
                </span>
              ))}
            </p>
            <div className="mb-4">
              <strong>Notes:</strong>
              {todo.notes.length > 0 ? (
                <ul className="list-disc pl-5">
                  {todo.notes.map((note, index) => (
                    <li key={index}>
                      {note.content}{" "}
                      <em>({new Date(note.createdAt).toLocaleDateString()})</em>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notes</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-secondary text-gray-800 px-4 py-2 rounded hover:bg-gray-600"
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
