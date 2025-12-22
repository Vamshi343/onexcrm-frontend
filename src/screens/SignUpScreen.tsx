// src/screens/SignUpScreen.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/authStyles";
import AuthHeader from "../components/AuthHeader";

import apiClient from "../services/apiClient";
import { API_ROUTES } from "../config/apiRoutes";

type Props = {
  onGoToSignIn?: () => void;
  onRegisterSuccess?: () => void;
};

/* ---------------- PASSWORD STRENGTH ---------------- */
function getPasswordScore(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

export default function SignUpScreen({ onGoToSignIn, onRegisterSuccess }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);
  const [registeredName, setRegisteredName] = useState<string | null>(null);

  const passwordScore = getPasswordScore(password);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, []);

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert("⚠️ Validation Error", "Please enter your full name");
      return;
    }
    if (!userName.trim()) {
      Alert.alert("⚠️ Validation Error", "Please enter a username");
      return;
    }
    if (userName.length < 3) {
      Alert.alert("⚠️ Validation Error", "Username must be at least 3 characters long");
      return;
    }
    if (!password.trim()) {
      Alert.alert("⚠️ Validation Error", "Please enter a password");
      return;
    }
    if (password.length < 8) {
      Alert.alert("⚠️ Validation Error", "Password must be at least 8 characters long");
      return;
    }
    if (passwordScore < 2) {
      Alert.alert(
        "⚠️ Weak Password",
        "Use at least 8 characters, upper & lower case, and a number or symbol."
      );
      return;
    }
    if (password !== confirm) {
      Alert.alert("⚠️ Validation Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        userName: userName.trim().toLowerCase(),
        userPassword: password,
        isActive: 1,
        roleId: 2,
      };

      const resp = await apiClient.post(API_ROUTES.USER.REGISTER, payload);
      const data = resp.data;

      if (data?.success) {
        setRegisteredName(fullName);
        setShowRegisteredPopup(true);

        setTimeout(() => {
          setShowRegisteredPopup(false);
          setRegisteredName(null);
          setFullName("");
          setUserName("");
          setPassword("");
          setConfirm("");
          onRegisterSuccess?.();
          onGoToSignIn?.();
        }, 1200);
      } else {
        Alert.alert(
          "❌ Registration Failed",
          data?.message || "Username already exists"
        );
      }
    } catch (err: any) {
      Alert.alert(
        "🔌 Connection Error",
        err?.message || "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const CARD_UP_OFFSET = Platform.OS === "web" ? -6 : -2;

  const strengthBarColor = (index: number) => {
    if (passwordScore === 0) return "#E5E7EB";
    if (passwordScore === 1) return index === 0 ? "#F97316" : "#E5E7EB";
    if (passwordScore === 2) return index <= 1 ? "#F59E0B" : "#E5E7EB";
    return "#10B981";
  };

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        <AuthHeader />

        <Animated.View
          style={[
            styles.card,
            { opacity: fade, transform: [{ translateY: slide }], marginTop: CARD_UP_OFFSET },
          ]}
        >
          <Text style={styles.title}>Create Account</Text>

          <View style={{ marginBottom: 14 }}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <TextInput
              value={userName}
              onChangeText={(t) => setUserName(t.toLowerCase())}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={{ marginBottom: 10, width: "100%", position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (min 8 characters)"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 50 }]}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 15, top: 14, padding: 5 }}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#6B7280" />
            </TouchableOpacity>

            <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
              Use at least 8 characters, with upper & lower case, and a number or symbol.
            </Text>

            <View style={{ flexDirection: "row", marginTop: 6, gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: strengthBarColor(i),
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 18, width: "100%", position: "relative" }}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirm}
              style={[styles.input, { paddingRight: 50 }]}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={{ position: "absolute", right: 15, top: 14, padding: 5 }}
            >
              <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity
              onPress={handleRegister}
              style={[styles.button, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.buttonText}>Creating account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.helperRow}>
            <TouchableOpacity onPress={onGoToSignIn} disabled={loading}>
              <Text style={styles.switchText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Modal visible={showRegisteredPopup} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.18)",
            }}
          >
            <View
              style={{
                backgroundColor: "#111827",
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 8,
                minWidth: 220,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {registeredName ? `${registeredName} registered` : "Registered"}
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
