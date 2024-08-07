import React from "react";
const { Content } = Layout;
import { Layout, theme } from "antd";
import { useContext } from "react";
import { Context } from "../context/Context";
import { Avatar, List, Skeleton, Switch } from "antd";
const listData = Array.from({
  length: 3,
}).map((_, i) => ({
  href: "https://ant.design",
  title: `file name.mp3`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: ["Emotions", "Happy"],
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

function Converter() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { loading, setLoading } = useContext(Context);
  const onChange = (checked) => {
    setLoading(!checked);
  };
  return (
    <Content
      style={{
        margin: "24px 16px 0",
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Switch
          checked={!loading}
          onChange={onChange}
          style={{
            marginBottom: 16,
          }}
        />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={listData}
          renderItem={(item) => (
            <List.Item key={item.title}>
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={`${item.description[0]} : ${item.description[1]}`}
                />
                {item.content}
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </Content>
  );
}
export default Converter;
