import { useState } from "react";
import { useAppDispatch } from "../redux/hook";
import { addNote } from "../redux/reducers/todoSlice";

interface NoteModalProps {
  todoId: string;
  onClose: () => void;
}

function NoteModal({ todoId, onClose }: NoteModalProps) {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addNote({ todoId, content: note }));
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              className="w-full p-2 border border-medium-gray rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-200">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200" >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;
