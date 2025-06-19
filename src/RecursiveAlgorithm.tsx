import { memo, useEffect } from "react";
import { Overlay, ReactWindowModal, useModal } from "../lib/main";

const RecursiveAlgorithm = ({
  showOverlay,
  setCount,
  index,
  customUI
}: {
  showOverlay: boolean;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  customUI: boolean;
}) => {
  const modal = useModal({ targetKey: `${index % 2}` });
  const customModalStyle = {
    backgroundColor: "#2d2d2d",
    color: "#e0e0e0"
  }

  const customHeaderStyle = {
    borderBottom: "1px solid #444",
  }

  useEffect(() => {
    modal.open();
  }, []);

  return (
    <ReactWindowModal
      modal={modal}
      title={`khoa dev ${index}`}
      style={customUI ? customModalStyle : {}}
      headerStyle={customUI ? customHeaderStyle : {}}
    >
      {showOverlay && <Overlay onClick={() => modal.close()} />}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            width: 120,
            height: 35,
            backgroundColor: customUI ? "#444" : "#f0f0f0",
            color: customUI ? "#e0e0e0" : "#000",
          }}
          onClick={() => setCount((prev) => prev + 1)}
        >
          Add more
        </button>
      </div>
    </ReactWindowModal>
  );
};

export default memo(RecursiveAlgorithm);
