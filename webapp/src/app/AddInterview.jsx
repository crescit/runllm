import React, { useState } from 'react';
import Modal from 'react-modal';

const AddInterviewButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    content: {
      width: '50%', // Set your desired width
      height: '50%', // Set your desired height
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Center the modal
      background: 'rgba(0, 0, 0, 0.85)',
    },
  };

  return (
    <div>
      <button className={"button"} onClick={openModal}>Add Interview</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Interview Modal"
        style={customStyles} // Apply custom styles
      >
        <h2 style={{ textAlign: 'center' }}>Create Mock Interview</h2>
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: '#333',
            color: '#fff',
            fontSize: '18px',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={closeModal}
        >
          X
        </button>      
    </Modal>
    </div>
  );
};

export default AddInterviewButton;
