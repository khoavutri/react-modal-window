import { Dispatch, ReactNode, RefObject } from "react";

export type ModalEntry = {
    id: string;
    ref: RefObject<HTMLDivElement>;
    isOpen: boolean;
    setOpen: (v: boolean) => void;
    isMinimized: boolean;
    setIsMinimized: Dispatch<React.SetStateAction<boolean>>;
    setZIndex?: (zIndex: number) => void;
    taskbarIcon?: ReactNode;
    targetKey: string | null | undefined;
    title?: string;
};

export type Size = {
    width: number,
    height: number
}

export type Position = {
    top: number;
    left: number;
};

export type ResizeDirection =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top"
    | "right"
    | "bottom"
    | "left";

export type ModalConfig = {
    defaultOpen?: boolean;
    minSize?: Size;
    defaultSize?: Size;
    initialZIndex?: number;
    targetKey?: string;
    initialPosition?: Position;
};

export const defaultMinSize = {
    width: 240,
    height: 120
}

export type ModalContext = {
    id: string,
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (v: boolean) => void;
    size: Size;
    setSize: Dispatch<React.SetStateAction<Size>>;
    position: Position;
    setPosition: Dispatch<React.SetStateAction<Position | null>>;
    onResizeMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void;
    onHeaderMouseDown: (e: React.MouseEvent) => void;
    minSize: Size;
    isMaximized: boolean;
    setIsMaximized: Dispatch<React.SetStateAction<boolean>>;
    ref: RefObject<HTMLDivElement>;
    zIndex: number;
    isMinimized: boolean;
    setIsMinimized: Dispatch<React.SetStateAction<boolean>>;
    taskbarIcon: ReactNode;
    setTaskbarIcon: Dispatch<React.SetStateAction<ReactNode>>;
    targetKey: string | null | undefined;
    setTitle: Dispatch<React.SetStateAction<string>>;
};

export type Listener = () => void;

export type ModalManager = {
    registerModal: (props: ModalEntry) => number;
    unregisterModal: (id: string) => void;
    bringToFront: (id: string) => number;
    updateModal: (id: string, updates: Partial<ModalEntry>) => void;
    getModalZIndex: (id: string) => number;
    getTopModalId: () => string | undefined;
    closeTopModal: (onClose: (id: string) => void) => void;
    onChange: (listener: Listener) => () => void;
    getAllModals: () => ModalEntry[];
    getModalsByTargetKey: (targetKey: string) => ModalEntry[];
    taskbarIcon?: ReactNode;
};
