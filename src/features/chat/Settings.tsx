import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { clear, load, refreshAiModels, save } from "./chatSlice";

const SettingsComponent = () => {
    const dispatch = useAppDispatch();
    const savedApiKey = useAppSelector((state) => state.chatReducer.apiKey);
    const savedOrgId = useAppSelector((state) => state.chatReducer.orgId);
    const savedModel = useAppSelector((state) => state.chatReducer.model);
    const models = useAppSelector((state) => state.chatReducer.aiModels);
    const [apiKey, setApiKey] = useState("");
    const [orgId, setOrgId] = useState("");
    const [model, setModel] = useState("");
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setApiKey(savedApiKey);
        setOrgId(savedOrgId);
        setModel(savedModel);
    }, [savedApiKey, savedOrgId, savedModel]);

    useEffect(() => {
        dispatch(load());
    }, [dispatch]);

    return (
        <div className="container flex-shrink-1">
            <div className="row">
                <div className="col">
                    <form>
                        <fieldset>
                            <div className="row">
                                <legend className="col-2">settings</legend>
                                <div className="col">
                                    <button
                                        title="expand"
                                        className="btn btn-outline-info"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        aria-expanded="false"
                                        aria-controls="collapseSettings"
                                        data-bs-target="#collapseSettings"
                                        onClick={() => setExpanded(!expanded)}
                                    >
                                        {expanded ? (
                                            <i className="bi bi-arrow-up"></i>
                                        ) : (
                                            <i className="bi bi-arrow-down"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="collapse" id="collapseSettings">
                                <div className="row my-3">
                                    <label
                                        htmlFor="ai-apikey"
                                        className="col-sm-2 col-form-label"
                                    >
                                        apikey
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="ai-apikey"
                                            value={apiKey}
                                            onChange={(e) =>
                                                setApiKey(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label
                                        htmlFor="ai-orgid"
                                        className="col-sm-2 col-form-label"
                                    >
                                        orgid
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="ai-orgid"
                                            value={orgId}
                                            onChange={(e) =>
                                                setOrgId(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label
                                        className="col-sm-2 col-form-label"
                                        htmlFor="ai-models"
                                    >
                                        open ai model
                                    </label>
                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <select
                                                className="form-select"
                                                id="ai-models"
                                                onChange={(e) =>
                                                    setModel(e.target.value)
                                                }
                                                value={model}
                                            >
                                                {models.length > 0 ? (
                                                    models.map((m, i) => (
                                                        <option key={i}>
                                                            {m}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option key={model}>
                                                        {model}
                                                    </option>
                                                )}
                                            </select>
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                id="button-addon2"
                                                title="refresh ai models"
                                                onClick={() =>
                                                    dispatch(refreshAiModels())
                                                }
                                            >
                                                <i className="bi bi-arrow-clockwise"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="btn-group mb-3"
                                    role="group"
                                    aria-label="Basic example"
                                >
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => dispatch(load())}
                                    >
                                        load
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            dispatch(
                                                save({ apiKey, orgId, model })
                                            )
                                        }
                                    >
                                        save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => dispatch(clear())}
                                    >
                                        clear
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { SettingsComponent };
