// src/screens/SignUpScreen.tsx
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
  ImageBackground,
} from "react-native";
import styles from "../styles/authStyles";
import AuthHeader from "../components/AuthHeader";

type Props = {
  onGoToSignIn?: () => void;
};

export default function SignUpScreen({ onGoToSignIn }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start();
  }, [fade, slide]);

  return (
    <SafeAreaView style={styles.safe}>
      
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.container}
        >
          <AuthHeader />

          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
            <Text style={styles.title}>Create account</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => {
                if (!email || !password) {
                  alert("Please enter email & password");
                  return;
                }
                if (password !== confirm) {
                  alert("Passwords do not match");
                  return;
                }
                // placeholder for api call
                console.log("Register pressed", { email });
                alert("Register clicked (demo)");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.helperRow}>
              <TouchableOpacity onPress={() => onGoToSignIn && onGoToSignIn()}>
                <Text style={styles.switchText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}
