import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { removeDisplayMessage } from "./chatSlice";

const InformationComponent = () => {
    const messages = useAppSelector((state) => state.chatReducer.infoMessages);
    const dispatch = useAppDispatch();
    const removeElementAt = (i: number) => {
        dispatch(removeDisplayMessage(i));
    };
    return (
        <div className="container">
            <div className="row mt-2">
                <div className="col">
                    {messages &&
                        messages.length > 0 &&
                        messages.map((m, i) => (
                            <div
                                className="alert alert-warning alert-dismissible fade show"
                                role="alert"
                                key={i}
                            >
                                {m}
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                    onClick={() => removeElementAt(i)}
                                ></button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export { InformationComponent };
