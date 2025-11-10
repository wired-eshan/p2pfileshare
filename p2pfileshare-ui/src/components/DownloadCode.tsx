import React from "react";
import { Copy } from "lucide-react";
interface downloadCodeProps {
    code : number | null,
    uploadFile: () => void
}

const DownloadCode : React.FC<downloadCodeProps> = ({ code, uploadFile }) => {
    const handleCopy = async () => {
        try {
            if(code)
                await navigator.clipboard.writeText(code?.toString());
        } catch (error) {
            console.log("Error copying code to clipboard", error);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-8 justify-center items-center h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4 bg-gradient-to-tl from-black from-gray-900">
                <div>Enter code to receive file {code}</div>
                <div className="flex gap-4 p-4 border rounded border-gray-400">{code} <Copy onClick={handleCopy} className="cursor-pointer" size={24} color="#bfbfbf" strokeWidth={2} absoluteStrokeWidth /></div>
                <button onClick={uploadFile}>Upload another file</button>
            </div>
        </>
    );
};

export default DownloadCode;
