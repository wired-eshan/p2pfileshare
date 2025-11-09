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
            <div className="relative h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4 flex flex-col justify-center cursor-pointer bg-gradient-to-tl from-black from-gray-900 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black transition-all duration-500 group" {...getRootProps()}>
                <p className="font-thin text-gray-200 text-sm mb-4">Only 1 file can be transfered at a time.</p>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the file here ...</p> :
                    <p>Drag & drop files or Click to upload</p>
                }
                <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:translate-y-0 translate-y-10 group-hover:[transition-timing-function:cubic-bezier(.17,1.55,.73,1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
            </div>
        </>
    )
};

export default FileUpload;
