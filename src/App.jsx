import ThemeCustomization from "./theme";
import { store } from "./store";
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import ScrollTop from "./components/common/ScrollTop";
import "react-phone-number-input/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ResponsiveProvider } from "./hooks/ResponsiveProvider";


function App() {
  return (
    <BrowserRouter>
     <ResponsiveProvider>
      <ReduxProvider store={store}>
        <ThemeCustomization>
          <ScrollTop>
            <AppRoutes />
          </ScrollTop>
        </ThemeCustomization>
      </ReduxProvider>
      </ResponsiveProvider>
    </BrowserRouter>
  );
}

export default App;
