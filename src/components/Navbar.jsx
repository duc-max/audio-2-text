import {
  UploadOutlined,
  UserOutlined,
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
  const menuItemStyle = {
    margin: "20px auto",
  };
  return (
    <Sider className="container"
      trigger={null}
      collapsible
      collapsed={collapsed}
      position="fixed"
      theme="light"
      style={{ position: "relative", height: "100vh" }}
    >
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", padding: "20px 0", paddingTop: "240px" }}
      >
        <Divider solid style={{ margin: "10px 0" }} />
        <Menu.Item key="1" icon={<UserOutlined />} style={menuItemStyle}>
          <Link to="/">Giới thiệu </Link>
        </Menu.Item>
        <Divider solid style={{ margin: "10px 0" }} />
        <Menu.Item key="2" icon={<UploadOutlined />} style={menuItemStyle}>
          <Link to="/upload">Tải lên</Link>
        </Menu.Item>
        <Divider solid style={{ margin: "10px 0" }} />
      </Menu>
    </Sider>
  );
}

export default Navbar;
