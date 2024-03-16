import { useState, DragEvent, useRef, useEffect, FC} from 'react';
import objFileIcon from "../images/fileIcons/objFileIcon.png";

interface DragDropFileUploadData
{
    onFileChange: () => void
    fileInputRef: React.RefObject<HTMLInputElement>
}

const DragDropFileUpload:FC<DragDropFileUploadData> = ({onFileChange, fileInputRef} : DragDropFileUploadData) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    
    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            // Clean up the object URLs
            URL.revokeObjectURL(fileName)
            if (files.length > 0)
            {
                setFileName(files[0].name as string);
            }
            else
            {
                setFileName("");
            }
            
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const input = fileInputRef.current;
            if (input) {
                input.files = event.dataTransfer.files;
                handleFilesChange(event.dataTransfer.files);
                onFileChange()
            }
        }
    };

    useEffect(() => {
        // Clean up object URLs on unmount
        return () => {
            URL.revokeObjectURL(fileName);
        };
    }, [fileName]);
    
    return (
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className='file-drop-down'>

            <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFilesChange(e.target.files)}
                style={{ display: 'none'}}
                accept=".obj,.fbx"
                required
            />
            <label className='text' htmlFor="fileUpload" style={{
                color: isDragOver ? '#007bff' : '#ffffff',
            }}>
                Drag and drop file here or click to select file</label>
            
            {fileName != "" ?(
                <div className='upload-preview-parent'>
                    <img key={fileName} src={objFileIcon} alt="Preview" className='upload-preview-img'/>
                    <p className='upload-preview-text'>{fileName}</p>
                </div>
            ) : null}
        </div>
    );
};

export default DragDropFileUpload;
