import { useState } from "react";
import LoginView from "./components/auth/LoginView";
import OperatorView from "./views/OperatorView";
import PilotView from "./views/PilotView";
import { User } from "./types";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // View Controller Logic
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (currentUser.role === 'pilot') {
    return <PilotView user={currentUser} onLogout={handleLogout} />;
  }

  // Default to Operator view for Admin/Operator roles
  return <OperatorView user={currentUser} onLogout={handleLogout} />;
}

export default App;
