import { SignInButton } from "@clerk/clerk-react";
import { Button } from "antd";

export default function Login() {
  return (
    <div className="h-full flex justify-center items-center">
      <SignInButton>
        <Button type="primary" size="large">
          Sign In to Budgettt 🔒
        </Button>
      </SignInButton>
    </div>
  );
}
