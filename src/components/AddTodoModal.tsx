import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { createTodo } from "../redux/reducers/todoSlice";
import { User } from "../types";

interface AddTodoModalProps {
  onClose: () => void;
}

function AddTodoModal({ onClose }: AddTodoModalProps) {
  const dispatch = useAppDispatch();
  const { users, currentUser } = useAppSelector((state) => (state.users));
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    tags: [] as string[],
    assignedUsers: [] as User[]
  });
  const [tagInput, setTagInput] = useState("");
  const [userInput, setUserInput] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const assignedUsers = formData.assignedUsers;
      dispatch(createTodo({ todoData: { ...formData, userId: currentUser._id, assignedUsers } }));
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const addUser = () => {
    if (!userInput) return; // No user selected

    if (
      !formData.assignedUsers.some((user) => user._id === userInput._id)
    ) {
      setFormData({
        ...formData,
        assignedUsers: [...(formData.assignedUsers || []), userInput]
      });
      setUserInput(null); // Reset selected user after adding
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-medium-gray rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-medium-gray rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full p-2 border border-medium-gray rounded"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "low" | "medium" | "high"
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border border-medium-gray rounded"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-light text-gray-800 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Assign Users
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border border-medium-gray rounded"
                value={userInput?._id || ''}
                onChange={(e) => {
                  const user = users.find((u: User) => u._id === e.target.value);
                  setUserInput(user || null);
                }}
              >
                <option value="">Select a user</option>
                {users.map((user: User) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addUser}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                disabled={!userInput}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.assignedUsers.map((user) => {
                return (
                  <span
                    key={user._id}
                    className="bg-light-gray text-dark-gray px-2 py-1 rounded text-sm"
                  >
                    @{user?.username}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTodoModal;
