import { useContext } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout,  theme } from "antd";
import {Context} from "../context/Context";
const { Header } = Layout;

const Carou = () => {
  const {collapsed, setCollapsed} = useContext(Context);
  const {
    token: { colorBgContainer},
  } = theme.useToken();
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "1rem",
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
};
export default Carou;
