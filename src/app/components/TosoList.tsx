'use client'
import React, { useEffect, useState } from "react";

interface Todo {
    id: number;
    content: string;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoContent, setNewTodoContent] = useState<string>("");
    const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('https://wasp-hot-unlikely.ngrok-free.app/todos/', {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };

        const interval = setInterval(fetchTodos, 1000); // Fetch todos every second

        return () => clearInterval(interval); // Clean up setInterval on component unmount
    }, []); // Empty dependency array ensures useEffect runs only once

    const createTodo = async () => {
        try {
            // Calculate the next available ID
            const nextId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
            
            const response = await fetch('https://wasp-hot-unlikely.ngrok-free.app/todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ id: nextId, content: newTodoContent }) // Include the calculated nextId
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            setNewTodoContent("");
            const data = await response.json();
            setTodos([...todos, data]);
        } catch (error) {
            console.error("Error creating todo:", error);
        }
    };

    const deleteTodo = async () => {
        if (deleteTodoId === null) {
            console.error("Please enter the ID of the todo you want to delete.");
            return;
        }

        try {
            const response = await fetch(`https://wasp-hot-unlikely.ngrok-free.app/todos/${deleteTodoId}`, {
                method: 'DELETE',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete todo (status ${response.status})`);
            }
            setTodos(todos.filter(todo => todo.id !== deleteTodoId));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };
    

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-3xl font-bold text-center mb-4">Todo List</h1>
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={newTodoContent}
                    onChange={(e) => setNewTodoContent(e.target.value)}
                    placeholder="Enter new todo..."
                    className="border-gray-300 border rounded-md px-4 py-2 w-full"
                />
                <button
                    onClick={createTodo}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                >
                    Add Todo
                </button>
            </div>
            <div className="mb-4 flex items-center">
                <input
                    type="number"
                    value={deleteTodoId || ''}
                    onChange={(e) => setDeleteTodoId(parseInt(e.target.value))}
                    placeholder="Enter ID of todo to delete..."
                    className="border-gray-300 border rounded-md px-4 py-2 w-full"
                />
                <button
                    onClick={deleteTodo}
                    className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                >
                    Delete Todo
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                    <li key={todo.id} className="py-4">
                        <span className="block font-semibold">ID: {todo.id}</span>
                        <span className="block">{todo.content}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
