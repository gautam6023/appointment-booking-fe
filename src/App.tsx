import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes/Routes";
import "./App.css";

/**
 * Main App component
 * Sets up routing and global components like toast notifications
 */
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
