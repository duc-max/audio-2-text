import { Layout, theme, Popover, Table } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Progress, Row, Col } from "antd";
import { RiSpeakLine } from "react-icons/ri";

import "./Common.css";

const { Content } = Layout;

const colors = {
  vui: "#ffa940", // Happiness
  buồn: "#8c8c8c", // Sadness
  "bình thường": "#ad6800", // Neutral
  giận: "#f5222d", // Anger
  sợ: "#9254de", // Fear
  "ngạc nhiên": "#ffc53d", // Surprise
};

function Converter() {
  const data = {
    status: 0,
    statusCode: 200,
    object: [
      {
        id: "A",
        text: " xin chào ",
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
        id: "B",
        text: " xin chào ",
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
        id: "C",
        text: " xin chào moi nguoi toi la mot con nguoi thongh minh manh menh jahhaha ",
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
      {
        id: "D",
        text: " xin chào ",
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
        id: "A",
        text: "xin chào moi nguoi toi la mot con nguoi thongh minh manh menh jahhaha ",
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
    ],
    isOk: true,
    isError: false,
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { loading, setLoading, percentage, setPercentage } =
    useContext(Context);

  useEffect(() => {
    if (loading) {
      const loadApi = () => {
        let currentPercentage = 0;
        const intervalId = setInterval(() => {
          const increment =
            Math.floor(Math.random() * 10) !== 0
              ? Math.floor(Math.random() * 10)
              : 1;
          currentPercentage += increment;
          if (currentPercentage > 100) {
            currentPercentage = 100;
          }
          setPercentage(currentPercentage);
          console.log("Percentage:", currentPercentage);
          if (currentPercentage >= 100) {
            clearInterval(intervalId);
            setLoading(false);
          }
        }, 200);
      };

      loadApi();
    }
  }, [loading]);

  const getEmotionColor = (emotion) => {
    return colors[emotion] || "#000";
  };

  const emotionColumns = [
    {
      title: "Cảm xúc",
      dataIndex: "key",
      key: "key",
      render: (text) => (
        <span style={{ color: getEmotionColor(text), fontSize: 16 }}>
          {text}
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
    <Content
      style={{
        margin: "24px 16px 0",
      }}
    >
      <div
        style={{
          minHeight: 500,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: "0 24 24 24",
          ...(loading == false
            ? {
                overflowY: "scroll",
                overflowX: "hidden",
                height: "180px",
              }
            : {}),
        }}
      >
        {loading ? <Progress percent={percentage} /> : ""}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24}>
            <List
              itemLayout="vertical"
              size="default"
              dataSource={data.object}
              style={{ height: "100%" }}
              renderItem={(item, i) => (
                <List.Item key={i} style={{ marginRight: 6 }}>
                  <Skeleton loading={loading == true} active avatar paragraph>
                    <List.Item.Meta
                      style={{ marginBottom: "4px" }}
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${item.id}`}
                        />
                      }
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
                            flexShrink: 0, // Prevent the icon from shrinking
                            paddingRight: "8px",
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
                          {item.emotion
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
                            ))}
                        </span>
                      </Popover>
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        
      </div>
    </Content>
  );
}

export default Converter;
