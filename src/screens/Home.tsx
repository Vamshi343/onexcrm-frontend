// src/screens/Home.tsx
import React, { useState } from "react";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);

  return showSignUp ? (
    <SignUpScreen onGoToSignIn={() => setShowSignUp(false)} />
  ) : (
    <SignInScreen onGoToSignUp={() => setShowSignUp(true)} />
  );
}
