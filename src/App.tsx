import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExtendedWeather from "./pages/ExtendedWeather";
import Settings from "./pages/Settings";
import SearchLocation from "./pages/SearchLocation";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto max-w-md px-4 pt-8 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<ExtendedWeather />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<SearchLocation />} />
          </Routes>
          <Navbar />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
