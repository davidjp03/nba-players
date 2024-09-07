import { useState } from 'react'
import axios from 'axios';


interface PlayerPair {
  player1: string;
  player2: string;
}

function App() {
  const [targetHeight, setTargetHeight] = useState<number | string>('');
  const [playerPairs, setPlayerPairs] = useState<PlayerPair[]>([]);
  const [message, setMessage] = useState<string>('');

  const handleSearch = async () => {
    if (!targetHeight || Number(targetHeight) <= 0) {
      setMessage('Please enter a valid target height');
      setPlayerPairs([]);
      return;
    }
  
    try {
      // Hacemos la solicitud al backend
      const response = await axios.get(`http://127.0.0.1:8000/search/${targetHeight}`);
      
      // Imprime la respuesta para verificar lo que estás recibiendo
      console.log(response);
  
      if (response.data.pairs) {
        setPlayerPairs(response.data.pairs);
        setMessage('');
      } else if (response.data.message) {
        setMessage(response.data.message);
        setPlayerPairs([]);
      } else {
        setMessage('Unexpected response format');
      }
    } catch (error) {
      // Imprime el error para ver qué está pasando
      console.error("Error in request:", error);
      setMessage('Error fetching data. Please try again later.');
      setPlayerPairs([]);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">NBA Player Height Search</h1>

      <div className="mb-4">
        <input 
          type="number" 
          value={targetHeight} 
          onChange={(e) => setTargetHeight(Number(e.target.value))} 
          placeholder="Enter target height (inches)" 
          className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button 
        onClick={handleSearch} 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors">
        Search
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}

      <ul className="mt-4 space-y-2">
        {playerPairs.map((pair, index) => (
          <li key={index} className="bg-gray-700 p-2 rounded-md">
            {pair.player1} - {pair.player2}
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default App
