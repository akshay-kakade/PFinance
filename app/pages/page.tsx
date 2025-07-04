'use client'

import { useState } from "react";

interface TodoItem {
  id: string;
  name: string;
  completed: boolean;
}

export default function Home() {
  const [items, setItems] = useState("");
  const [todo, setTodo] = useState<TodoItem[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.trim() === "") return;

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      name: items.trim(),
      completed: false,
    };

    setTodo((currentTodo) => [...currentTodo, newItem]);
    setItems(""); // clear input
  }

  function handleDelete(id: string) {
    setTodo((currentTodo) => currentTodo.filter((item) => item.id !== id));
  }

  function toggleComplete(id: string) {
    setTodo((currentTodo) =>
      currentTodo.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Todo List 📝</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            id="item"
            value={items}
            placeholder="Add a new task..."
            className="border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setItems(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Item
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Items</h2>
          {todo.length === 0 ? (
            <p className="text-gray-500 text-sm">No items yet, add one above!</p>
          ) : (
            <ul className="space-y-3">
              {todo.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 border rounded-lg p-3 hover:shadow-sm transition"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(item.id)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className={`text-gray-800 ${item.completed ? "line-through opacity-50" : ""}`}>
                      {item.name}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
