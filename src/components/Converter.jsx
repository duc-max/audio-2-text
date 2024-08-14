import { Layout, theme, Popover, Table, Spin, Progress } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Row, Col } from "antd";
import { RiSpeakLine } from "react-icons/ri";
import { SoundOutlined } from "@ant-design/icons";

import "./Common.css";

const { Content } = Layout;

const colors = {
  happy: "#ffa940",
  sad: "#8c8c8c",
  neutral: "#ad6800",
  angry: "#f5222d",
  anxiety: "#ffc53d",
};

function Converter() {
  const data2 = {
    status: 0,
    statusCode: 200,
    object: [
      {
        id: "Invalid",
        text: "Invalid",
        emotion: [
          {
            key: "Happy",
            percent: 10,
          },
          {
            key: "Neutral",
            percent: 50,
          },
          {
            key: "Sad",
            percent: 40,
          },
        ],
      },
      {
        id: "Invalid",
        text: "Invalid",
        emotion: [
          {
            key: "Happy",
            percent: 10,
          },
          {
            key: "Neutral",
            percent: 50,
          },
          {
            key: "Sad",
            percent: 40,
          },
        ],
      },
    ],
    isOk: true,
    isError: false,
  };

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
      case "happy":
        return "Vui vẻ";
      case "sad":
        return "Buồn";
      case "angry":
        return "Giận dữ";
      case "neutral":
        return "Bình thường";
      case "anxiety":
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

  useEffect(() => {
    if (loading) {
      const loadApi = () => {
        let currentPercentage = 0;
        const intervalId = setInterval(() => {
          const increment = 1;

          currentPercentage += increment;
          if (currentPercentage > 99) {
            currentPercentage = 99;
          }
          setPercentage(currentPercentage);
          if (upload) {
            clearInterval(intervalId);
            setLoading(false);
          }
        }, 1000);
      };

      loadApi();
    }
  }, [loading]);

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
            {loading ? (
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
            ) : (
              ""
            )}
            <List
              itemLayout="vertical"
              size="default"
              dataSource={data.length == 0 ? data2.object : data}
              style={{ height: "100%", padding: "0.5rem" }}
              renderItem={(item, i) => (
                <Skeleton
                  active
                  loading={!upload}
                  avatar
                  paragraph
                  style={{ height: "100%" }}
                  className="p-8"
                >
                  <List.Item
                    className="fade-in"
                    key={i}
                    style={{
                      marginRight: "0.375rem",
                      paddingLeft: "0.375rem",
                    }}
                  >
                    <List.Item.Meta
                      style={{ marginBottom: "0.25rem" }}
                      avatar={<Avatar src={`../assets/${item.id}.png`} />}
                      title={<span> {item.id}</span>}
                    />
                    <div className="list-audio-wrapper">
                      <div
                        className="transcription"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 1,
                        }}
                      >
                        <span>{item.text}</span>
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
                          {item
                            ? item?.emotion
                                .sort((a, b) => b.percent - a.percent)
                                .slice(0, 2)
                                .map((e, index) => (
                                  <span
                                    key={index}
                                    style={{
                                      color: getEmotionColor(e.key),
                                      fontSize: 16,
                                    }}
                                  >
                                    {e.key + ": " + e.percent + "%"} <br />
                                  </span>
                                ))
                            : "Không có dữ liệu"}
                        </span>
                      </Popover>
                    </div>
                  </List.Item>
                </Skeleton>
              )}
            />
          </Col>
        </Row>
      </div>
    </Content>
  );
}

export default Converter;
