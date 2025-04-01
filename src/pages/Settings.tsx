import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const Settings: React.FC = () => {
  const [defaultLocation, setDefaultLocation] = useLocalStorage<string>(
    "defaultLocation",
    "London"
  );
  const [unit, setUnit] = useLocalStorage<string>("unit", "metric");
  const [location, setLocation] = useState<string>(defaultLocation);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (location.trim()) {
      setDefaultLocation(location.trim());
      setSuccessMessage("Settings saved successfully!");
    }
  };

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your weather experience
        </p>
      </header>

      <section>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Default Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Default Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              placeholder="Enter city name"
              aria-label="Default Location"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the city name for your default weather location
            </p>
          </div>

          {/* Temperature Units */}
          <div className="space-y-2">
            <span className="block text-sm font-medium">Temperature Units</span>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="metric"
                  checked={unit === "metric"}
                  onChange={() => setUnit("metric")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Celsius (°C)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="imperial"
                  checked={unit === "imperial"}
                  onChange={() => setUnit("imperial")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Fahrenheit (°F)
                </span>
              </label>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
              role="alert"
            >
              <p>{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </form>
      </section>
    </main>
  );
};

export default Settings;
