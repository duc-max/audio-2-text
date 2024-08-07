import "./App.css";
import Provider from "./context/Context";
import Carou from "./components/NavButton.jsx";

import Navbar from "./components/Navbar.jsx";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from "antd";
import { publicRoutes } from "./route";

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Provider>
      <Layout style={{ background: colorBgContainer, height: "100vh" }}>
        <Router>
          <Navbar />
          <Carou />
          <Layout
            style={{
              background: colorBgContainer,
            }}
          >
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                return (
                  <Route key={index} path={route.path} element={<Page />} />
                );
              })}
            </Routes>
          </Layout>
        </Router>
      </Layout>
    </Provider>
  );
}

export default App;
