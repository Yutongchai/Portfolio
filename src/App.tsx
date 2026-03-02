import React, { useEffect } from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import WhatsAppFloating from "./components/ui/WhatsAppFloating";
import CookieConsent from "./components/CookieConsent";
import ReactGA from 'react-ga4';
import { useLocation } from "react-router-dom";
   
const App: React.FC = () => {
  const location = useLocation(); 
  useEffect(() => {
       ReactGA.send({ hitType: "pageview", page: location.pathname });
     }, [location]);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
        {/* <ScrollToTopButton /> */}
        <WhatsAppFloating />
        <CookieConsent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;