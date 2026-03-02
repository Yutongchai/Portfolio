import React from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import WhatsAppFloating from "./components/ui/WhatsAppFloating";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
        {/* <ScrollToTopButton /> */}
        <WhatsAppFloating />
        <CookieConsent />
        <Analytics />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;