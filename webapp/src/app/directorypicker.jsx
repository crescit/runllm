import React from 'react';
import {useDropzone} from 'react-dropzone';

function AcceptMaxFiles(props) {
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
    }
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors  }) => { 
   return (
     <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => <li key={e.code}>{e.message}</li>)}
         </ul>

     </li>
   ) 
  });
  

  return (
    <section class="container">
      <div role="button" tabindex="0" aria-label="File Drop Zone" {...getRootProps({ role: 'button', className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click</p>
      </div>
    </section>
  );
}

export default AcceptMaxFiles;