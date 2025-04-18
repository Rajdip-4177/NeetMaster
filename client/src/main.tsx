import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to hide loading spinner
const hideLoadingSpinner = () => {
  const loadingElement = document.querySelector('.app-loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
};

// Get the root element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Render the app
root.render(<App />);

// Hide loading spinner after render is complete
window.addEventListener('load', hideLoadingSpinner);
