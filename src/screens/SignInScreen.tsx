import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/authStyles";
import AuthHeader from "../components/AuthHeader";
import authService from "../services/authService";

type Props = {
  onGoToSignUp?: () => void;
  onLoginSuccess?: (user: any) => void;
};

export default function SignInScreen({ onGoToSignUp, onLoginSuccess }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [showSignedInPopup, setShowSignedInPopup] = useState(false);
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!userName.trim()) {
      Alert.alert("⚠️ Validation Error", "Please enter your username");
      return;
    }
    if (!password.trim()) {
      Alert.alert("⚠️ Validation Error", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        userName: userName.trim(),
        userPassword: password,
      });

      if (!response.success) {
        Alert.alert("❌ Login Failed", response.message || "Invalid credentials");
        setPassword("");
        return;
      }

      // ✅ ONLY THESE TWO — NO result, NO data
      const { token, user } = response;

      if (!token || !user) {
        Alert.alert("Error", "Invalid login response from server");
        return;
      }

      // Popup
      setSignedInUser(user?.fullName ?? user?.userName ?? userName);
      setShowSignedInPopup(true);

      setTimeout(() => {
        setShowSignedInPopup(false);
        setSignedInUser(null);
      }, 1400);

      onLoginSuccess?.(user);
      setPassword("");
    } catch (err: any) {
      Alert.alert(
        "🔌 Connection Error",
        err?.message || "Unable to connect to server."
      );
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        <AuthHeader showTagline={false} />

        <Animated.View
          style={[
            styles.card,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue to your dashboard
          </Text>

          {/* USERNAME */}
          <View style={{ position: "relative", width: "100%", marginBottom: 16 }}>
            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter your username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              style={[
                styles.input,
                { paddingLeft: 48 },
                usernameFocused && styles.inputFocused,
              ]}
              editable={!loading}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
            />
            <View style={{ position: "absolute", left: 16, top: 16 }}>
              <Ionicons
                name="person-outline"
                size={20}
                color={usernameFocused ? "#2196F3" : "#9CA3AF"}
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={{ position: "relative", width: "100%", marginBottom: 20 }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                { paddingLeft: 48, paddingRight: 50 },
                passwordFocused && styles.inputFocused,
              ]}
              editable={!loading}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <View style={{ position: "absolute", left: 16, top: 16 }}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordFocused ? "#2196F3" : "#9CA3AF"}
              />
            </View>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 15, top: 15, padding: 5 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* SIGN IN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator color="#FFFFFF" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Authenticating...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* SIGN UP LINK */}
<TouchableOpacity
  onPress={onGoToSignUp}
  style={{ marginTop: 18, alignItems: "center" }}
>
  <Text style={{ color: "#2563EB", fontWeight: "600" }}>
    Don’t have an account? Sign Up
  </Text>
</TouchableOpacity>

        </Animated.View>

        {/* SUCCESS POPUP */}
        <Modal visible={showSignedInPopup} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          >
            <View
              style={{
                backgroundColor: "#2196F3",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                minWidth: 220,
                alignItems: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={32} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}>
                {signedInUser
                  ? `${signedInUser} signed in`
                  : "Signed in"}
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
