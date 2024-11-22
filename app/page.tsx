import DocumentViewer from "@/components/DocumentViewer";
import FileUpload from "@/components/FileUpload";



export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Word Document Viewer and Commenter</h1>
      <FileUpload />
      <DocumentViewer />
    </div>
  )
}

