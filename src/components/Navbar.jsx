import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Divider } from "antd";
const { Sider } = Layout;
import { Context } from "../context/Context";
import { useContext } from "react";
// import ProductOV from "./ProductOV";
// import Input from "./Input";
// import Detailed from "./Detailed";
import { Link } from "react-router-dom";

function Navbar() {
  const { collapsed } = useContext(Context);
  return (
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
          <Link to="/">Giới thiệu </Link>
        </Menu.Item>
        <Divider solid style={{ margin: "10px 0" }} />
        <Menu.Item
          key="2"
          icon={<UploadOutlined />}
          style={{ margin: "10px auto" }}
        >
          <Link to="/upload">Tải lên</Link>
        </Menu.Item>
        <Divider solid style={{ margin: "10px 0" }} />
        <Menu.Item key="3" icon={<VideoCameraOutlined />}>
          <Link to="/result">Kết quả</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Navbar;
