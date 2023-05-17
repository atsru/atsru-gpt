import { ChatComponent } from "./features/chat/Chat";
import { InformationComponent } from "./features/chat/Information";
import { SettingsComponent } from "./features/chat/Settings";
import "./App.css";

const App = () => (
    <>
        <InformationComponent />
        <SettingsComponent />
        <ChatComponent />
    </>
);

export default App;
