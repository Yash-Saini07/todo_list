"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, Trash2 } from "lucide-react";

const TodoItem = memo(({ todo, isCompleted, id, toggleComplete, deleteTodo, editTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo);
    const inputRef = useRef(null);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim() !== "") {
            editTodo(id, editValue);
        } else {
            setEditValue(todo); // Revert if empty
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setEditValue(todo);
            setIsEditing(false);
        }
    };

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isEditing ? 1.05 : 1,
                zIndex: isEditing ? 50 : 1
            }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.3, ease: "anticipate" } }}
            whileHover={{ scale: isEditing ? 1.05 : 1.02 }}
            className={`group relative flex items-center justify-between w-full p-4 mb-3 rounded-2xl backdrop-blur-xl border shadow-sm transition-[background-color,border-color,box-shadow] duration-300
                ${isEditing
                    ? "bg-white/80 dark:bg-black/80 border-blue-500/50 shadow-2xl ring-2 ring-blue-500/20"
                    : "bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 hover:shadow-xl hover:bg-white/60 dark:hover:bg-black/60"
                }`}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleComplete(id)}
                        className="peer w-6 h-6 border-[3px] border-gray-300 dark:border-gray-600 rounded-full checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer appearance-none bg-white/10 backdrop-blur-sm"
                    />
                    <Check
                        size={14}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    />
                </div>

                {isEditing ? (
                    <textarea
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { // Allow Shift+Enter for new line
                                e.preventDefault();
                                handleSave();
                            } else if (e.key === "Escape") {
                                setEditValue(todo);
                                setIsEditing(false);
                            }
                        }}
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        className="flex-1 bg-transparent border-b-2 border-blue-500 focus:outline-none text-lg font-medium text-gray-800 dark:text-gray-100 px-1 py-0.5 resize-none overflow-hidden min-h-[1.75rem]"
                        style={{ height: 'auto' }}
                    />
                ) : (
                    <span
                        onClick={() => setIsEditing(true)}
                        className={`flex-1 text-lg font-medium text-gray-800 dark:text-gray-100 truncate cursor-text transition-all duration-300 select-none ${isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""
                            }`}
                    >
                        {todo}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Edit"
                >
                    <Pencil size={20} />
                </button>
                <div
                    className="scale-90 hover:scale-100 transition-transform cursor-pointer"
                    onClick={() => deleteTodo(id)}
                >
                    <Trash2 size={20} className="text-red-500 hover:text-red-700 transition-colors" />
                </div>
            </div>
        </motion.li>
    );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
