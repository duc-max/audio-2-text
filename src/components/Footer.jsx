import "react";
import { Layout } from "antd";
const { Footer } = Layout;
function AppFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        padding: "12px",
        fontSize: "8px",
        width: "100%",
      }}
    >
      H2Q Solution ©{new Date().getFullYear()}
    </Footer>
  );
}

export default AppFooter;
