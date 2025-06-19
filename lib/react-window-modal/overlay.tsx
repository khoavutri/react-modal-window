import React, { CSSProperties } from "react";
import styles from "./style.module.css";
import { ModalContext } from "./modal.type";

export type OverlayProps = {
  modal?: ModalContext;
} & React.HTMLAttributes<HTMLDivElement>;

export const Overlay: React.FC<OverlayProps> = ({
  modal,
  className = "",
  onClick,
  style = {},
  ...props
}) => {
  const defaultStyle: CSSProperties = {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  };
  const zIndex =
    typeof modal?.ref.current?.style.zIndex === "string" &&
      !isNaN(Number(modal.ref.current.style.zIndex)) &&
      modal.ref.current.style.zIndex !== ""
      ? Number(modal.ref.current.style.zIndex) - 1
      : defaultStyle.zIndex;
  if (!modal) return null;
  return (
    <div
      className={`${styles.overlay} ${className}`}
      onClick={(e) => {
        onClick && onClick(e);
      }}
      {...props}
      style={{
        ...defaultStyle,
        background: "rgba(0,0,0,0.1)",
        zIndex,
        ...style,
      }}
    />
  );
};
