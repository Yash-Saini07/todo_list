"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import TodoItem from "../components/TodoItem";
import InteractiveBackground from "../components/InteractiveBackground";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef(null);

  // Load todos on mount
  useEffect(() => {
    const storedItems = localStorage.getItem("my-todo-list");
    if (storedItems) {
      setTodos(JSON.parse(storedItems));
    }
    setIsLoaded(true);
  }, []);

  // Save todos on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("my-todo-list", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const handleAddTodo = useCallback(() => {
    const newTodo = inputRef.current.value.trim();
    if (newTodo !== "") {
      const newItem = { todo: newTodo, isCompleted: false, id: Date.now() };
      setTodos((prev) => [...prev, newItem]);
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const editTodo = useCallback((id, newText) => {
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, todo: newText } : item))
    );
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-2 md:p-4">
      <InteractiveBackground />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-3xl h-[85vh] flex flex-col bg-white/15 dark:bg-black/20 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/5 p-5 md:p-12 overflow-hidden"
      >
        {/* Header */}
        {/* Header */}
        <div className="mb-10 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 mb-2"
          >
            <div className="p-3 bg-white/10 dark:bg-white/5 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 animate-gradient-text flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 animate-gradient-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Tasks
              </span>
            </h1>
          </motion.div>

          <p className="text-lg font-medium tracking-wide animate-text-cycle font-semibold drop-shadow-sm">
            Design your day.
          </p>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 p-1 md:p-2 mb-8 bg-white/30 dark:bg-white/5 rounded-full border border-gray-200 dark:border-gray-700/50 shadow-inner focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent px-4 py-3 text-base md:text-lg outline-none text-gray-800 dark:text-gray-100 placeholder-animate min-w-0 font-medium"
          />
          <button
            onClick={handleAddTodo}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
            aria-label="Add Task"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 min-h-0 scrollbar-hide">
          <AnimatePresence mode="popLayout" initial={false}>
            {todos.length === 0 && isLoaded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center opacity-60"
              >
                <div className="text-6xl mb-4">✨</div>
                <p className="text-lg text-gray-500 dark:text-gray-400">No tasks yet. Enjoy your day!</p>
              </motion.div>
            ) : (
              todos.map((item) => (
                <TodoItem
                  key={item.id}
                  {...item}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                />
              ))
            )}
          </AnimatePresence>
        </ul>
      </motion.div>
    </main>
  );
}
