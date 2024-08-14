import { Layout, theme, Popover, Table, Spin, Progress } from "antd";
import { useContext, useEffect } from "react";
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

  const { data, loading, setLoading, percentage, setPercentage, upload } =
    useContext(Context);

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
                    color: "#595959",
                  }}
                >
                  Quá trình xử lý cần thời gian, vui lòng đợi...
                </p>
                <Progress percent={percentage} />
              </div>
            ) : (
              ""
            )}
            <List
              itemLayout="vertical"
              size="default"
              dataSource={data.length == 0 ? data2.object : data}
              // dataSource={data2.object}
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
                          fontSize: 18,
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
