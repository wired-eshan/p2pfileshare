import React, { useRef, useState } from "react";
import axios from "axios";

const FileDownload : React.FC = () => {
    const [inputCode, setInputCode] = useState<string[]>(["", "", "", "", ""]);
    const [error, setError] = useState<string | null>(null);

    const inputsRef = useRef<HTMLInputElement[] | null[]>([]);

    const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>, index : number) => {
        const value = e.currentTarget.value.replace(/[^0-9]/g, "");
        
        if(!value) return;

        const code = [...inputCode];
        code[index] = value;
        setInputCode(code);

        if(index < 4 && value) {
            inputsRef.current[index+1]?.focus();
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index : number) => {
        if(e.key == "Backspace") {
            if(inputCode[index]) {
                // Clear current input if it has a value
                const code = [...inputCode];
                code[index] = "";
                setInputCode(code);
            } else if(index > 0) {
                // Go to previous input if current is empty
                inputsRef.current[index-1]?.focus();
            }
        }
    }

    const handleCodeInputClick = () => {
        let starting = 0;
        for(starting = 0; starting < 5; starting++) {
            if(!inputCode[starting])
                break;
        }
        inputsRef.current[starting]?.focus();
    }
 
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedCode = e.clipboardData.getData("text");
        const sanitizedCode = pastedCode.replace(/[^0-9]/g, "");

        const code = ["", "", "", "", ""];
        for(let i=0; i < sanitizedCode.length; i++) {
            code[i] = sanitizedCode[i];
        }
        setInputCode(code);
    }

    const getDownloadPort = () => {
        let downloadPort = "";
        inputCode.map((digit : string) => {
            downloadPort += digit;
        });
        return downloadPort;
    }

    const handleSubmit = async () => {
        setError(null);
        
        const port = getDownloadPort();

        if(port.length < 5) {
            setError("Invalid code. Must be 5 digit download code.");
            return;
        }

        const response = await axios.get(`/api/download/${port}`, {
            responseType: "blob"
        });

        try{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const headers = response.headers;
            let contentDisposition = '';
            
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
            <div className="flex-col h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4 content-center bg-gradient-to-tl from-black from-gray-900 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black transition-all duration-500 group">
                    <div className="flex justify-center">
                        {inputCode.map((_, index) => {
                            return(<input
                                type="number"
                                value={inputCode[index]}
                                className="border border-gray-400 min-w-0 h-[3rem] m-2 text-center md:h-[2.5rem] md:w-[3rem] rounded"
                                ref={(el) => {inputsRef.current[index] = el}}
                                onChange={(e) => handleCodeInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onClick={handleCodeInputClick}
                                onPaste={handlePaste}
                            />)
                        })}
                    </div>
                    {error && error}
                <div className="my-4">
                    <button onClick={handleSubmit}>Download</button>
                </div>
            </div>
            <style>
                {
                    `input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type="number"] {
                        -moz-appearance: textfield;
                    }`
                }
            </style>
        </>
    )
};

export default FileDownload;
