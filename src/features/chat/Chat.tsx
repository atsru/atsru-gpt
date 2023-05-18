import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { generateImages, loadReplies, sendMessageToApi } from "./chatSlice";
import ReactMarkdown from "react-markdown";

const ChatComponent = () => {
    const [text, setText] = useState("");
    const controlDivEnd = useRef<HTMLDivElement>(null);
    const { waitingReply, replies } = useAppSelector(
        (state) => state.chatReducer
    );
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadReplies());
    }, [dispatch]);
    useEffect(() => {
        if (!waitingReply) {
            controlDivEnd.current?.scrollIntoView();
        }
    }, [waitingReply]);
    return (
        <div className="container flex-fill overflow-auto">
            <div className="d-flex flex-column h-100">
                <div className="flex-fill mb-3 overflow-auto" id="ai-replies">
                    {replies.map((reply, i) => (
                        <div className="card mb-1" key={i}>
                            <div className="card-body">
                                <div className="card-title bg-black p-3">
                                    <ReactMarkdown children={reply.text} />
                                </div>
                                <div className="card-text">
                                    {reply.type === "text" ? (
                                        <ReactMarkdown children={reply.reply} />
                                    ) : (
                                        <div>
                                            {reply.imageUrls &&
                                                reply.imageUrls.map(
                                                    (url, i) => (
                                                        <img
                                                            className="img-thumbnail m-1"
                                                            key={i}
                                                            alt="generated img"
                                                            src={url}
                                                        />
                                                    )
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="hidden" ref={controlDivEnd}></div>
                </div>
                <div className="flex-shrink-1 row">
                    <div className="col-10">
                        <textarea
                            className="form-control"
                            title="message to send"
                            rows={5}
                            onKeyDown={(e) => {
                                if (e.ctrlKey && e.code === "Enter") {
                                    e.preventDefault();
                                    setText("");
                                    dispatch(sendMessageToApi(text));
                                }
                            }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="col-2">
                        {waitingReply ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-light"
                                    title="send message"
                                    type="button"
                                >
                                    <i className="bi bi-caret-right"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-light dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="visually-hidden">
                                        Toggle Dropdown
                                    </span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => {
                                                setText("");
                                                dispatch(generateImages(text));
                                            }}
                                        >
                                            Generate Image
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ChatComponent };
