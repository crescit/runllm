import React, { useState, useEffect, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import { langServerUrl  } from './globals';

const AcceptMaxFiles = ({ file_type, userID, jobTitle, companyName, userName, ...props }) => {
  const [FILETYPE, setFile] = useState()
  const [JOBTITLE, setJobTitle] = useState()
  const [USERNAME, setUsername] = useState()
  const [USERID, setUserID] = useState()

  useEffect(() => {
    setJobTitle(jobTitle + ', ' + companyName)
    setUsername(userName)
    setUserID(userID)
  }, [jobTitle, companyName, userName, userID])

  useEffect(() => {
    setFile(file_type)
  }, [file_type]);
  
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      // formData.append('user_id', userID)
      // formData.append('job_title', jobTitle + ', ' + companyName)
      // formData.append('user_name', userName)
      formData.append('user_id', USERID)
      formData.append('job_title', JOBTITLE)
      formData.append('user_name', USERNAME)
      console.log(langServerUrl, FILETYPE, file_type);

      let path = `${langServerUrl}/write_job_file`;
      if (file_type === 'RESUME') {
        path = `${langServerUrl}/write_resume_file`;
      }

      axios.post(path, formData)
        .then((response) => {
          console.log('File upload successful:', response.data);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    });
  }, [FILETYPE, file_type, USERID, JOBTITLE, USERNAME]);


  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({    
    maxFiles:1,
    accept: {
      'text/plain': [],
      'application/pdf': []
    },
    onDrop
  });

  return (
    <section className="container">
      <div role="button" tabIndex="0" aria-label="File Drop Zone" {...getRootProps({ role: 'button', className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop file, or click here</p>
      </div>
    </section>
  );
}

export default AcceptMaxFiles;