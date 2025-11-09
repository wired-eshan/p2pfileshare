import React, {useCallback} from "react";
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

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <>
            <div className="h-[40vh] bg-gray-700 w-12/12 rounded-xl" {...getRootProps()}>
                upload here
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
