import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Trash, Upload, File as FileIcon } from "lucide-react";

interface uploadFileResponse  {
    port : number
}

const FileUpload: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<null | File>();
  const [filePort, setFilePort] = useState<null | number>();

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // avoid re-opening file dialog
    if (!uploadedFile || isRemoving) return;
    setIsRemoving(true);
    // match animation duration below
    setTimeout(() => {
      setUploadedFile(null);
      setIsRemoving(false);
    }, 700);
  };

  async function handleFileUpload() {
    if (uploadedFile) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const response = await axios.post(
          "http://localhost:8080/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const res : uploadFileResponse = response.data;
        setFilePort(res.port);
        console.log(response.data);
      } catch (error) {
        console.log("Error uploading file: ", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      <style>{`
        @keyframes fallFade {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          60% { transform: translateY(180%) rotate(12deg) scale(1.02); opacity: 0.9; }
          100% { transform: translateY(420%) rotate(18deg) scale(0.95); opacity: 0; }
        }
      `}</style>
      <div
        className="relative h-[40vh] bg-gray-700 w-12/12 rounded-xl p-4 flex flex-col justify-center cursor-pointer bg-gradient-to-tl from-black from-gray-900 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black transition-all duration-500 group"
        {...getRootProps()}
      >
        <p className="font-thin text-gray-200 text-sm">
          Only 1 file can be transfered at a time.
        </p>
        {uploadedFile ? (
          <div className="flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="relative flex items-center justify-center m-8 max-w-6/12 gap-4">
                <p className="text-sm text-gray-200">{uploadedFile.name}</p>
                {/* Trash button: starts the falling animation */}
                <div
                  className={`${
                    isRemoving ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <Trash
                    onClick={handleRemove}
                    size={24}
                    color="#bfbfbf"
                    strokeWidth={3}
                    absoluteStrokeWidth
                  />
                </div>
                {/* Falling file icon (absolute so it can animate out of the box) */}
                {isRemoving && (
                  <div
                    className="absolute right-0 top-0"
                    style={{
                      // ensure it runs once and stays at final state (opacity:0, translated down)
                      animation:
                        "fallFade 700ms cubic-bezier(.2,.8,.2,1) forwards",
                      // place above elements while animating
                      zIndex: 40,
                    }}
                  >
                    <FileIcon size={28} color="#bfbfbf" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                {
                    isUploading ? (
                        <button className="w-fit flex items-center">
                            Uploading...
                        </button>
                    ) : (
                        <button className="w-fit flex items-center" onClick={handleFileUpload}>
                            Send
                            <Upload
                                size={18}
                                color="#bfbfbf"
                                strokeWidth={2}
                                absoluteStrokeWidth
                                className="ml-4"
                            />
                        </button>
                    )
                }
              </div>
            </div>
          </div>
        ) : (
          <>
            {" "}
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag & drop files or Click to upload</p>
            )}
            <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:translate-y-0 translate-y-10 group-hover:[transition-timing-function:cubic-bezier(.17,1.55,.73,1)]">
              <Upload
                size={48}
                color="#bfbfbf"
                strokeWidth={3}
                absoluteStrokeWidth
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FileUpload;
