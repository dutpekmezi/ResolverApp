import { useFetcher, useSubmit } from "@remix-run/react";
import { useCallback, useRef } from "react";
import { Model } from "~/services/userService";

export default function ModelSelectionBox(model:Model)
{
    const fetcher = useFetcher();
    const submit = useSubmit();
    const formRef = useRef<HTMLFormElement>(null)


    const onFileSelect = () => 
    {
        formRef.current?.submit();
    }

    return (
        <div key={model.id} onClick={onFileSelect} className="existing-model-selection">
            <fetcher.Form ref={formRef} method="post" action="selectModel">
                <div className="existing-model-selection-box">
                    <h4 className="text">{model.name}</h4>
                    <p className="text">{model.createTime.toLocaleString()}</p>
                </div>
                <input type="hidden" name={"modelId"} value={model.id} />
                <input type="hidden" name={"modelName"} value={model.name} />
            </fetcher.Form>
        </div>);
}