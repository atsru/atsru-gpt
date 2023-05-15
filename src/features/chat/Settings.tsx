import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { clear, load, refreshAiModels, save } from "./chatSlice";

const SettingsComponent = () => {
    const dispatch = useAppDispatch();
    const savedApiKey = useAppSelector((state) => state.chatReducer.apiKey);
    const savedOrgId = useAppSelector((state) => state.chatReducer.orgId);
    const models = useAppSelector((state) => state.chatReducer.aiModels);
    const savedModel = useAppSelector((state) => state.chatReducer.model);
    const [apiKey, setApiKey] = useState(savedApiKey);
    const [orgId, setOrgId] = useState(savedOrgId);
    const [model, setModel] = useState(savedModel);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <form>
                        <fieldset>
                            <legend>settings</legend>
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
                                            defaultValue={model}
                                        >
                                            {models.length > 0 &&
                                                models.map((m, i) => (
                                                    <option key={i}>{m}</option>
                                                ))}
                                        </select>
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            id="button-addon2"
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
                                        dispatch(save({ apiKey, orgId, model }))
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
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { SettingsComponent };
