import React, { isValidElement, useEffect, useState } from "react";
import styles from "./style.module.css";
import { modalManager } from "./modal-manager";
import { ModalEntry } from "./modal.type";

type Props = {
  targetKey: string;
  style?: React.CSSProperties;
  className?: string;
  taskButtonStyle?: React.CSSProperties;
  taskButtonClass?: string;
  styleIcon?: React.CSSProperties;
  classIcon?: string;
  indicatorStyle?: React.CSSProperties;
  indicatorClass?: string;
  indicatorMinimizedStyle?: React.CSSProperties;
};

export const TaskbarManager: React.FC<Props> = ({
  targetKey,
  style,
  className,
  taskButtonStyle,
  taskButtonClass,
  styleIcon,
  classIcon,
  indicatorStyle,
  indicatorClass,
  indicatorMinimizedStyle,
}) => {
  const [data, setData] = useState<Array<ModalEntry>>([]);
  const [maxZIndex, setMaxZIndex] = useState<number>(1001);

  useEffect(() => {
    const unsubscribe = modalManager.onChange(() => {
      const filterList = modalManager.getModalsByTargetKey(targetKey);

      setData(filterList);
      const maxZ = Math.max(
        ...modalManager.getAllModals().map((modal) => {
          const zIndex = modal.ref.current?.style.zIndex;
          return zIndex ? parseInt(zIndex, 10) : 1001;
        })
      );
      setMaxZIndex(maxZ);
    });
    const filterList = modalManager.getModalsByTargetKey(targetKey);
    setData(filterList);
    const maxZ = Math.max(
      ...modalManager.getAllModals().map((modal) => {
        const zIndex = modal.ref.current?.style.zIndex;
        return zIndex ? parseInt(zIndex, 10) : 1001;
      })
    );
    setMaxZIndex(maxZ);

    return unsubscribe;
  }, []);

  const handleButtonClick = (id: string) => {
    const modal = data.find((item) => item.id === id);
    if (modal) {
      if (modal.isMinimized) {
        modal.setIsMinimized?.(false);
      } else if (modal.isOpen) {
        modal.setIsMinimized?.(true);
      } else {
        modal.setOpen?.(true);
      }
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.taskbarManager}${className ? " " + className : ""}`}
      style={{ zIndex: maxZIndex + 50, ...style }}
    >
      {data.map((item) => {
        const StyledTaskbarIcon = isValidElement(item.taskbarIcon)
          ? React.cloneElement(
            item.taskbarIcon as React.ReactElement<{
              style?: React.CSSProperties;
              className?: string;
            }>,
            {
              className: `${styles.icon} ${classIcon || ""}`,
              style: styleIcon,
            }
          )
          : item.taskbarIcon;

        return (
          <button
            key={item.id}
            className={`${styles.taskbarButton} ${taskButtonClass || ""}`}
            onClick={() => handleButtonClick(item.id)}
            title={item.id}
            style={taskButtonStyle}
          >
            {StyledTaskbarIcon || (
              <svg
                className={`${styles.icon} ${classIcon || ""}`}
                style={styleIcon}
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="14"
                  width="40"
                  height="26"
                  rx="3"
                  fill="#FBC02D"
                />
                <path
                  d="M4 17a3 3 0 0 1 3-3h10l3 4h21a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V17z"
                  fill="#FFD54F"
                />
                <rect
                  x="4"
                  y="14"
                  width="40"
                  height="6"
                  rx="3"
                  fill="#FFF9C4"
                />
              </svg>
            )}
            {item.isOpen && (
              <span
                style={
                  item.isMinimized ? indicatorMinimizedStyle : indicatorStyle
                }
                className={`${indicatorClass} ${styles.activeIndicator} ${item.isMinimized ? styles.minimized : ""
                  }`}
              ></span>
            )}
          </button>
        );
      })}
    </div>
  );
};
