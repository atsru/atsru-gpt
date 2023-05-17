import { ChatComponent } from "./features/chat/Chat";
import { MessagesComponent } from "./features/chat/Messages";
import { SettingsComponent } from "./features/chat/Settings";
import "./App.css";

const App = () => (
    <div className="d-flex flex-column h-100">
        <MessagesComponent />
        <SettingsComponent />
        <ChatComponent />
    </div>
);

export default App;
