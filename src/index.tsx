import { createRoot } from "react-dom/client";
import App from "./App";
import "./style/tailwind.css";
import "./style/index.css";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(<App />);