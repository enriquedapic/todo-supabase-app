'use client'; // Necesario si usas App Router

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Importa la conexión a Supabase

// Definimos la interfaz de la tarea para tipado (TypeScript)
interface Task {
  id: string;
  title: string;
  is_complete: boolean;
  inserted_at: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  // Usamos un email fijo como identificador simple
  const userEmail = 'demo@enrique.com'; 

  // --- Funciones de Lógica ---

  // Leer Tareas (READ)
  async function fetchTasks() {
    // Selecciona todas las columnas de la tabla 'tasks' y las ordena
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('inserted_at', { ascending: false });

    if (error) {
      console.error('Error al cargar las tareas:', error.message);
    } else {
      setTasks(data || []);
    }
  }

  // Ejecuta la lectura de tareas una vez que el componente se monta
  useEffect(() => {
    fetchTasks();
  }, []); // El array vacío asegura que solo se ejecuta al inicio

  // Añadir Tarea (CREATE)
  async function addTask() {
    if (!newTaskTitle.trim()) return;

    // Inserta la nueva tarea en Supabase
    const { error } = await supabase
      .from('tasks')
      .insert([{ title: newTaskTitle.trim(), user_email: userEmail }]);

    if (error) {
      console.error('Error al añadir la tarea:', error.message);
    } else {
      setNewTaskTitle('');
      fetchTasks(); // Recarga la lista para mostrar la nueva tarea
    }
  }

  // Marcar como Completa (UPDATE)
  async function toggleComplete(taskId: string, currentState: boolean) {
    // Actualiza el campo 'is_complete' al estado opuesto
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !currentState })
      .eq('id', taskId); // Filtra por el ID de la tarea

    if (error) {
      console.error('Error al actualizar la tarea:', error.message);
    } else {
      fetchTasks(); // Recarga la lista
    }
  }
  
  // --- Renderizado de la Interfaz de Usuario ---

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">📋 Lista de Tareas</h1>

      {/* Formulario para Añadir Tarea */}
      <div className="flex mb-8 bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Escribe la tarea y pulsa Añadir..."
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addTask} className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 transition duration-150 font-semibold">
          Añadir
        </button>
      </div>

      {/* Lista de Tareas */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center p-4 rounded-lg shadow-sm transition duration-150 ${
                task.is_complete ? 'bg-green-100 text-gray-500' : 'bg-white'
            }`}
          >
            <span
              style={{ textDecoration: task.is_complete ? 'line-through' : 'none' }}
              className="flex-grow text-lg font-medium"
            >
              {task.title}
            </span>
            <div>
              <button
                onClick={() => toggleComplete(task.id, task.is_complete)}
                className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full transition duration-150 ${
                  task.is_complete ? 'bg-gray-400 hover:bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white`}
              >
                {task.is_complete ? 'Deshacer' : 'Completar'}
              </button>
              {/* Aquí deberías añadir la lógica de EDITAR tarea */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}