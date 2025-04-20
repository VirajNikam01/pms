"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Trash2 } from "lucide-react";

const TaskList = () => {
  // Initialize tasks from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Handle toggling task completion
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle deleting a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Animation variants for task cards
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  // Animation variants for the add button
  const buttonVariants = {
    idle: { scale: 1 },
    pulse: {
      scale: 1.1,
      transition: { repeat: Infinity, duration: 0.8, repeatType: "reverse" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Task Manager
        </h1>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New task input"
          />
          <motion.button
            type="submit"
            variants={buttonVariants}
            initial="idle"
            animate="pulse"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
            disabled={!newTask.trim()}
            aria-label="Add task"
          >
            <Plus size={24} />
          </motion.button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  task.completed ? "bg-green-900" : "bg-gray-700"
                } border ${
                  task.completed ? "border-green-700" : "border-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleToggleComplete(task.id)}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-300"
                    aria-label={`Mark task ${task.text} as ${
                      task.completed ? "incomplete" : "complete"
                    }`}
                  >
                    <CheckCircle
                      size={24}
                      className={
                        task.completed ? "text-green-400" : "text-gray-500"
                      }
                    />
                  </motion.button>
                  <span
                    className={`${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <motion.button
                  onClick={() => handleDeleteTask(task.id)}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-400 hover:text-red-500"
                  aria-label={`Delete task ${task.text}`}
                >
                  <Trash2 size={24} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <p className="text-center text-gray-400">
              No tasks yet. Add one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
