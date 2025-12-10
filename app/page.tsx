'use client'; 

import { useState, useEffect } from 'react';
// 
import { supabase } from '@/lib/supabase'; 

// 
interface Task {
  id: string;
  title: string;
  // 🚨 CLAVE: 'is_complete' -> 'is_completed'
  is_completed: boolean; 
  inserted_at: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  // 
  const userEmail = 'demo@enrique.com'; 

  // --- Logic Functions ---

  // Read Tasks (READ)
  async function fetchTasks() {
    // Select all columns from the 'tasks' table and order them
    const { data, error } = await supabase
      .from('tasks') // 🚨 CLAVE: Usaremos 'todos' para consistencia con la API (o tu nombre de tabla)
      .select('*')
      .order('inserted_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      setTasks(data || []);
    }
  }

  // Execute task reading once the component mounts
  useEffect(() => {
    fetchTasks();
  }, []); 

  // Add Task (CREATE)
  async function addTask() {
    if (!newTaskTitle.trim()) return;

    // Insert the new task into Supabase
    const { error } = await supabase
      .from('tasks') // 
      .insert([{ title: newTaskTitle.trim(), user_email: userEmail }]);

    if (error) {
      console.error('Error adding task:', error.message);
    } else {
      setNewTaskTitle('');
      fetchTasks(); // Reload list
    }
  }

  // Mark as Complete (UPDATE)
  async function toggleComplete(taskId: string, currentState: boolean) {
    // Update the 'is_completed' field to the opposite state
    const { error } = await supabase
      .from('tasks') // 
      .update({ is_completed: !currentState }) // 🚨 CLAVE: 'is_completed'
      .eq('id', taskId); 

    if (error) {
      console.error('Error updating task:', error.message);
    } else {
      fetchTasks(); // Reload list
    }
  }
  
  // --- UI Rendering ---

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">📋 Todo List</h1>

      {/* Form to Add Task */}
      <div className="flex mb-8 bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Write the task and click Add..."
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addTask} className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 transition duration-150 font-semibold">
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center p-4 rounded-lg shadow-sm transition duration-150 ${
                task.is_completed ? 'bg-green-100 text-gray-500' : 'bg-white' // 🚨 CLAVE: 'is_completed'
            }`}
          >
            <span
              style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }} // 🚨 CLAVE: 'is_completed'
              className="flex-grow text-lg font-medium"
            >
              {task.title}
            </span>
            <div>
              <button
                onClick={() => toggleComplete(task.id, task.is_completed)} // 🚨 CLAVE: 'is_completed'
                className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full transition duration-150 ${
                  task.is_completed ? 'bg-gray-400 hover:bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white`}
              >
                {task.is_completed ? 'Undo' : 'Complete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}