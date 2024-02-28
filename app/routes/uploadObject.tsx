import { ActionFunctionArgs,
	LoaderFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	unstable_createFileUploadHandler as createFileUploadHandler,
	json,
	UploadHandler
	} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { getSession } from "~/session";
import {googleCloudUploadHandler} from "../services/gooleCloudService"
export async function loader({
    request,
  }: LoaderFunctionArgs) {
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    const data = { "scene": scene };
  
    return json(data);
}

type ActionData = {
	errorMsg?: string;
	imgSrc?: string;
	imgDesc?: string;
  };

export async function action ({ request }: ActionFunctionArgs) 
{
	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	  );
	  const formData = await parseMultipartFormData(request, uploadHandler);
	  const imgSrc = formData.get("img");
	  const imgDesc = formData.get("desc");
	  console.log(imgDesc);
	  if (!imgSrc) {
		return json({
		  errorMsg: "Something went wrong while uploading",
		});
	  }
	  return json({
		imgSrc,
		imgDesc,
	  });
};

export default function UploadObject()
{
	const fetcher = useFetcher<ActionData>();
	
	return (
	  <>
		<fetcher.Form method="post" encType="multipart/form-data">
		  <label htmlFor="img-field">Image to upload</label>
		  <input id="img-field" type="file" name="img" accept="image/*" />
		  <label htmlFor="img-desc">Image description</label>
		  <input id="img-desc" type="text" name="desc" />
		  <button type="submit">Upload to S3</button>
		</fetcher.Form>

		{(fetcher.state === "idle" && fetcher.data != null) ? (
		  (fetcher.data as ActionData).errorMsg ? (
			<h2>{(fetcher.data as ActionData).errorMsg}</h2>
		  ) : (
			<>
			  <div>
				File has been uploaded to S3 and is available under the following
				URL (if the bucket has public access enabled):
			  </div>
			  <div>{(fetcher.data as ActionData).imgSrc}</div>
			  <img
				src={(fetcher.data as ActionData).imgSrc}
				alt={(fetcher.data as ActionData).imgDesc || "Uploaded image from S3"}
			  />
			</>
		  )
		) : null}
	  </>
	);
}