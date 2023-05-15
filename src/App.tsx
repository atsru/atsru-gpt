import { ChatComponent } from "./features/chat/Chat";
import { MessagesComponent } from "./features/chat/Messages";
import { SettingsComponent } from "./features/chat/Settings";

const App = () => (
    <>
        <MessagesComponent />
        <SettingsComponent />
        <ChatComponent />
    </>
);

export default App;
