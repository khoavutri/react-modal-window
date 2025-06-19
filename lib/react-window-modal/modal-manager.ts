import { Listener, ModalEntry, ModalManager } from "./modal.type";

export const modalManager: ModalManager = (() => {
    let stack: ModalEntry[] = [];
    const listeners: Listener[] = [];

    const emitChange = () => {
        listeners.forEach((listener) => listener());
        stack.forEach((modal, index) => {
            modal.setZIndex?.(1001 + index * 2);
        });
    };

    const onChange = (listener: Listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index !== -1) listeners.splice(index, 1);
        };
    };

    const registerModal = (props: ModalEntry): number => {
        if (!props.id) throw new Error("Modal ID is required");
        if (!stack.find((modal) => modal.id === props.id)) {
            stack.push(props);
            emitChange();
        }
        return getModalZIndex(props.id);
    };

    const unregisterModal = (id: string) => {
        stack = stack.filter((modal) => modal.id !== id);
        emitChange();
    };

    const bringToFront = (id: string): number => {
        const item = stack.find((it) => it.id === id);
        if (item) {
            stack = stack.filter((modal) => modal.id !== id);
            stack.push(item);
            emitChange();
        }
        return getModalZIndex(id);
    };

    const updateModal = (id: string, updates: Partial<ModalEntry>) => {
        const index = stack.findIndex((modal) => modal.id === id);
        if (index !== -1) {
            stack[index] = { ...stack[index], ...updates };
            emitChange();
        }
    };

    const getModalZIndex = (id: string): number => {
        if (!id) return 0;
        const index = stack.findIndex((modal) => modal.id === id);
        if (index === -1) return 0;
        return 1001 + index * 2;
    };

    const getTopModalId = (): string | undefined => {
        return stack.length ? stack[stack.length - 1].id : undefined;
    };

    const closeTopModal = (onClose: (id: string) => void) => {
        const topId = getTopModalId();
        if (topId) {
            onClose(topId);
            unregisterModal(topId);
        }
    };

    const getAllModals = (): ModalEntry[] => {
        return [...stack];
    };

    const getModalsByTargetKey = (targetKey: string): ModalEntry[] => {
        if (targetKey === "") return [...stack];
        return [...stack.filter(item => item.targetKey !== undefined &&
            item.targetKey !== null &&
            item.targetKey === targetKey)];
    };

    return {
        registerModal,
        unregisterModal,
        bringToFront,
        updateModal,
        getModalZIndex,
        getTopModalId,
        closeTopModal,
        onChange,
        getAllModals,
        getModalsByTargetKey
    };
})();