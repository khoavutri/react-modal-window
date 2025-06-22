import React, { isValidElement, useEffect, useState, useCallback, useRef, memo } from "react";
import styles from "./style.module.css";
import { modalManager } from "./modal-manager";
import { ModalEntry, Position } from "./modal.type";

type Props = {
  targetKey: string;
  canDrag?: boolean;
  initialPosition?: Position;
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

type DragState = {
  isDragging: boolean;
  dragStart: { x: number; y: number };
  startPosition: Position;
};

const TaskbarManager: React.FC<Props> = ({
  canDrag,
  initialPosition,
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
  const drag = canDrag !== false;
  const [data, setData] = useState<Array<ModalEntry>>([]);
  const [maxZIndex, setMaxZIndex] = useState<number>(1001);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    startPosition: { top: 0, left: 0 }
  });

  const taskBarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleButtonClick = (id: string) => {
    if (dragState.isDragging) return;

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

  const calculateNewPosition = useCallback((mouseX: number, mouseY: number): Position | null => {
    if (!taskBarRef.current || !position) return position;

    const rect = taskBarRef.current.getBoundingClientRect();
    const deltaX = mouseX - dragState.dragStart.x;
    const deltaY = mouseY - dragState.dragStart.y;

    let newLeft = dragState.startPosition.left + deltaX;
    let newTop = dragState.startPosition.top + deltaY;

    // Constraints để không cho taskbar ra khỏi màn hình
    const minLeft = -rect.width / 2; // Cho phép drag một nửa ra ngoài
    const maxLeft = window.innerWidth - rect.width / 2;
    const minTop = 0;
    const maxTop = window.innerHeight - rect.height;

    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    newTop = Math.max(minTop, Math.min(maxTop, newTop));

    return { left: newLeft, top: newTop };
  }, [dragState, position]);

  // Animation frame cho drag mượt
  const updateDragPosition = useCallback(() => {
    if (!dragState.isDragging) return;

    const newPosition = calculateNewPosition(
      lastMousePosition.current.x,
      lastMousePosition.current.y
    );

    setPosition(newPosition);
    animationFrameRef.current = requestAnimationFrame(updateDragPosition);
  }, [dragState.isDragging, calculateNewPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!drag || !position) return;

    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    e.stopPropagation();

    setDragState({
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
      startPosition: { ...position }
    });

    lastMousePosition.current = { x: e.clientX, y: e.clientY };

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [drag, position]);

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setDragState(prev => ({ ...prev, isDragging: false }));

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateDragPosition);

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dragState.isDragging, updateDragPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!drag || !position || e.touches.length !== 1) return;

    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();

    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      dragStart: { x: touch.clientX, y: touch.clientY },
      startPosition: { ...position }
    });

    lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
  }, [drag, position]);

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();

      const touch = e.touches[0];
      lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setDragState(prev => ({ ...prev, isDragging: false }));

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState.isDragging]);

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
  }, [targetKey]);

  useEffect(() => {
    if (taskBarRef.current && position === null) {
      setPosition(prev => {
        if (prev) return prev;
        const rect = taskBarRef.current?.getBoundingClientRect();

        return initialPosition || {
          top: window.innerHeight - 20 - (rect?.height || 50),
          left: (window.innerWidth - (rect?.width || 50)) / 2,
        };
      });
    }
  }, [taskBarRef.current, initialPosition]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      ref={taskBarRef}
      className={`${styles.taskbarManager}${className ? " " + className : ""}`}
      style={{
        zIndex: maxZIndex + 50,
        ...style,
        ...(drag ? {
          position: 'fixed',
          top: position ? position.top : 0,
          left: position ? position.left : 0,
          cursor: dragState.isDragging ? 'grabbing' : 'grab',
          transition: dragState.isDragging ? 'none' : 'transform 0.2s ease-out',
          transform: dragState.isDragging ? 'scale(1.02)' : 'scale(1)',
          boxShadow: dragState.isDragging
            ? '0 6px 20px rgba(0, 0, 0, 0.2)'
            : '0 4px 16px rgba(0, 0, 0, 0.15)',
        } : {})
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
            title={item.title}
            className={`${styles.taskbarButton} ${taskButtonClass || ""}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleButtonClick(item.id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              ...taskButtonStyle,
              pointerEvents: dragState.isDragging ? 'none' : 'auto',
            }}
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
                  fill="#B0B0B0"
                />
                <path
                  d="M4 17a3 3 0 0 1 3-3h10l3 4h21a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V17z"
                  fill="#A0A0A0"
                />
                <rect
                  x="4"
                  y="14"
                  width="40"
                  height="6"
                  rx="3"
                  fill="#D3D3D3"
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

export default memo(TaskbarManager);