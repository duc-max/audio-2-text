import Provider from "./context/Context";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import "./App.css";
import ThemeProvider from "./context/ThemeContext";
function App() {
  return (
    <Provider>
      <ThemeProvider>
        <Router>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
