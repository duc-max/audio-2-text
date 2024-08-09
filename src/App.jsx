import "./App.css";
import Provider from "./context/Context";
import Carou from "./components/NavButton.jsx";
import Navbar from "./components/Navbar.jsx";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from "antd";
import { publicRoutes } from "./routes";
// import Detailed from "./components/Detailed.jsx";

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Provider>
      <Router>
        <Layout
          style={{
            background: colorBgContainer,
            height: "100vh",
            width: "100vw",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Layout
            style={{
              background: colorBgContainer,
              paddingTop: "64px",
              position: "relative",
              zIndex: 0,
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
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
