import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';
import { UploadHandler } from '@remix-run/node';
import { getStorage } from 'firebase-admin/storage';

const uploadStreamToCloudStorage = async (fileStream: Readable, fileName: string) => {
    const bucket = getStorage().bucket();
  
    // Create Cloud Storage client
    const cloudStorage = new Storage();
  
    // Create a reference to the file.
    const fileRef = getStorage().bucket('models').file(fileName);
  
    async function streamFileUpload() {
      fileStream.pipe(fileRef.createWriteStream()).on('finish', () => {
        // The file upload is complete
        console.log('File upload complete');
      });
  
      console.log(`${fileName} uploaded to ${fileRef.parent.name}`);
    }
  
    streamFileUpload().catch(console.error);
  
    return fileName;
};

export default async function cloudStorageUploaderHandler(filename: string, stream: Readable): Promise<UploadHandler> 
{
    return await uploadStreamToCloudStorage(stream, filename);
};
/*
import type { File } from "@google-cloud/storage";
import type { Readable } from "stream";
export declare type UploadHandlerArgs = {
    name: string;
    stream: Readable;
    filename: string;
    encoding: string;
    mimetype: string;
};
export declare type UploadHandler = (args: UploadHandlerArgs) => Promise<string | File | undefined>;
export declare type FirebaseStorageUploadHandler = {
    file(args: UploadHandlerArgs): File;
    filter?(args: UploadHandlerArgs): boolean | Promise<boolean>;
};
export default function createFirebaseStorageFileHandler({ file, filter, }: FirebaseStorageUploadHandler): UploadHandler;*/