import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload : React.FC = () => {

    const onDrop = useCallback((acceptedFiles : File[]) => {
        if(acceptedFiles.length > 0) {
            getApiRes(acceptedFiles);
        }
    }, [])

    async function getApiRes(acceptedFiles : File[]) {
        const formData = new FormData();
            formData.append('file', acceptedFiles[0]);

            const response = await axios.post("http://localhost:8080/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response.data);
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    return (
        <>
            <div className="h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4" {...getRootProps()}>
                <p className="font-thin text-gray-200 text-sm">Note: Only 1 file can be transfered at a time.</p>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag & drop files or Click to upload</p>
                }
            </div>
        </>
    )
};

export default FileUpload;
