import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="bg-slate-100 md:h-screen">
      <Router>
        <SignedIn>
          <Dashboard />
        </SignedIn>
        <SignedOut>
          <Login />
        </SignedOut>
      </Router>
    </div>
  );
}
