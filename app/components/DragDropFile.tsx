import { useState, DragEvent, useRef, useEffect} from 'react';
import objFileIcon from "../images/FileIcons/objFileIcon.png";


const DragDropFileUpload = () => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            // Clean up the object URLs
            URL.revokeObjectURL(fileName)
            if (files.length > 0)
            {
                setFileName(files[0].name as string);
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
        <div>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className='file-drop-down'
                style={{
                    color: isDragOver ? '#007bff' : 'inherit',
                }}>

                <input
                    id="fileUpload"
                    name="fileUpload"
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFilesChange(e.target.files)}
                    style={{ display: 'none'}}
                    accept=".obj,.fbx"
                />
                <label className='text' htmlFor="fileUpload">Drag and drop files here or click to select files</label>

                <div>
                    {fileName ?? (
                        <div className='upload-preview-parent'>
                            <img key={fileName} src={objFileIcon} alt="Preview" className='upload-preview-img'/>
                            <p className='upload-preview-text text'>{fileName}</p>
                        </div>
                    )}
                </div>
            </div>
            <button type="submit" >Upload File</button>
        </div>
    );
};

export default DragDropFileUpload;
