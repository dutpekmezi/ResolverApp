import storage from "firebase-admin";
import { firebaseApp } from "../utils/firebase";
import {
  UploadHandler,
  writeAsyncIterableToWritable,
} from "@remix-run/node";
import { userId } from "~/utils/userUtils";
import {
  StartUploadModel as StartUploadModelRequest,
  OnModelUploaded as OnModelUploadedRequest,
  IsModelNameExist as IsModelNameExistRequest
} from "~/services/userService";

export async function uploadFile(
  path: string,
  contentType: string,
  data: AsyncIterable<Uint8Array>
): Promise<{ url: string; size: number }> {

  return new Promise(async (resolve, reject) => {
    const file = storage.storage(firebaseApp)
      .bucket(`${process.env.FIREBASE_PROJECT_ID}.appspot.com`)
      .file(path);

    const writeStream = file.createWriteStream({
      contentType,
      resumable: false,
      predefinedAcl: "publicRead",
    });

    writeStream
      .on("finish", async () => {
        const url = file.publicUrl();
        const [metadata] = await file.getMetadata();

        resolve({ url, size: Number(metadata.size) });
      })
      .on("error", (error) => {
        reject(error);
      });

    await writeAsyncIterableToWritable(data, writeStream);
  });
}

export const googleCloudUploadHandler: UploadHandler = async (file) => {
  if (file.name !== "fileUpload" || !file.filename) {
    return undefined;
  }

  const startUploadModelResponse = await StartUploadModelRequest({
    userId: userId,
    modelName: file.filename
  });

  if (!startUploadModelResponse.success) {
    return JSON.stringify(startUploadModelResponse);
  }

  const { url, size } = await uploadFile(
    `${userId}/${file.filename}`,
    file.contentType,
    file.data
  );

  const onUploadModelResponse = await OnModelUploadedRequest({
    userId: userId,
    modelId: startUploadModelResponse.id
  });

  if (!onUploadModelResponse.success) {
    return JSON.stringify(onUploadModelResponse);
  }

  return JSON.stringify({
    "success": true,
    "message": `${file.filename} uploaded`,
    "actionType": "upload"
  });
}