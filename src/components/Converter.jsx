const { Content } = Layout;
import { Layout, theme } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Progress, Row, Col } from "antd";
import "./Common.css";

const colors = {
  Happiness: "#ffa940",
  Sadness: "#8c8c8c",
  Neutral: "#ad6800",
  Anger: "#f5222d",
  Fear: "#9254de",
  Surprise: "#ffc53d",
};

function Converter() {
  const data2 = {
    status: 0,
    statusCode: 200,
    object: [
      {
        id: "A",
        text: " xin chào ",
        emotion: [
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
            percent: 40,
          },
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
            percent: 40,
          },
        ],
      },
      {
        id: "B",
        text: " xin chào ",
        emotion: [
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
            percent: 40,
          },
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
            percent: 40,
          },
        ],
      },
      {
        id: "B",
        text: " xin chào ",
        emotion: [
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
            percent: 40,
          },
          {
            key: " vui",
            percent: 10,
          },
          {
            key: " bình thường",
            percent: 50,
          },
          {
            key: " sợ",
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
  const {
    loading,
    setLoading,
    setOpen,
    selectedDetail,
    setSelectedDetail,
    percentage,
    setPercentage,
    data,
  } = useContext(Context);

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
        }, 200); // Fixed interval of 1000 milliseconds (1 second)
      };

      loadApi();
    }
  }, [loading]);

  const getEmotionColor = (emotion) => {
    return colors[emotion] || "#000";
  };

  return (
    <Content
      className="container"
      style={{
        margin: "24px 16px 0",
      }}
    >
      <div
        style={{
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: "0 24 24 24",
          ...(loading == false
            ? {
                overflowY: "scroll",
                overflowX: "hidden",
                height: "200px",
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
                <List.Item key={i}>
                  <Skeleton loading={loading == true} active avatar paragraph>
                    <List.Item.Meta
                      style={{ marginBottom: "4px" }}
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${item.id}`}
                        />
                      }
                      title={
                        <a
                          onClick={() => {
                            setOpen(!open);
                            setSelectedDetail(item);
                          }}
                        >
                          Person : {item.id}
                        </a>
                      }
                    />
                    <div className="list-audio-wrapper">
                      <span className="transcription">{item.text}</span>
                      <span>
                        {item.emotion.map((e, index) => (
                          <p
                            key={index}
                            style={{ color: getEmotionColor(e.key) }}
                          >
                            {e.key.charAt(0).toUpperCase() + e.key.slice(1)}:{" "}
                            {e.percent}%
                            {index < item.emotion.length - 1 ? ", " : ""}
                          </p>
                        ))}
                      </span>
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
