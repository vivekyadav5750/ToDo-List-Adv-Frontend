
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
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <div>
        <h4 className="text-sm font-medium mb-2">Priority</h4>
        <div className="flex flex-col gap-2">
          {["high", "medium", "low"].map((priority) => (
            <label
              key={priority}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={priority}
                checked={filters.priority.includes(priority)}
                onChange={() => handlePriorityChange(priority)}
              />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Tags</h4>
        <div className="flex flex-col gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={tag}
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))
          ) : (
            <p className="text-sm text-dark-gray">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters;
