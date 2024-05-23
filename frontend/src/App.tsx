import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?blockchain')",
      }}
    >
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8 bg-black bg-opacity-50 min-h-screen">
        <section className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Our ICO
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Join us in our journey to revolutionize the world of decentralized
            finance.
          </p>
          <Link
            to="/invest"
            className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium hover:bg-blue-700"
          >
            Invest
          </Link>
        </section>
      </main>
    </div>
  );
};

export default App;
