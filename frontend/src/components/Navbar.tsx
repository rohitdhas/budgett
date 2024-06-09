import { UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-xl font-bold italic">💰 BUDGETTT</h1>
      <UserButton />
    </div>
  );
}
