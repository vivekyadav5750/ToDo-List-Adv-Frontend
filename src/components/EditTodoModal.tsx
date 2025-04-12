import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { Todo, User } from '../types';
import { updateTodo } from '../redux/reducers/todoSlice';

interface EditTodoModalProps {
  todo: Todo;
  onClose: () => void;
}

function EditTodoModal({ todo, onClose }: EditTodoModalProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [formData, setFormData] = useState<Todo>({
    ...todo,
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateTodo({ id: todo._id, todoData: formData }));
    onClose();
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const addUser = () => {
    if (!selectedUser) return; // No user selected
    console.log("Adding user:", selectedUser);

    if (!formData.assignedUsers?.some((user) => user._id === selectedUser._id)) {
      setFormData({
        ...formData,
        assignedUsers: [...(formData.assignedUsers || []), selectedUser],
      });
      setSelectedUser(null); // Reset selected user after adding
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
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
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border border-medium-gray rounded"
              value={formData.description || ''}
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
                  priority: e.target.value as 'low' | 'medium' | 'high',
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
                className="bg-primary text-gray-800 px-4 py-2 rounded hover:bg-primary-dark"
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
            <label className="block text-sm font-medium mb-1">Assign Users</label>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border border-medium-gray rounded"
                value={selectedUser?._id || ''}
                onChange={(e) => {
                  const user = users.find((u: User) => u._id === e.target.value);
                  setSelectedUser(user || null);
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
                className="bg-primary text-gray-800 px-4 py-2 rounded hover:bg-primary-dark"
                disabled={!selectedUser}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.assignedUsers?.map((user) => {
                return user ? (
                  <span
                    key={user._id}
                    className="bg-light-gray text-dark-gray px-2 py-1 rounded text-sm"
                  >
                    @{user.username}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-secondary text-gray-800 px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-gray-800 px-4 py-2 rounded hover:bg-primary-dark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTodoModal;