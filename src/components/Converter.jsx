const { Content } = Layout;
import { Layout, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Progress, Row, Col } from "antd";
import Detailed from "./others/Modal";
const dataset1 = [
  {
    filename: "happy_01.wav",
    emotions: [
      { emotion: "Happiness", value: "90%" },
      { emotion: "Neutral", value: "10%" },
    ],
    transcription: "I just received the best news ever!",
  },
  {
    filename: "sad_01.wav",
    emotions: [
      { emotion: "Sadness", value: "85%" },
      { emotion: "Neutral", value: "15%" },
    ],
    transcription: "I'm feeling really down today.",
  },
  {
    filename: "angry_01.wav",
    emotions: [
      { emotion: "Anger", value: "95%" },
      { emotion: "Neutral", value: "5%" },
    ],
    transcription: "This situation is completely unacceptable.",
  },
  {
    filename: "fear_01.wav",
    emotions: [
      { emotion: "Fear", value: "80%" },
      { emotion: "Neutral", value: "20%" },
    ],
    transcription: "I'm really scared about what's happening.",
  },
  {
    filename: "surprise_01.wav",
    emotions: [
      { emotion: "Surprise", value: "90%" },
      { emotion: "Neutral", value: "10%" },
    ],
    transcription: "Wow, I didn't see that coming at all!",
  },
];

function Converter() {
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
        }, 1000); // Fixed interval of 1000 milliseconds (1 second)
      };

      loadApi();
    }
  }, [loading]);

  return (
    <Content
      style={{
        margin: "24px 16px 0",
      }}
    >
      <div
        style={{
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: 24,
        }}
      >
        {loading ? <Progress percent={percentage} /> : ""}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24}>
            <List
              itemLayout="vertical"
              size="default"
              dataSource={dataset1}
              renderItem={(item, i) => (
                <List.Item key={i}>
                  <Skeleton loading={loading == true} active avatar paragraph>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`}
                        />
                      }
                      title={
                        <a
                          onClick={() => {
                            setOpen(!open);
                            setSelectedDetail(item);
                          }}
                        >
                          {item.filename}
                        </a>
                      }
                      description={item.emotions
                        .map((e) => e.emotion)
                        .join(", ")}
                    />
                    {item.transcription}
                  </Skeleton>
                  {selectedDetail && (
                    <Detailed emotions={selectedDetail.emotions} />
                  )}
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
