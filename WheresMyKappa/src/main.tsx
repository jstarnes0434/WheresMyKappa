import "primereact/resources/primereact.min.css"; // Default PrimeReact styles
import "primeicons/primeicons.css"; // PrimeIcons (optional, for icons)
import "primereact/resources/themes/arya-blue/theme.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
