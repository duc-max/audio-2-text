import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { InputNumber, Layout, Menu, Divider } from "antd";
const { Sider } = Layout;
import { Context } from "../context/Context";
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductOV from "./ProductOV";
import Input from "./Input";
import Detailed from "./Detailed";

function Navbar() {
  const { collapsed } = useContext(Context);
  return (
    <Router>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", padding: "20px 0" }}
        >
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            style={{ margin: "10px auto" }}
          >
            <Link to="/overview">Giới thiệu </Link>
          </Menu.Item>
          <Divider solid style={{margin: '10px 0'}} />
          <Menu.Item
            key="2"
            icon={<UploadOutlined />}
            style={{ margin: "10px auto" }}
          >
            <Link to="/upload">Tải lên</Link>
          </Menu.Item>
          <Divider solid style={{margin: '10px 0'}} />
          <Menu.Item key="3" icon={<VideoCameraOutlined />}>
            <Link to="/result">Kết quả</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Routes>
        <Route path="/overview" component={<ProductOV />} />
        <Route path="/upload" component={<Input />} />
        <Route path="/result" component={<Detailed />} />
      </Routes>
    </Router>
  );
}

export default Navbar;
