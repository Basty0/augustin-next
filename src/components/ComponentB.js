// components/ComponentB.js
import React, { useState } from "react";

const ComponentB = ({ onButtonClick }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Composant B
      </h2>

      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Carte d'information
        </h3>
        <p className="text-gray-600">
          Ceci est un exemple de texte dans une carte. Vous pouvez ajouter plus
          d'informations ici.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Entrez du texte ici"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-gray-600">Texte saisi : {inputValue}</p>
      </div>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        onClick={onButtonClick}
      >
        Afficher Composant A
      </button>
    </div>
  );
};

export default ComponentB;
