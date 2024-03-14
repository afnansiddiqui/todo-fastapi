// pages/index.tsx
import React from "react";
import TodoList from "./components/TosoList";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center mb-8">My Todo App using FastAPI</h1>
                <TodoList />
            </div>
        </div>
    );
};

export default Home;
