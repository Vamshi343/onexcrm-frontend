// src/styles/authStyles.ts
import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  safe: {
    flex: 2,
    // backgroundColor: "#F7F8FA",
    backgroundColor: "#ffffffff",
  },

  container: {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
  paddingHorizontal: 24,
  paddingTop: 5, // Move everything up, less gap below logo
},

  headerWrap: {
    alignItems: "center",
    marginBottom: 20, // ⬅ reduce gap
  },

  logoImage: {
    width: 1, // ⬅ slightly smaller, looks premium
    height: 58,
  },

  brandTitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    // color: "#6D28D9",
    letterSpacing: 0.8,
  },

  card: {
  width: "100%",
  maxWidth: 400,
  backgroundColor: "rgba(255,255,255,0.98)",
  borderRadius: 20,
  paddingVertical: 38,
  paddingHorizontal: 22,
  marginTop: 10, // Less space below logo
  borderWidth: 0.7,
  borderColor: "#e4d8fe",
  // shadowColor: "#7C3AED",
  shadowOpacity: 0.12,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 14 },
  elevation: 7,
},


  title: {
    textAlign: "center",
    fontSize: 22, // ⬅ slightly smaller for clean look
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24, // ⬅ reduce excessive spacing
  },

  button: {
  width: "100%",
  // backgroundColor: "#7C3AED",
  backgroundColor: "#ffa200de",
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
  shadowColor: "#7C3AED",
  shadowOpacity: 0.1,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
},
buttonText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  letterSpacing: 1.1,
},
input: {
  width: "100%",
  backgroundColor: "#F6F8FC",
  borderRadius: 10,
  paddingVertical: 13,
  paddingHorizontal: 15,
  marginBottom: 32,
  fontSize: 15.5,
  color: "#23263A",
  borderWidth: 1.3,
  borderColor: "#dedcee",
  shadowColor: "#7C3AED",
  shadowOpacity: 0.03,
  shadowRadius: 8,
},


  helperRow: {
    marginTop: 12,
    alignItems: "center",
  },

  switchText: {
    // color: "#7C3AED",
    fontWeight: "600",
  },

  smallText: {
    color: "#6B7280",
    fontSize: 12.5, // ⬅ small but readable
    textAlign: "center",
  },
});
