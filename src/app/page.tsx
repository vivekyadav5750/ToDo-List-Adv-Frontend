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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentUser ? (
        <>
          <header className="bg-white shadow-lg py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={handleExport}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                disabled={status === "loading"}
              >
                <FaFileExport className="mr-2" />
                Export
              </button>
              <UserSwitcher currentUser={currentUser} />
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Image
                  src="/placeholder-avatar.png"
                  alt={currentUser.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-gray-700 font-medium">{currentUser.name}</span>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-64 bg-white rounded-lg shadow-lg p-4">
                <Filters />
              </aside>
              <section className="flex-1">
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 w-full md:w-auto justify-center"
                    disabled={status === "loading"}
                  >
                    <FaPlus /> Add Todo
                  </button>
                  <div className="flex w-full md:w-1/2">
                    <input
                      type="text"
                      placeholder="Search todos..."
                      className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.search}
                      onChange={(e) => {
                        dispatch(setFilters({ search: e.target.value }))
                        dispatch(fetchTodos())
                      }}
                    />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg transition-all duration-200">
                      <FaSearch />
                    </button>
                  </div>
                </div>
                {status === "loading" && (
                  <div className="text-center text-gray-600">Loading...</div>
                )}
                {status === "failed" && (
                  <div className="text-center text-red-500">{error}</div>
                )}
                <TodoList />
              </section>
            </div>
          </main>
          {isAddModalOpen && (
            <AddTodoModal onClose={() => setIsAddModalOpen(false)} />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}
    </div>
  )
}
