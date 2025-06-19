# 🚀 [React Modal Windows](https://www.npmjs.com/package/react-modal-windows)

## 📦 **Owned by:** [Vu Tri Khoa](https://github.com/khoavutri) 

`react-modal-windows` is a lightweight, customizable, and feature-rich React library for creating draggable, resizable, and manageable modal windows. It supports a taskbar for minimized modals, z-index management, and flexible configurations, making it ideal for building desktop-like interfaces or complex UI workflows in web applications.

## ✨ Features

- ⚡ **Draggable and Resizable Modals**: Easily drag modals across the screen and resize them with eight directional handles, providing a smooth and intuitive user experience.
- 🛠️ **Taskbar Integration**: Includes a customizable taskbar (`TaskbarManager`) to manage minimized modals, with support for drag-and-drop taskbar positioning and modal state toggling.
- ✅ **Z-Index Management**: Automatically handles modal stacking order with a robust `modalManager` to bring modals to the front or adjust their z-index dynamically.
- 🔄 **Maximize, Minimize, and Close Controls**: Built-in buttons for maximizing, minimizing, and closing modals, with customizable icons and event handlers.
- 🔒 **Flexible and Extensible**: Offers a React hook (`useModal`) and components (`ReactWindowModal`, `Overlay`, `TaskbarManager`) for seamless integration and extensive customization.
- 🎨 **Styling and Theming**: Supports custom styles for modals, headers, content, taskbar buttons, and icons, allowing full control over the UI appearance.

## 📜 Demo

Explore `react-modal-windows` in action! The demo showcases draggable, resizable modals with a taskbar for managing minimized windows, mimicking a desktop-like interface.

