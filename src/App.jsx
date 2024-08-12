import Provider from "./context/Context";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import "./App.css";
function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
