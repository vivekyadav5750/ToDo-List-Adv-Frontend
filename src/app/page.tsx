"use client"
import AddTodoModal from "@/components/AddTodoModal";
import Filters from "@/components/Filters";
import TodoList from "@/components/TodoList";
import UserSwitcher from "@/components/UserSwitcher";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { exportTodos, fetchTags, fetchTodos, setFilters } from "@/redux/reducers/todoSlice";
import { fetchUsers } from "@/redux/reducers/userSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaFileExport, FaPlus, FaSearch } from "react-icons/fa";

export default function Home() {
  const { currentUser } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const { pagination, status, error, filters } = useAppSelector((state) => state.todos);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    console.log("calling fetchUsers");
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(
        fetchTodos()
      );
      dispatch(fetchTags(currentUser._id));
    }
  }, [currentUser, pagination.currentPage, dispatch]);

  const handleExport = () => {
    dispatch(exportTodos(currentUser!._id)).then((result) => {
      if (exportTodos.fulfilled.match(result)) {
        const url = window.URL.createObjectURL(new Blob([result.payload]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "todos.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  };

  return (
    <div className="container   bg-gray-200">
      {currentUser ? (
        <>
          <header className="bg-white shadow-custom py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Todo List</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="bg-secondary px-4 py-2 text-gray-800 rounded flex items-center  bg-gray-500 hover:bg-gray-600 transition"
                disabled={status === "loading"}
              >
                <FaFileExport className="mr-2" />
                Export
              </button>
              <UserSwitcher currentUser={currentUser} />
              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder-avatar.png"
                  alt={currentUser.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {currentUser.name}
              </div>
            </div>
          </header>
          <main className="flex gap-6 mt-6">
            <aside className="w-64 bg-white rounded shadow-custom p-4">
              <Filters />
            </aside>
            <section className="flex-1">
              <div className="mb-4 flex justify-between items-center">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-dark transition"
                  disabled={status === "loading"}
                >
                  <FaPlus /> Add Todo
                </button>
                <div className="flex w-1/2">
                  <input
                    type="text"
                    placeholder="Search todos..."
                    className="flex-1 p-2 border border-medium-gray rounded-l focus:outline-none"
                    value={filters.search}
                    onChange={(e) => {
                      dispatch(setFilters({ search: e.target.value }))
                      dispatch(fetchTodos())
                    }
                    }
                  />
                  <button className="bg-primary text-gray-800 p-2 rounded-r">
                    <FaSearch />
                  </button>
                </div>
              </div>
              {status === "loading" && (
                <div className="text-center">Loading...</div>
              )}
              {status === "failed" && (
                <div className="text-center text-danger">{error}</div>
              )}
              <TodoList />
            </section>
          </main>
          {isAddModalOpen && (
            <AddTodoModal onClose={() => setIsAddModalOpen(false)} />
          )}

        </>)
        :
        (<div>
          Loading ...
        </div>)
      }
    </div >
  )
}
