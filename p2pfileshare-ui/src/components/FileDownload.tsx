import React, { useState } from "react";
import axios from "axios";

const FileDownload : React.FC = () => {
    const [port, setPort] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value);
    }

    const handleSubmit = async () => {
        const response = await axios.get(`http://localhost:8080/download/${port}`, {
            responseType: "blob"
        });

        try{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Try to get filename from response headers
            // Axios normalizes headers to lowercase, but we need to handle different cases
            const headers = response.headers;
            let contentDisposition = '';
            
            // Look for content-disposition header regardless of case
            for (const key in headers) {
                if (key.toLowerCase() === 'content-disposition') {
                contentDisposition = headers[key];
                break;
                }
            }
            
            let filename = 'downloaded-file';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length === 2) {
                filename = filenameMatch[1];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log("Error downloading file", error);
        }
        
    }

    return (
        <>
            <div className="h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4">
                Download from here
                <input value={port} onChange={handleChange} placeholder="Enter port" />
                <button onClick={handleSubmit}>Download</button>
            </div>
        </>
    )
};

export default FileDownload;
