import { useContext } from "react";
import { Context } from "../../context/Context";
import PieChart from "./PieChart";
import { Modal } from "antd";
function Detailed(props) {
  const { open, setOpen } = useContext(Context);
  return (
    <Modal
      title="Modal 1000px width"
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={1000}
      height={1000}
    >
      <PieChart emotions={props.emotions} />
    </Modal>
  );
}

export default Detailed;