📺 **Live Demo**: [react-modal-windows](https://react-modal-windows.vercel.app/) *(Update with your actual demo link)*

## 🖼️ **Screenshot**: Coming soon...

## 📜 API

The `react-modal-windows` library provides a powerful API for creating and managing modal windows in React applications. Below is an overview of the key components, hooks, and configuration options.

### Installation

Install via npm:

```bash
npm install react-modal-windows
```

*Note: The `uuid` package is a dependency and will be automatically installed.*

### Basic Usage

Create a modal window with the `useModal` hook and `ReactWindowModal` component:

```javascript
import React from "react";
import { useModal, ReactWindowModal, TaskbarManager } from "react-modal-windows";

const App = () => {
  const modal = useModal({ defaultOpen: true, defaultSize: { width: 600, height: 400 } });

  return (
    <div>
      <ReactWindowModal
        modal={modal}
        title="My Modal"
        taskbarIcon={<span>📄</span>}
        onCloseClick={modal.close}
        onMinimizeClick={() => modal.setIsMinimized(true)}
        onMaximizeClick={() => modal.setIsMaximized(true)}
        onRestoreClick={() => modal.setIsMaximized(false)}
      >
        <p>This is the modal content!</p>
      </ReactWindowModal>
      <TaskbarManager targetKey="my-app" />
    </div>
  );
};

export default App;
```

### Configuration Options

The `react-modal-windows` library leverages the `useModal` hook, `ReactWindowModal` component, `Overlay` component, and `TaskbarManager` component to create and manage modal windows. Below are the key configuration options.

#### `useModal` Hook Configuration

The `useModal` hook manages modal state and behavior. It accepts an optional `ModalConfig` object with the following properties:

- **`defaultOpen`**: `(Boolean)` - If `true`, the modal is open by default. Default is `false`.
- **`minSize`**: `(Size)` - Minimum modal size `{ width: number, height: number }`. Default is `{ width: 240, height: 120 }`.
- **`defaultSize`**: `(Size)` - Initial modal size `{ width: number, height: number }`. Default is `{ width: 400, height: 240 }`.
- **`initialZIndex`**: `(Number)` - Initial z-index for the modal. Default is `1001`.
- **`targetKey`**: `(String)` - Identifier for grouping modals in the taskbar. Optional.
- **`initialPosition`**: `(Position)` - Initial position `{ top: number, left: number }`. If not set, the modal is centered.

**Returns**: A `ModalContext` object with properties and methods like `isOpen`, `open`, `close`, `size`, `setSize`, `position`, `onResizeMouseDown`, `onHeaderMouseDown`, `isMaximized`, `isMinimized`, `taskbarIcon`, `setTaskbarIcon`, and more.

#### `ReactWindowModal` Component Props

The `ReactWindowModal` component renders a modal window with a header, content, and resize handles. It accepts the following props:

- **`modal`**: `(ModalContext)` - The modal context returned by `useModal`.
- **`title`**: `(String)` - Modal title displayed in the header.
- **`children`**: `(React.ReactNode)` - Content inside the modal.
- **`className`**: `(String)` - Additional CSS classes for the modal container.
- **`style`**: `(React.CSSProperties)` - Custom styles for the modal container.
- **`headerStyle`**: `(React.CSSProperties)` - Custom styles for the header.
- **`titleStyle`**: `(React.CSSProperties)` - Custom styles for the title.
- **`contentStyle`**: `(React.CSSProperties)` - Custom styles for the content area.
- **`closeIcon`**: `(React.ReactNode)` - Custom icon for the close button.
- **`minimizeIcon`**: `(React.ReactNode)` - Custom icon for the minimize button.
- **`maximizeIcon`**: `(React.ReactNode)` - Custom icon for the maximize button.
- **`restoreIcon`**: `(React.ReactNode)` - Custom icon for the restore button.
- **`taskbarIcon`**: `(React.ReactNode)` - Icon displayed in the taskbar.
- **`onCloseClick`**: `(Function)` - Custom handler for the close button. Defaults to `modal.toggle`.
- **`onMinimizeClick`**: `(Function)` - Custom handler for the minimize button. Defaults to toggling `isMinimized`.
- **`onMaximizeClick`**: `(Function)` - Custom handler for the maximize button. Defaults to toggling `isMaximized`.
- **`onRestoreClick`**: `(Function)` - Custom handler for the restore button. Defaults to toggling `isMaximized`.

#### `TaskbarManager` Component Props

The `TaskbarManager` component renders a taskbar for managing modals. It accepts the following props:

- **`targetKey`**: `(String)` - Filters modals by their `targetKey` for display in the taskbar.
- **`canDrag`**: `(Boolean)` - If `true`, the taskbar is draggable. Default is `true`.
- **`initialPosition`**: `(Position)` - Initial taskbar position `{ top: number, left: number }`. Defaults to bottom-center of the screen.
- **`style`**: `(React.CSSProperties)` - Custom styles for the taskbar container.
- **`className`**: `(String)` - Additional CSS classes for the taskbar.
- **`taskButtonStyle`**: `(React.CSSProperties)` - Custom styles for taskbar buttons.
- **`taskButtonClass`**: `(String)` - Additional CSS classes for taskbar buttons.
- **`styleIcon`**: `(React.CSSProperties)` - Custom styles for taskbar icons.
- **`classIcon`**: `(String)` - Additional CSS classes for taskbar icons.
- **`indicatorStyle`**: `(React.CSSProperties)` - Styles for the active modal indicator.
- **`indicatorClass`**: `(String)` - Additional CSS classes for the active modal indicator.
- **`indicatorMinimizedStyle`**: `(React.CSSProperties)` - Styles for the minimized modal indicator.

#### `Overlay` Component Props

The `Overlay` component renders a background overlay for modals. It accepts the following props:

- **`modal`**: `(ModalContext)` - The modal context returned by `useModal`.
- **`className`**: `(String)` - Additional CSS classes for the overlay.
- **`style`**: `(React.CSSProperties)` - Custom styles for the overlay.
- **`onClick`**: `(Function)` - Click handler for the overlay.

### Key Methods and Utilities

#### `useModal` Hook Methods

The `ModalContext` returned by `useModal` includes:

- **`open()`**: Opens the modal.
- **`close()`**: Closes the modal.
- **`toggle()`**: Toggles the modal's open state.
- **`setOpen(v: boolean)`**: Sets the modal's open state.
- **`setSize(size: Size)`**: Updates the modal's size.
- **`setPosition(position: Position | null)`**: Updates the modal's position.
- **`onResizeMouseDown(e: React.MouseEvent, direction: ResizeDirection)`**: Handles resize events for eight directions (`top-left`, `top-right`, `bottom-left`, `bottom-right`, `top`, `right`, `bottom`, `left`).
- **`onHeaderMouseDown(e: React.MouseEvent)`**: Handles drag events for the modal header.
- **`setIsMaximized(v: boolean)`**: Toggles the maximized state.
- **`setIsMinimized(v: boolean)`**: Toggles the minimized state.
- **`setTaskbarIcon(icon: ReactNode)`**: Sets the taskbar icon.
- **`setTitle(title: string)`**: Sets the modal title.

#### `modalManager` Utility

The `modalManager` is a singleton utility for managing modal state globally. It provides the following methods:

- **`registerModal(props: ModalEntry)`**: Registers a modal with the manager.
- **`unregisterModal(id: string)`**: Unregisters a modal.
- **`bringToFront(id: string)`**: Brings a modal to the front by updating its z-index.
- **`updateModal(id: string, updates: Partial<ModalEntry>)`**: Updates modal properties.
- **`getModalZIndex(id: string)`**: Returns the z-index of a modal.
- **`getTopModalId()`**: Returns the ID of the topmost modal.
- **`closeTopModal(onClose: (id: string) => void)`**: Closes the topmost modal.
- **`onChange(listener: Listener)`**: Subscribes to modal stack changes.
- **`getAllModals()`**: Returns all registered modals.
- **`getModalsByTargetKey(targetKey: string)`**: Returns modals filtered by `targetKey`. If `targetKey` is an empty string (""), returns all registered modals.

Example: Multiple Modals with Taskbar

### Example: Multiple Modals with Taskbar

This example demonstrates creating multiple modals with a taskbar to manage them:

```javascript
import React from "react";
import { useModal, ReactWindowModal, TaskbarManager, Overlay } from "../lib/main";

const App = () => {
  const modal1 = useModal({
    targetKey: "my-app",
    defaultOpen: true,
    defaultSize: { width: 500, height: 300 },
    initialPosition: { top: 100, left: 100 },
  });
  const modal2 = useModal({
    targetKey: "my-app",
    defaultSize: { width: 400, height: 250 },
    initialPosition: { top: 150, left: 150 },
  });

  return (
    <div>
      <button onClick={modal2.open}>Open Second Modal</button>
      <ReactWindowModal
        modal={modal1}
        title={`khoa dev`}
      >
        <Overlay onClick={() => modal1.close()} />
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
            }}
          >
            Add more
          </button>
        </div>
      </ReactWindowModal >
      <ReactWindowModal
        modal={modal2}
        title="Second Modal"
        taskbarIcon={<span>📚</span>}
        style={{ border: "2px solid #28a745" }}
      >
        <p>Content of the second modal.</p>
      </ReactWindowModal>
      <TaskbarManager
        targetKey="my-app"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
        taskButtonStyle={{ padding: "8px" }}
        indicatorStyle={{ backgroundColor: "#007bff" }}
      />
    </div>
  );
};

export default App;
```

This example:

- Creates two modals with different sizes and positions.
- Groups them under the same `targetKey` for taskbar management.
- Customizes the taskbar and modal styles.
- Allows opening the second modal via a button.

For a complete API reference, see the [GitHub repository](https://github.com/khoavutri/react-modal-windows).

---

## 📞 Support

💌 **Email:** Reach out to me at [khoavutri@gmail.com](mailto:khoavutri@gmail.com)  
🐛 **GitHub Issues:** Found a bug or have a suggestion? [Open an issue here](https://github.com/khoavutri/react-modal-windows/issues)  
💬 **Community Chat:** Join the discussion on [Facebook](https://www.facebook.com/company.dev.khoa)