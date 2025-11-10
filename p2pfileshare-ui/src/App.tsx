import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import FileDownload from "./components/FileDownload";
import DownloadCode from "./components/DownloadCode";

function App() {
  const [activeTab, setActiveTab] = useState<"upload" | "download" | "downloadCode">("upload");

  const [code, setCode] = useState<null | number>(null);

  const handleGetDownloadCode = (port : number) => {
    setCode(port);
    setActiveTab("downloadCode");
  }

  const handleReset = () => {
    setCode(null);
    setActiveTab("upload");
  }

  const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as "upload" | "download";
    setActiveTab(name);
  };

  return (
    <>
      <div className="h-screen w-screen justify-items-center p-8">
        <div className="w-10/12 lg:w-6/12 text-center mx-auto p-0">
          <p className="text-3xl font-bold mb-8">P2P File Sharing</p>
          {activeTab == "upload" && <FileUpload handleGetDownloadCode={handleGetDownloadCode}  />}
          {activeTab == "download" && <FileDownload />}
          {activeTab == "downloadCode" && <DownloadCode code={code} uploadFile={handleReset} />}
          <div className="flex justify-evenly gap-4 m-4">
            <button
              name="upload"
              style={
                activeTab === "upload"
                  ? { backgroundColor: "rgba(1, 170, 175, 1)" }
                  : {}
              }
              className={`p-2 rounded w-fit ${
                activeTab !== "upload" ? "border" : ""
              }`}
              onClick={handleTabChange}
            >
              Upload File
            </button>
            <button
              name="download"
              style={
                activeTab === "download"
                  ? { backgroundColor: "rgba(1, 170, 175, 1)" }
                  : {}
              }
              className={`p-2 w-fit rounded ${
                activeTab !== "download" ? "border" : ""
              }`}
              onClick={handleTabChange}
            >
              Receive File
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
