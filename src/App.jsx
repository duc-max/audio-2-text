import "./App.css";
import Provider from "./context/Context";
import Navbar from "./components/Navbar.jsx";
import Carou from "./components/NavButton.jsx";
import { Layout} from "antd";
import ProductOV from "./components/ProductOV.jsx";
import AppFooter from "./components/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Input from "./components/Input.jsx";
import Converter from "./components/Converter.jsx";
import { theme } from "antd";
import Detailed from "./components/Detailed.jsx";

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Provider>
      <Layout style={{ height: "100vh" }}>
        <Navbar />
        <Layout
          style={{
            background: colorBgContainer,
          }}
        >
          
          <Carou />
          <Input />
        </Layout>
      </Layout>
    </Provider>
  );
}

export default App;
