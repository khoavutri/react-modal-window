import { memo, useEffect } from "react";
import { Overlay, ReactWindowModal, useModal } from "../lib/main";

const RecursiveAlgorithm = ({
  showOverlay,
  setCount,
  index,
}: {
  showOverlay: boolean;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}) => {
  const modal = useModal({ targetKey: `${index}` });

  useEffect(() => {
    modal.open();
  }, []);

  return (
    <ReactWindowModal modal={modal} title={`khoa dev ${index}`}>
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
          style={{ width: 120, height: 35 }}
          onClick={() => setCount((prev) => prev + 1)}
        >
          Add more
        </button>
      </div>
    </ReactWindowModal>
  );
};

export default memo(RecursiveAlgorithm);
