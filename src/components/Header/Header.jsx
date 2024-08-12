import { Layout, Switch } from "antd";
import { useContext } from "react";
import "./Header.css";
import { ThemeContext } from "../../context/ThemeContext";

const { Header } = Layout;

const AppHeader = () => {
  const { isDarkMode, handleThemeChange } = useContext(ThemeContext);

  return (
    <Header
      style={{ backgroundColor: isDarkMode ? "#001529" : "#EEEEEE	" }}
      className="header-container"
    >
      <div className="logo header-logo">My App</div>
      <div className="header-menu--wrapper">
        <div></div>
        <div>
          <Switch
            checkedChildren="Sáng"
            unCheckedChildren="Tối"
            onChange={handleThemeChange}
          />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
