import { Layout, theme, Popover, Table, Progress } from "antd";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Context } from "../context/Context";
import { Avatar, List, Row, Col } from "antd";

import "./Common.css";

const { Content } = Layout;

const colors = {
  Happy: "#ffa940",
  Sad: "#8c8c8c",
  Neutral: "#ad6800",
  Angry: "#f5222d",
  Anxiety: "#ffc53d",
};

function Converter() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    loading,
    setLoading,
    percentage,
    setPercentage,
    upload,
    isDarkMode,
  } = useContext(Context);

  const getEmotionColor = (emotion) => {
    return colors[emotion] || "#000";
  };

  const getEmotionName = (emotion) => {
    switch (emotion) {
      case "Happy":
        return "Vui vẻ";
      case "Sad":
        return "Buồn";
      case "Angry":
        return "Giận dữ";
      case "Neutral":
        return "Bình thường";
      case "Anxiety":
        return "Lo lắng";
      default:
        return "";
    }
  };

  const emotionColumns = [
    {
      title: "Cảm xúc",
      dataIndex: "key",
      key: "key",
      render: (text) => (
        <span style={{ color: getEmotionColor(text.trim()), fontSize: "1rem" }}>
          {getEmotionName(text.trim())}
        </span>
      ),
    },
    {
      title: "Phần trăm",
      dataIndex: "percent",
      key: "percent",
    },
  ];

  const currentPercentageRef = useRef(0);
  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        let increment;
        if (!upload) {
          increment = Math.floor(Math.random() * 3) + 1;
          currentPercentageRef.current += increment;
          if (currentPercentageRef.current >= 100) {
            currentPercentageRef.current = 99;
          }
        } else {
          increment = 30;
          currentPercentageRef.current += increment;
          if (currentPercentageRef.current >= 100) {
            currentPercentageRef.current = 100;
            clearInterval(intervalId);
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        }
        setPercentage(currentPercentageRef.current);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [loading, upload]);

  return (
    <Content>
      <div
        className="converter-wrapper"
        style={{
          borderRadius: borderRadiusLG,
          background: "#f2f4f5",
          padding: "0 1.5rem 1.5rem 1.5rem",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24}>
            {loading && (
              <div>
                <p
                  style={{
                    margin: "0",
                    padding: "2px",
                    fontSize: "16px",
                    color: isDarkMode ? "#fff" : "#000",
                  }}
                >
                  Quá trình xử lý cần thời gian, vui lòng đợi...
                </p>
                <Progress
                  percent={percentage}
                  className="custom-progress"
                  strokeColor={
                    !isDarkMode ? "rgb(102, 102, 255)" : "rgb(239, 91, 30)"
                  }
                />
              </div>
            )}
            {data && data.length > 0 && !loading && (
              <List
                itemLayout="vertical"
                size="default"
                dataSource={data}
                style={{ height: "100%", padding: "0.5rem" }}
                renderItem={(item, i) => (
                  <List.Item
                    className="fade-in"
                    key={i}
                    style={{
                      color: isDarkMode ? "#fff" : "#000",
                      marginRight: "0.375rem",
                      paddingLeft: "0.375rem",
                    }}
                  >
                    <List.Item.Meta
                      style={{
                        marginBottom: "0.25rem",
                        color: isDarkMode ? "#fff" : "#000",
                      }}
                      avatar={<Avatar src={`../assets/${item.id}.png`} />}
                      title={
                        <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                          {item.id}
                        </span>
                      }
                    />
                    <div
                      className="list-audio-wrapper"
                      style={{ color: isDarkMode ? "#fff" : "#000" }}
                    >
                      <div className="transcription">
                        <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                          {item.text}
                        </span>
                      </div>
                      <Popover
                        content={
                          <Table
                            columns={emotionColumns}
                            dataSource={item.emotion}
                            pagination={false}
                            size="small"
                          />
                        }
                        title="Chi tiết"
                        trigger="hover"
                      >
                        <span style={{ cursor: "pointer" }}>
                          {item?.emotion
                            .sort((a, b) => b.percent - a.percent)
                            .slice(0, 2)
                            .map((e, index) => (
                              <span
                                key={index}
                                style={{
                                  color: getEmotionColor(e.key.trim()),
                                  fontSize: 16,
                                }}
                              >
                                {getEmotionName(e.key.trim()) +
                                  ": " +
                                  e.percent +
                                  "%"}{" "}
                                <br />
                              </span>
                            )) || "Không có dữ liệu"}
                        </span>
                      </Popover>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Col>
        </Row>
      </div>
    </Content>
  );
}

export default Converter;
