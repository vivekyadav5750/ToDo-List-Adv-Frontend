import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setPage } from "@/redux/reducers/todoSlice";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

function Pagination() {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages } = useAppSelector(
    (state) => state.todos.pagination
  )

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-b">
      <button
        onClick={() => dispatch(setPage(currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 text-primary hover:bg-light-gray px-4 py-2 rounded disabled:text-secondary disabled:cursor-not-allowed"
      >
        <GrFormPrevious size={22}/>Previous
      </button>
      <div className="font-medium">
        <span>{currentPage}</span> / <span>{totalPages}</span>
      </div>
      <button
        onClick={() => dispatch(setPage(currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 text-primary hover:bg-light-gray px-4 py-2 rounded disabled:text-secondary disabled:cursor-not-allowed"
      >
        Next<GrFormNext size={22} />
      </button>
    </div>
  );
}

export default Pagination;