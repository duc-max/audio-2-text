import { Layout, theme, Popover, Table, Spin } from "antd";
import { useContext } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Row, Col } from "antd";
import { RiSpeakLine } from "react-icons/ri";
import { LoadingOutlined } from "@ant-design/icons";

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
  const data2 = {
    status: 0,
    statusCode: 200,
    object: [
      {
        id: "Invalid",
        text: "Invalid",
        emotion: [
          {
            key: "vui",
            percent: 10,
          },
          {
            key: "bình thường",
            percent: 50,
          },
          {
            key: "sợ",
            percent: 40,
          },
        ],
      },
      {
        id: "Invalid",
        text: "Invalid",
        emotion: [
          {
            key: "vui",
            percent: 10,
          },
          {
            key: "bình thường",
            percent: 50,
          },
          {
            key: "sợ",
            percent: 40,
          },
        ],
      },
      {
        id: "Invalid",
        text: "Invalid",
        emotion: [
          {
            key: "vui",
            percent: 80,
          },
          {
            key: "bình thường",
            percent: 50,
          },
          {
            key: "sợ",
            percent: 40,
          },
          {
            key: "giận",
            percent: 60,
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

  const { data, upload,isDarkMode } = useContext(Context);
  console.log(data);

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
        <span style={{ color: getEmotionColor(text.trim()), fontSize: 16 }}>
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

  return (
    <Content>
      <div
        style={{
          minHeight: 500,
          borderRadius: borderRadiusLG,
          background: "#f2f4f5",
          padding: "0 24 24 24",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                    color: !isDarkMode ? "rgb(102, 102, 255)" : "rgb(239, 91, 30)",
                  }}
                  spin
                />
              }
              spinning={!upload}
            >
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
                        title={<span>Person: {item.id}</span>}
                      />
                      <div className="list-audio-wrapper">
                        <div
                          className="transcription"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 18,
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              paddingRight: "0.5rem",
                            }}
                          >
                            <RiSpeakLine />
                          </span>
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
                                      {e.key}
                                      {index < 1 ? ", " : ""}
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
            </Spin>
          </Col>
        </Row>
      </div>
    </Content>
  );
}

export default Converter;
