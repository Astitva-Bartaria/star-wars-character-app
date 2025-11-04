// import CharacterList from "./components/CharacterList";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <header className="max-w-6xl mx-auto mb-6 text-center">
//         <h1 className="text-3xl font-bold">Star Wars Characters</h1>
//         <p className="text-sm text-gray-600">
//           Data from SWAPI — click a card for details
//         </p>
//       </header>

//       <main className="max-w-6xl mx-auto">
//         <CharacterList />
//       </main>
//     </div>
//   );
// }

// src/App.jsx
import React, { useEffect, useState } from "react";
import CharacterList from "./pages/CharacterList";
import LoginPage from "./pages/LoginPage";
import { fakeAuth } from "./services/auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    fakeAuth.isTokenValid()
  );

  // Silent token refresh every 4 mins
  useEffect(() => {
    const interval = setInterval(() => {
      if (fakeAuth.isTokenValid()) fakeAuth.refreshToken();
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    fakeAuth.logout();
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Star Wars Characters</h1>
          <p className="text-sm text-gray-600">
            Data from SWAPI — click a card for details
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <CharacterList />
      </main>
    </div>
  );
}
