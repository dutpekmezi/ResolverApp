import { ActionFunctionArgs,
	LoaderFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	unstable_createFileUploadHandler as createFileUploadHandler,
	UploadHandler,
	redirect
	} from "@remix-run/node";
import { getSession } from "~/utils/session";
import {googleCloudUploadHandler} from "../services/googleCloudService"
import { RedirectToLoginIfUserInvalid, userId } from "~/utils/userUtils";
import DragDropFileUpload from "~/components/DragDropFile";
import { Form, Outlet, useFetcher, useSubmit } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StartUploadModel } from "~/services/userService";

type LoaderData = {
	scene:string;
	userId:string;
  };

export async function loader({ request }: LoaderFunctionArgs) 
{	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    if (scene == null)
	{
		throw redirect("/userDashboard/render");
	}
  
    return {scene, userId};
}

type ActionData = {
	success:Boolean;
	message:String;
	isNameTaken?:boolean;
  };

export async function action ({ request }: ActionFunctionArgs) : Promise<ActionData>
{
	await RedirectToLoginIfUserInvalid(request.headers);

	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	);

	const formData = await parseMultipartFormData(request, uploadHandler);

	const uploadResult = formData.get("fileUpload");

	if (!uploadResult) {
		return {
			success: false,
			message: "Couldn't upload file."
		};
	}

	return JSON.parse(uploadResult.toString())
};

export default function UploadObject()
{
	const fetcherKey = "mainModelUpload";

	const fetcher = useFetcher<ActionData>({key: fetcherKey});

	const [overridingModel, setOverridingModel] = useState(false);
	const [modelNameValid, setModelNameValid] = useState(false);

	useEffect(() => {
		if (fetcher.data && fetcher.data.isNameTaken != undefined && fetcher.data.isNameTaken == false) {
			setModelNameValid(true);
		}
	}, [fetcher.data]);

	const _fileInputRef = useRef<HTMLInputElement>(null);

	var uploadState = null;

	if (fetcher.state != "idle")
	{
		uploadState = <h4 className="text">{(overridingModel == false && modelNameValid == false) ? "Status: Checking if model name exist.." : "Uploading File.."} </h4>;
	}
	else if (fetcher.data)
	{
		uploadState = <h4 className="text">Status: {fetcher.data.message}</h4>
	}

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => 
		{
			event.preventDefault();
			if (_fileInputRef.current && _fileInputRef.current.files && _fileInputRef.current.files.length > 0) {
				//const file = fileInputRef.current?.files?.item(0);
				const file = _fileInputRef.current.files[0];

				const formData = new FormData();
				formData.append('fileUpload', file);

				if (overridingModel == false && modelNameValid == false)
				{
					fetcher.submit(formData,
					{
						action: "isFileExist",
						method: "post",
						encType: "multipart/form-data",
					});
				}
				else
				{
					fetcher.submit(formData,
					{
						method: "post",
						encType: "multipart/form-data",
					});
				}
			}
        },
        [fetcher, overridingModel],
      );

	  const handleOverrideModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOverridingModel(event.target.checked);
	  };

	return (
	  <center>
		<h2 className="text">Upload New Model</h2>
		<fetcher.Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
			<div className="upload-model-form">
				<DragDropFileUpload onFileChange={() => { setModelNameValid(false); }} fileInputRef={_fileInputRef} />
				<div className="upload-model-override-checkbox">
					<label className='text' htmlFor="overrideModel">Override Existing Model</label>
					<input id="overrideModel" name="overrideModel" type="checkbox" onChange={handleOverrideModelChange}/>
				</div>
			</div>
			<button className="upload-mode-button" type="submit" >{overridingModel || modelNameValid ? "Upload Model" : "Check File Exist"}</button>
		</fetcher.Form>
		{uploadState}

		<Outlet/>
	  </center>
	);
}