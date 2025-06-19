import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  defaultMinSize,
  ModalConfig,
  ModalContext,
  ResizeDirection,
} from "./modal.type";
import { v4 as uuidv4 } from "uuid";
import { modalManager } from "./modal-manager";
export const useModal = (config?: ModalConfig): ModalContext => {
  const idRef = useRef(uuidv4());
  const id = idRef.current;

  const initalZIndex =
    config && config.initalZIndex ? config.initalZIndex : 1001;

  const minSize = config && config.minSize ? config.minSize : defaultMinSize;
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(
    config && config?.defaultOpen ? config.defaultOpen : false
  );
  const [zIndex, setZIndex] = useState(initalZIndex);
  const [size, setSize] = useState(
    config && config.defaultSize
      ? config.defaultSize
      : { width: 400, height: 240 }
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [taskbarIcon, setTaskbarIcon] = useState<ReactNode>(null)
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const setOpen = useCallback((v: boolean) => setIsOpen(v), []);

  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0, top: 0, left: 0 });

  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, top: 0, left: 0 });

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      e.stopPropagation();
      e.preventDefault();
      resizing.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startSize.current = {
        width: size.width,
        height: size.height,
        top: position.top,
        left: position.left,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizing.current) return;
        const dx = ev.clientX - startPos.current.x;
        const dy = ev.clientY - startPos.current.y;

        let newWidth = startSize.current.width;
        let newHeight = startSize.current.height;
        let newTop = startSize.current.top;
        let newLeft = startSize.current.left;

        switch (direction) {
          case "right":
            newWidth = Math.max(minSize.width, startSize.current.width + dx);
            break;
          case "left":
            newLeft = startSize.current.left + dx;
            newWidth = Math.max(minSize.width, startSize.current.width - dx);
            break;
          case "bottom":
            newHeight = Math.max(minSize.height, startSize.current.height + dy);
            break;
          case "top":
            newHeight = Math.max(minSize.height, startSize.current.height - dy);
            newTop = startSize.current.top + dy;
            break;
          case "top-left":
            newWidth = Math.max(minSize.width, startSize.current.width - dx);
            newLeft = startSize.current.left + dx;
            newHeight = Math.max(minSize.height, startSize.current.height - dy);
            newTop = startSize.current.top + dy;
            break;
          case "top-right":
            newWidth = Math.max(minSize.width, startSize.current.width + dx);
            newHeight = Math.max(minSize.height, startSize.current.height - dy);
            newTop = startSize.current.top + dy;
            break;
          case "bottom-left":
            newWidth = Math.max(minSize.width, startSize.current.width - dx);
            newLeft = startSize.current.left + dx;
            newHeight = Math.max(minSize.height, startSize.current.height + dy);
            break;
          case "bottom-right":
            newWidth = Math.max(minSize.width, startSize.current.width + dx);
            newHeight = Math.max(minSize.height, startSize.current.height + dy);
            break;
          default:
            break;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ top: newTop, left: newLeft });
      };

      const onMouseUp = () => {
        resizing.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [size, position]
  );

  const onHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        top: position.top,
        left: position.left,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        setIsMaximized((prev) => {
          if (prev) {
            const newLeft = (e.clientX - size.width / 2);
            const newTop = e.clientY - 15;
            setPosition({ top: newTop, left: newLeft });
            dragStart.current.top = newTop;
            dragStart.current.left = newLeft;
          } else {
            const dx = ev.clientX - dragStart.current.x;
            const dy = ev.clientY - dragStart.current.y;
            setPosition({
              top: dragStart.current.top + dy,
              left: dragStart.current.left + dx,
            });
          }
          return false;
        });
      };

      const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [position]
  );

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: Math.max(0, (window.innerHeight - rect.height) / 2),
        left: Math.max(0, (window.innerWidth - rect.width) / 2),
      });
    }
  }, [isOpen]);

  useEffect(() => {
    modalManager.registerModal({
      id,
      ref,
      isOpen,
      setOpen,
      isMinimized,
      setIsMinimized,
      setZIndex,
      taskbarIcon,
      targetKey: config?.targetKey
    });
    return () => modalManager.unregisterModal(id);
  }, [id]);

  useEffect(() => {
    modalManager.updateModal(id, { isOpen, isMinimized, taskbarIcon });
  }, [isOpen, isMinimized, taskbarIcon]);

  return {
    id,
    ref,
    isOpen,
    open,
    close,
    toggle,
    setOpen,
    size,
    setSize,
    position,
    setPosition,
    onResizeMouseDown,
    onHeaderMouseDown,
    minSize,
    isMaximized,
    setIsMaximized,
    zIndex,
    isMinimized,
    setIsMinimized,
    taskbarIcon,
    setTaskbarIcon,
    targetKey: config?.targetKey
  };
};
