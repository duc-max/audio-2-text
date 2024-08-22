import {
  Layout,
  theme,
  Popover,
  Table,
  Progress,
  Skeleton,
  Tooltip,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Row, Col } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import AudioSegment from "./others/AudioSegments";

import "./Common.css";

const { Content } = Layout;

const colors = {
  Happy: "#ffa940",
  Sad: "#8c8c8c",
  Neutral: "#ad6800",
  Angry: "#f5222d",
  Anxiety: "#ffc53d",
};

const data1 = {
  status: 0,
  statusCode: 200,
  object: [
    {
      id: "SPEAKER_01",
      text: " thứ hai của anh là.",
      fromTime: 3000,
      toTime: 10000,
      emotion: [
        {
          key: " Angry",
          percent: 0.19,
        },
        {
          key: " Anxiety",
          percent: 0,
        },
        {
          key: " Happy",
          percent: 99.8,
        },
        {
          key: " Sad",
          percent: 0.01,
        },
        {
          key: " Neutral",
          percent: 0,
        },
      ],
    },
    {
      id: "SPEAKER_00",
      text: " thế của anh là.",
      fromTime: 4000,
      toTime: 10000,
      emotion: [
        {
          key: " Angry",
          percent: 0.05,
        },
        {
          key: " Anxiety",
          percent: 0,
        },
        {
          key: " Happy",
          percent: 99.95,
        },
        {
          key: " Sad",
          percent: 0,
        },
        {
          key: " Neutral",
          percent: 0,
        },
      ],
    },
    {
      id: "SPEAKER_00",
      text: " nắng nóng nóng nóng nóng phủ.",
      fromTime: 4490,
      toTime: 6630,
      emotion: [
        {
          key: " Angry",
          percent: 1.62,
        },
        {
          key: " Anxiety",
          percent: 0,
        },
        {
          key: " Happy",
          percent: 96.14,
        },
        {
          key: " Sad",
          percent: 2.08,
        },
        {
          key: " Neutral",
          percent: 0.16,
        },
      ],
    },
    {
      id: "SPEAKER_01",
      text: " nóng nóng nóng ha hashd hda  hsda 2dsad 2 32 hcas hdas hdsa khsa hdsahd aksh daskh dkash dkahs nóng nóng nóng ha hashd hda  hsda 2dsad 2 32 hcas hdas hdsa khsa hdsahd aksh daskh dkash dkahs",
      fromTime: 20000,
      toTime: 30000,
      emotion: [
        {
          key: " Angry",
          percent: 85.28,
        },
        {
          key: " Anxiety",
          percent: 0,
        },
        {
          key: " Happy",
          percent: 10.83,
        },
        {
          key: " Sad",
          percent: 3.89,
        },
        {
          key: " Neutral",
          percent: 0,
        },
      ],
    },
  ],
  isOk: true,
  isError: false,
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
    uploadedFile,
    setPercentage,
    upload,
    isDarkMode,
    wavesurfer,
    setPlaying,
    duration,
    currentTime,
    setCurrentTime,
    setStartTime,
    startTime,
    setEndTime,
    endTime,
  } = useContext(Context);
  const [activeButtonId, setActiveButtonId] = useState(null);

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

  const handlePlayClick = (fromTime, toTime, index) => {
    if (wavesurfer) {
      if (activeButtonId === index && wavesurfer.isPlaying()) {
        wavesurfer.pause();
        setActiveButtonId(null); // Reset the active button ID to indicate it's paused
      } else {
        setStartTime(fromTime / 1000);
        setEndTime(toTime / 1000);
        wavesurfer.play(fromTime / 1000, toTime / 1000);
        setActiveButtonId(index); // Set the active button ID to indicate it's playing
      }
    }
  };

  return (
    <Content>
      <div
        className="converter-wrapper"
        style={{
          borderRadius: borderRadiusLG,
          background: "#f2f4f5",
          padding: " 0 1.5rem ",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24}>
            {/* {loading && (
              <div>
                <p
                  style={{
                    margin: "0.875rem 0 0 0 ",
                    padding: "4px",
                    fontSize: "16px",
                    color: isDarkMode ? "#fff" : "#000",
                    backgroundColor: "transparent",
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
                <Skeleton
                  active
                  style={{ marginTop: "0.625rem" }}
                  paragraph={{ rows: 3 }}
                  title
                  avatar
                />
              </div>
            )} */}
            {/* && !loading  */}
            {data1 && data1.object.length > 0 && (
              <List
                itemLayout="vertical"
                
                size="small"
                dataSource={data1.object}
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
                        height: "30px",
                      }}
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${item.id}`}
                        />
                      }
                      title={
                        <div
                          className="list-audio-wrapper"
                          style={{ color: isDarkMode ? "#fff" : "#000" }}
                        >
                          <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                            <Popover
                              padding="0"
                              color={isDarkMode ? "#1f1f1f" : "#ffff"}
                              content={() => (
                                <div>
                                  <AudioSegment
                                    key={item.id}
                                    itemId={item.id}
                                    fromTime={item.fromTime}
                                    toTime={item.toTime}
                                  />
                                </div>
                              )}
                              // title={`Đoạn từ ${item.fromTime / 1000} giây - ${
                              //   item.toTime / 1000
                              // } giây`}
                              trigger="click"
                            >
                              <Tooltip title="Xem phân đoạn">
                                <span
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {item.id}
                                </span>
                              </Tooltip>
                            </Popover>
                          </span>
                        </div>
                      }
                    />

                    <div className="transcription-wrapper">
                      <button
                        className="audio-crop--play"
                        onClick={() =>
                          handlePlayClick(item.fromTime, item.toTime, i)
                        }
                        style={{
                          color:
                            activeButtonId === i && wavesurfer.isPlaying()
                              ? "#ef5b1e"
                              : "",
                        }}
                      >
                        {activeButtonId === i && wavesurfer.isPlaying() ? (
                          <PauseOutlined />
                        ) : (
                          <CaretRightOutlined />
                        )}
                      </button>
                      <div className="transcription">
                        <span
                          style={{
                            color: isDarkMode ? "#fff" : "#000",
                            fontSize: "1.125rem",
                          }}
                        >
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
                        <span style={{ cursor: "pointer", marginLeft: "10px" }}>
                          {item?.emotion
                            .sort((a, b) => b.percent - a.percent)
                            .slice(0, 2)
                            .map((e, index) => (
                              <span
                                key={index}
                                style={{
                                  color: getEmotionColor(e.key.trim()),
                                  fontSize: "1rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "7.5rem",
                                  alignItems: "center",
                                }}
                              >
                                <span>{getEmotionName(e.key.trim())}</span>
                                <span
                                  style={{
                                    flex: "1 1 auto",
                                    minWidth: "50%",
                                    textAlign: "right",
                                  }}
                                >
                                  {": " + e.percent + "%"}
                                </span>
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
