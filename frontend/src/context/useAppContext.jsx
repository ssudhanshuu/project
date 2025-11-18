// src/context/useAppContext.jsx
import { useContext } from "react"; // <-- Import useContext
import AppContext from "./AppContext"; // Import your context

const useAppContext = () => {
  const context = useContext(AppContext); // useContext hook
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default useAppContext;
