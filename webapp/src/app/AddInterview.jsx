import React, { useState } from 'react';
import Modal from 'react-modal';
import DirectoryPicker from './directorypicker'

const AddInterviewButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [numericValue, setNumericValue] = useState(5);

  const increaseValue = () => {
    setNumericValue((prevValue) => prevValue + 1);
  };

  const decreaseValue = () => {
    setNumericValue((prevValue) => Math.max(0, prevValue - 1));
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
        <div style={{display:'flex', flexDirection: 'row'}}>
            <container style={{display:'flex', flexDirection: 'column', marginRight: '10px', marginTop: '25px'}}>
                <div>
                    <h3>Upload Resume</h3>
                    <DirectoryPicker file_type={'RESUME'}/>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <h3>Add Job Description</h3>
                    <DirectoryPicker file_type={'JOB'}/>
                </div>
            </container>
            <container style={{display:'flex', flexDirection: 'column', marginLeft: '10px', marginTop: '25px' }}>
                <h3 style={{ marginBottom: '15px' }}>Position</h3>
                <input
                    type="text"
                    id="positionBox"
                    name="positionBox"
                    aria-label="Enter job position here"
                    placeholder="Enter job position here"
                />
                <h3 style={{ marginBottom: '15px', marginTop: '15px' }}>Interview Length (min.)</h3>
                <input
                    type="number"
                    id="numericInput"
                    name="interviewLength"
                    aria-label="Enter interview length numeric minutes"
                    min="3"
                    step="1"
                />
                <h3 style={{ marginBottom: '15px' }} for="dropdown">Interview Type</h3>
                <select id="dropdown" name="dropdown" aria-label="Select an interview type" defaultValue={""}>
                    <option value="" disabled selected hidden>
                        Select an option
                    </option>
                    <option value="PHONE_SCREEN">Phone Screen</option>
                    <option value="BEHAVIORAL">Behavioral Interview</option>
                    <option value="CASE">Case Interview</option>
                </select>
            </container>
        </div>

        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: '#333  ',
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
