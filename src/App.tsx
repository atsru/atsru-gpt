import { ChatComponent } from "./features/chat/Chat";
import { InformationComponent } from "./features/chat/Information";
import { SettingsComponent } from "./features/chat/Settings";
import "./App.css";

const App = () => (
    <div className="d-flex flex-column h-100">
        <InformationComponent />
        <SettingsComponent />
        <ChatComponent />
    </div>
);

export default App;
