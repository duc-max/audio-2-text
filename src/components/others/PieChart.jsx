import { Pie } from "@ant-design/charts";

const PieChart = () => {
  var data = [
    {
      type: "分类一",
      value: 27
    },
    {
      type: "分类二",
      value: 25
    },
    {
      type: "dat",
      value: 18
    },
    {
      type: "分类四",
      value: 15
    },
    {
      type: "分类五",
      value: 10
    },
    {
      type: "分类六",
      value: 25
    },
    {
      type: "分类七",
      value: 18
    },
    {
      type: "分类八",
      value: 15
    },
    {
      type: "分类九",
      value: 10
    },
    {
      type: "其他",
      value: 5
    }
  ];
  var config = {
    appendPadding: 50,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    autoFit: false,
    width:500,
    label: {
      type: "outer",
      content: "{name} {percentage}",
      style: {
        overflow: "visible"
      }
    },
    legend: {
      position: "bottom",
      flipPage: false,
      style: {
        textAlign: "center"
      }
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }]
  };
  return <Pie {...config} />;
};

export default PieChart;
