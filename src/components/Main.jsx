import { Layout, Typography } from "antd";
import AudioInput from "./AudioInput";
import { useContext } from "react";
import { Context } from "../context/Context";
import Converter from "./Converter";
import { Col, Container, Row } from "react-bootstrap";
// import AppHeader from "./Header/Header";
import Headertw from "./Header/Header-tw";
import "./Common.css";
// import Footer from "./Footer/Footer";
// import Footertw from "./Footer/Footer-tw";
import darkBackground from "../../public/assets/abstract-black-wave-line-contour-background-orange-free-vector.jpg";
import lightBackground from "../../public/assets/pattern-randomized.png";
const { Title } = Typography;

const Input = () => {
  let { isDarkMode, isProcessAudio } = useContext(Context);

  const backgroundImage = isDarkMode ? darkBackground : lightBackground;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Layout
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          paddingTop: "4rem",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* <AppHeader /> */}
        <Headertw />
        <Container fluid>
          <Title
            level={2}
            style={{
              color: isDarkMode ? "#fff" : "#000",
            }}
            className="text-center web-title pt-10"
          >
            Chuyển Đổi Âm Thanh Thành Văn Bản
          </Title>
          <Row className="pt-0 d-flex justify-content-center align-items-center">
            <Col xs={12} sm={12} md={6} lg={6} className="mb-4 pt-10">
              <AudioInput />
            </Col>
            {isProcessAudio && (
              <Col
                xs={12}
                sm={12}
                md={isProcessAudio ? 6 : 12}
                lg={isProcessAudio ? 6 : 12}
                className="mb-4"
              >
                <Converter />
              </Col>
            )}
          </Row>
        </Container>
        {/* <Footertw /> */}
        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
};

export default Input;
