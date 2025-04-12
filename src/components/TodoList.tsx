import TodoItem from "./TodoItem";
import Pagination from "./Pagination";
import { useAppSelector } from "../redux/hook";

function TodoList() {
  const { todos } = useAppSelector((state) => state.todos);

  return (
    <div className="bg-white rounded shadow-custom">
      {todos.length === 0 ? (
        <div className="p-4 text-center text-dark-gray">
          No todos found. Add a new one!
        </div>
      ) : (
        todos.map((todo) => <TodoItem key={todo._id} todo={todo} />)
      )}
      <Pagination/>
    </div>
  );
}

export default TodoList;
