import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { loadAiModels } from "./chatSlice";
import _ from "lodash";

const ChatComponent = () => {
    const dispatch = useAppDispatch();
    const aiModels = useAppSelector((s) => s.chatReducer.aiModels);
    const defaultEnginePattern = useAppSelector(
        (s) => s.chatReducer.defaultEngine
    );
    const orderedAiModels = _.orderBy(
        aiModels,
        (m) => m.indexOf(defaultEnginePattern),
        "desc"
    );

    useEffect(() => {
        dispatch(loadAiModels());
    }, [dispatch]);
    return (
        <div className="ml-20">
            <label htmlFor="">
                open ai model
                <select>
                    {orderedAiModels.map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>
            </label>
            <div className="flex h-screen items-center justify-center">
                center
            </div>
        </div>
    );
};

export { ChatComponent };
