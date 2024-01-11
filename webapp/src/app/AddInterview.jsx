import React, { useState } from 'react';
import Modal from 'react-modal';
import DirectoryPicker from './directorypicker';

const AddInterviewButton = ({ userID }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [numericValue, setNumericValue] = useState(5);
  const [interviewLength, setInterviewLength] = useState(30);
  const [job_title, setJob_title] = useState('e.g. Software Engineer');
  const [company_name, setCompany_name] = useState('e.g. Microsoft');
  const [user_id, setUser_id] = useState({/* to add */});
  const [user_name, setUser_name] = useState('e.g. John Doe');

  const increaseValue = () => {
    setNumericValue((prevValue) => prevValue + 1);
  };

  const decreaseValue = () => {
    setNumericValue((prevValue) => Math.max(0, prevValue - 1));
  };

  const handleInterviewLengthChange = (event) => {
    setInterviewLength(event.target.value);
  };

  const handleJobTitleChange = (event) => {
    setJob_title(event.target.value);
  };

  const handleCompanyNameChange = (event) => {
    setCompany_name(event.target.value);
  };

  const handleUserIdChange = (event) => {
    setUser_id(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUser_name(event.target.value);
  };

  const customStyles = {
    content: {
      width: '50%', // Set your desired width
      height: '50%', // Set your desired height
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Center the modal
      background: 'rgba(0, 0, 0, 1)',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  return (
    <div>
      <button className={'button'} onClick={openModal}>
        Add Interview
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Add Interview Modal'
        style={customStyles} // Apply custom styles
      >
        <h2 style={{ textAlign: 'center', color: 'white' }}>
          Create Mock Interview
        </h2>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <container
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginRight: '10px',
              marginTop: '25px',
            }}
          >
            <h3 style={{ marginBottom: '15px', color: 'white' }}>Name</h3>
            <input
              type='text'
              id='usernameBox'
              name='usernameBox'
              aria-label='e.g. John Doe'
              placeholder='e.g. John Doe'
              value={user_name}
              onChange={handleUserNameChange}
            />
            <h3 style={{ marginBottom: '15px', color: 'white', marginTop: '15px' }}>Company</h3>
            <input
              type='text'
              id='companyBox'
              name='companyBox'
              aria-label='e.g. Microsoft'
              placeholder='e.g. Microsoft'
              value={company_name}
              onChange={handleCompanyNameChange}
            />
            <div style={{ color: 'white', marginTop: '15px' }}>
              <h3>Upload Resume</h3>
              <DirectoryPicker file_type={'RESUME'} userID={'d0bd5d2a-3392-4eb7-b8f3-455f2d85292e'} jobTitle={job_title} companyName={company_name} userName={user_name}/>
            </div>
            <div style={{ marginTop: '15px', color: 'white' }}>
              <h3>Add Job Description</h3>
              <DirectoryPicker file_type={'JOB'} userID={'d0bd5d2a-3392-4eb7-b8f3-455f2d85292e'} jobTitle={job_title} companyName={company_name} userName={user_name}/>
            </div>
          </container>
          <container
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '10px',
              marginTop: '25px',
              color: 'white',
            }}
          >
            <h3 style={{ marginBottom: '15px' }}>Position</h3>
            <input
              type='text'
              id='positionBox'
              name='positionBox'
              aria-label='e.g. Software Engineer'
              placeholder='e.g. Software Engineer'
              value={job_title}
              onChange={handleJobTitleChange}
            />
            <h3 style={{ marginBottom: '15px', marginTop: '15px' }}>
              Interview Length (min.)
            </h3>
            <input
              type='number'
              id='numericInput'
              name='interviewLength'
              aria-label='Enter interview length numeric minutes'
              min='3'
              step='1'
              value={interviewLength}
              onChange={handleInterviewLengthChange}
            />
            <h3 style={{ marginBottom: '15px', marginTop: '15px' }} for='dropdown'>
              Interview Type
            </h3>
            <select
              id='dropdown'
              name='dropdown'
              aria-label='Select an interview type'
              defaultValue={''}
            >
              <option value='' disabled selected hidden>
                Select an option
              </option>
              <option value='PHONE_SCREEN'>Phone Screen</option>
              <option value='BEHAVIORAL'>Behavioral Interview</option>
              <option value='CASE'>Case Interview</option>
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

        <button
          style={{
            margin: '43% 50%',
            margin: '40% 50%',
            width: '30px',
            height: '30px',
            backgroundColor: '#333  ',
            color: 'red',
            fontSize: '18px',
            border: '5px solid black ',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            padding: '10px 60px',
          }}
          onClick={closeModal}
        >
          Submit
        </button>
      </Modal>
    </div>
  );
};

export default AddInterviewButton;
