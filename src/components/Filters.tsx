import { useAppDispatch, useAppSelector } from "../redux/hook";
import { fetchTodos, setFilters } from "../redux/reducers/todoSlice";

function Filters() {
  const dispatch = useAppDispatch();
  const { tags, filters } = useAppSelector((state) => state.todos);

  const handlePriorityChange = (value: string) => {
    const updatedPriorities = filters.priority.includes(value)
      ? filters.priority.filter((p) => p !== value)
      : [...filters.priority, value];
    dispatch(setFilters({ priority: updatedPriorities }));
    dispatch(fetchTodos())
  };

  const handleTagChange = (value: string) => {
    const updatedTags = filters.tags.includes(value)
      ? filters.tags.filter((t) => t !== value)
      : [...filters.tags, value];
    dispatch(setFilters({ tags: updatedTags }));
    dispatch(fetchTodos())
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-gray-800">Filters</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Priority</h4>
          <div className="space-y-2">
            {["high", "medium", "low"].map((priority) => (
              <label
                key={priority}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={priority}
                  checked={filters.priority.includes(priority)}
                  onChange={() => handlePriorityChange(priority)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm font-medium ${
                  priority === "high"
                    ? "text-red-600 group-hover:text-red-700"
                    : priority === "medium"
                      ? "text-yellow-600 group-hover:text-yellow-700"
                      : "text-green-600 group-hover:text-green-700"
                }`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
          <div className="space-y-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={tag}
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    {tag}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tags available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
