import React from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
        <ScrollToTopButton />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;