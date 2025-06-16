import { useState } from 'react';
import { ReactWindowModal } from '../lib/react-window-modal/react-window-modal';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>
      <ReactWindowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Modal"
        showOverlay={false}
      >
        <p>This is the modal content.</p>
      </ReactWindowModal>
    </div>
  );
};

export default App;