import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Project from "./pages/Project";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/" element={<Project />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
