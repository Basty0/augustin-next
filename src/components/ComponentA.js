// components/ComponentA.js
import React, { useState } from "react";

const ComponentA = ({ onButtonClick }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Composant A
      </h2>

      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Informations
        </h3>
        <p className="text-gray-600">
          Bienvenue dans le Composant A. Ici, vous pouvez interagir avec
          différents éléments.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Entrez votre texte"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-gray-600">
          Vous avez saisi : {inputValue}
        </p>
      </div>

      <button
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={onButtonClick}
      >
        Afficher Composant B
      </button>
    </div>
  );
};

export default ComponentA;
