import React, { useState, DragEvent, useRef, useEffect, FC } from 'react';
import { useFetcher } from "@remix-run/react";

interface DragDropFileUploadProps {
    id: string; // ID to link the label and input
}

const DragDropFileUpload: FC<DragDropFileUploadProps> = ({ id }) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            // Clean up the object URLs
            filePreviews.forEach(URL.revokeObjectURL);
            const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
            setFilePreviews(fileUrls);
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
            filePreviews.forEach(URL.revokeObjectURL);
        };
    }, [filePreviews]);

    const fetcher = useFetcher();

    return (
        <div>
            <fetcher.Form method="post" encType="multipart/form-data" action='/render/1'>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: '2px dashed #007bff',
                        padding: '20px',
                        borderRadius: '5px',
                        textAlign: 'center',
                        color: isDragOver ? '#007bff' : 'inherit',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        id={id}
                        name={id}
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFilesChange(e.target.files)}
                        style={{ display: 'none'}}
                        accept="*.obj"
                    />
                    <label htmlFor={id}>Drag and drop files here or click to select files</label>

                    <div>
                        {filePreviews.map((filePreviewUrl, index) => (
                            <img key={index} src={filePreviewUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                        ))}
                    </div>
                </div>

                <button type="submit">Upload File</button>
            </fetcher.Form>
        </div>
    );
};

export default DragDropFileUpload;
