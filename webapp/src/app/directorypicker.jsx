import React, { useState, useEffect, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';

const AcceptMaxFiles = ({ file_type, ...props }) => {
  const [FILETYPE, setFile] = useState()

  useEffect(() => {
    setFile(file_type)
  }, [file_type]);
  
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        const formData = new FormData();
        formData.append('file', file);
        console.log(process.env.NEXT_PUBLIC_LANGSERVER_URL, FILETYPE, file_type)
        let path = `${process.env.NEXT_PUBLIC_LANGSERVER_URL}/write_job_file`
        if(file_type == 'RESUME'){
          path = `${process.env.NEXT_PUBLIC_LANGSERVER_URL}/write_resume_file`
        }
        axios.post(path, formData)
          .then((response) => {
            // Handle the response if needed
            console.log('File upload successful:', response.data);
          })
          .catch((error) => {
            // Handle the error
            console.error('Error uploading file:', error);
        });
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [])


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
        <p>Drag 'n' drop some files here, or click</p>
      </div>
    </section>
  );
}

export default AcceptMaxFiles;