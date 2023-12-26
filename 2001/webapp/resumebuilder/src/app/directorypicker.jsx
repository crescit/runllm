import React from 'react'
import { useDropzone } from 'react-dropzone';
import StopButton from './StopButton';

function Plugin(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    getFilesFromEvent: (event) => myCustomFileGetter(event)
  })
  return (
    <section className="container" style={{ marginTop: '30px' }}>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()}  webkitdirectory="" />
        <StopButton />
      </div>
    </section>
  )
}

export default Plugin

async function myCustomFileGetter(event) {
  console.log(event.dataTransfer);
  const files = []
  // Retrieves the files loaded by the drag event or the select event
  const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files

  for (var i = 0; i < fileList.length; i++) {
    const file = fileList.item(i)
    files.push(file)
  }

  console.log(files);
  // files returned from this function will be acceptedFiles
  return files
} 