// src/screens/SignInScreen.tsx
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
  onGoToSignUp?: () => void;
};

export default function SignInScreen({ onGoToSignUp }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start();
  }, [fade, slide]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Optional: you can use a premium background image here.
          To use the image you uploaded, copy it into src/assets/images/background.png
          or set ImageBackground source to the uploaded path shown earlier:
          '/mnt/data/A_digital_screenshot_of_a_login_page_for_"ONEX9_Ad.png'
      */}
      
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.container}
        >
          <AuthHeader />

          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
            <Text style={styles.title}>Admin</Text>

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

            <TouchableOpacity
              onPress={() => {
                // Placeholder for auth action
                console.log("Login pressed", { email, password });
                alert("Login clicked (demo)\n" + (email ? `Email: ${email}` : "No email"));
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.helperRow}>
              <TouchableOpacity onPress={() => onGoToSignUp && onGoToSignUp()}>
                <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}
