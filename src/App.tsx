import React from "react";
import Routes from "./Routes";
import supabase from "./config/supabaseClient";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContentProvider } from "./contexts/ContentContext";
import { AdminProvider } from "./contexts/AdminContext";
import AdminPanel from "./components/admin/AdminPanel";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AdminProvider>
        <ContentProvider>
          <Routes />
          {/* <AdminPanel /> */}
          <ScrollToTopButton />
        </ContentProvider>
      </AdminProvider>
    </ThemeProvider>
  );
};

export default App;