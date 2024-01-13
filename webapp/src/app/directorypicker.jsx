import React, { useState, useEffect, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import { langServerUrl  } from './globals';

const AcceptMaxFiles = ({ file_type, userID, jobTitle, companyName, userName, ...props }) => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [FILETYPE, setFile] = useState()
  const [JOBTITLE, setJobTitle] = useState()
  const [USERNAME, setUsername] = useState()
  const [USERID, setUserID] = useState()
  const [COMPANYNAME, setCompanyName] = useState()
  const [errorMsg, setError] = useState('Error uploading file. Please try again.')

  useEffect(() => {
    setJobTitle(jobTitle + ', ' + companyName)
    setUsername(userName)
    setUserID(userID)
    setCompanyName(companyName)
  }, [jobTitle, companyName, userName, userID])

  useEffect(() => {
    setFile(file_type)
  }, [file_type]);
  
  const onDrop = useCallback((acceptedFiles) => {
    setUploadStatus('idle'); // Reset upload status

    if (!USERID || JOBTITLE == 'e.g. Software Engineer' || COMPANYNAME == 'e.g. Microsoft' || USERNAME == 'e.g. John Doe') {
      setError('Missing required fields. Please fill in interview fields.');
      setUploadStatus('error');
      return;
    }

    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', USERID);
      formData.append('job_title', JOBTITLE);
      formData.append('user_name', USERNAME);

      let path = `${langServerUrl}/write_job_file`;
      if (file_type === 'RESUME') {
        path = `${langServerUrl}/write_resume_file`;
      }

      axios
        .post(path, formData)
        .then((response) => {
          console.log('File upload successful:', response.data);
          setUploadStatus('success');
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          setUploadStatus('error');
        });
    });
  }, [file_type, USERID, JOBTITLE, COMPANYNAME, USERNAME]);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      'text/plain': [],
      'application/pdf': [],
    },
    onDrop,
  });

  return (
    <section className="container">
      {uploadStatus === 'idle' ? (
        <div role="button" tabIndex="0" aria-label="File Drop Zone" {...getRootProps({ role: 'button', className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop file, or click here</p>
        </div>
      ) : uploadStatus === 'success' ? (
        <div>
          <p>File uploaded successfully!</p>
        </div>
      ) : (
        <div>
          <div role="button" tabIndex="0" aria-label="File Drop Zone" {...getRootProps({ role: 'button', className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop file, or click here</p>
          </div>
          <p style={{ 'color': 'red' }}>{errorMsg}</p>
        </div>
      )}
    </section>
  );
};

export default AcceptMaxFiles;