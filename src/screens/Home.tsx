import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import DashboardScreen from "./Dashboard";
import storageUtil from "../services/storageUtil";

const MOCK_UI_MODE = true;


export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    "checking" | "signin" | "signup" | "dashboard"
  >("checking");

  const [userData, setUserData] = useState<any>(null);

  // ---------------------------------------------
  //  CHECK AUTH ON APP LOAD
  // ---------------------------------------------
  useEffect(() => {
    checkAuthStatus();
  }, []);


  


  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking authentication status...");

      const session = await storageUtil.getSession();

      if (session?.token && session?.user) {
        console.log("✅ User logged in:", session.user?.userName);
        setUserData(session.user);
        setCurrentScreen("dashboard");
      } else {
        console.log("❌ Not logged in");
        setCurrentScreen("signin");
      }
    } catch (error) {
      console.error("❌ Error loading session:", error);
      await storageUtil.clearAll();
      setCurrentScreen("signin");
    }
  };

  // ---------------------------------------------
  //  LOGIN SUCCESS
  // ---------------------------------------------
  const handleLoginSuccess = async () => {
    const session = await storageUtil.getSession();
    if (session?.user) {
      setUserData(session.user);
      setCurrentScreen("dashboard");
    }
  };

  // ---------------------------------------------
  //  LOGOUT
  // ---------------------------------------------
  const handleLogout = async () => {
    await storageUtil.clearAll();
    setUserData(null);
    setCurrentScreen("signin");

    // Optional refresh (helps on web)
    if (Platform.OS === "web") {
      window.location.reload();
    }
  };

  // ---------------------------------------------
  //  UI SCREENS
  // ---------------------------------------------
  if (currentScreen === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (currentScreen === "dashboard" && userData) {
    return <DashboardScreen user={userData} onLogout={handleLogout} />;
  }



 



  if (currentScreen === "signup") {
    return <SignUpScreen onGoToSignIn={() => setCurrentScreen("signin")} />;
  }

  return (
    <SignInScreen
      onGoToSignUp={() => setCurrentScreen("signup")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
});
