import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from "react";
import styles from "./style.module.css";
import { ModalContext } from "./modal.type";
import { Overlay } from "./overlay";

export type ReactWindowModalProps = {
  modal: ModalContext;
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  closeIcon?: React.ReactNode;
  minimizeIcon?: React.ReactNode;
  maximizeIcon?: React.ReactNode;
  restoreIcon?: React.ReactNode;
  taskbarIcon?: React.ReactNode;
};

export const ReactWindowModal = ({
  modal,
  title,
  children,
  className = "",
  style = {},
  headerStyle = {},
  titleStyle = {},
  contentStyle = {},
  closeIcon,
  minimizeIcon,
  maximizeIcon,
  restoreIcon,
  taskbarIcon,
}: ReactWindowModalProps) => {
  const [border, setBorder] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    if (modal.ref && modal.ref?.current) {
      if (modal.isMaximized && modal.ref?.current) {
        const computed = getComputedStyle(modal.ref.current);
        const top = parseFloat(computed.borderTopWidth) || 0;
        const bottom = parseFloat(computed.borderBottomWidth) || 0;
        const left = parseFloat(computed.borderLeftWidth) || 0;
        const right = parseFloat(computed.borderRightWidth) || 0;

        setBorder({ top, left, bottom, right });
      }
    }
    modal.setTaskbarIcon(taskbarIcon);
  }, [modal.isMaximized]);

  if (!modal.isOpen) return null;
  let overlay: React.ReactNode = null;
  const contentChildren: React.ReactNode[] = [];
  const modalList: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Overlay) {
        overlay = cloneElement(child, { ...child.props, modal });
      } else if (child.type === ReactWindowModal) {
        modalList.push(child);
      } else {
        contentChildren.push(child);
      }
    } else {
      contentChildren.push(child);
    }
  });

  return (
    <>
      {overlay && !modal.isMinimized && overlay}
      {modalList}
      {!modal.isMinimized && (
        <div
          ref={modal.ref}
          className={`${styles.modal} ${className || ""}`}
          style={{
            ...(style || {}),
            position: "fixed",
            ...(modal.isMaximized
              ? {
                width: `calc(100vw - ${border.left + border.right}px)`,
                height: `calc(100vh - ${border.top + border.bottom}px)`,
                top: 0,
                left: 0,
              }
              : {
                width: modal.size.width,
                height: modal.size.height,
                top: modal.position.top,
                left: modal.position.left,
              }),
            zIndex: modal.zIndex,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className={styles.headerContainer}
            onMouseDown={modal.onHeaderMouseDown}
            style={headerStyle}
          >
            {title && (
              <h2 className={styles.title} style={titleStyle}>
                {title}
              </h2>
            )}

            <div className={styles.buttonContainer}>
              <button
                className={styles.iconButton}
                aria-label="Ẩn modal"
                type="button"
                onClick={() => modal.setIsMinimized((prev) => !prev)}
              >
                {minimizeIcon || (
                  <svg
                    className={styles.icon}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line
                      x1="6"
                      y1="10"
                      x2="14"
                      y2="10"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>

              {!modal.isMaximized && (
                <button
                  className={styles.iconButton}
                  aria-label="Phóng to modal"
                  onClick={() => {
                    modal.setIsMaximized((prev) => !prev);
                  }}
                  type="button"
                >
                  {maximizeIcon || (
                    <svg
                      className={styles.icon}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="5" y="5" width="10" height="10" rx="2" />
                    </svg>
                  )}
                </button>
              )}

              {modal.isMaximized && (
                <button
                  className={styles.iconButton}
                  aria-label="Thu nhỏ modal"
                  onClick={() => {
                    modal.setIsMaximized((prev) => !prev);
                  }}
                  type="button"
                >
                  {restoreIcon || (
                    <svg
                      className={styles.icon}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="5" y="5" width="10" height="10" rx="2" />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={modal.toggle}
                className={styles.iconButton}
                aria-label="Đóng modal"
              >
                {closeIcon || (
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className={styles.content} style={contentStyle}>
            {contentChildren}
          </div>

          <div
            className={styles.handleTopLeft}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "top-left")}
          />
          <div
            className={styles.handleTopRight}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "top-right")}
          />
          <div
            className={styles.handleBottomLeft}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "bottom-left")}
          />
          <div
            className={styles.handleBottomRight}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "bottom-right")}
          />

          {/* Handles 4 cạnh */}
          <div
            className={styles.handleTop}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "top")}
          />
          <div
            className={styles.handleRight}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "right")}
          />
          <div
            className={styles.handleBottom}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "bottom")}
          />
          <div
            className={styles.handleLeft}
            onMouseDown={(e) => modal.onResizeMouseDown(e, "left")}
          />
        </div>
      )}
    </>
  );
};
