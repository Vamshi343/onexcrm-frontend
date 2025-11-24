// src/components/AuthHeader.tsx
import { View, Image } from "react-native";

export default function AuthHeader() {
  return (
    <View style={{ alignItems: "center", marginBottom: 10 }}>
      <Image
        source={require("../assets/images/1x9.jpg")}
        style={{
          width: 230,
          height: 130,
          borderRadius: 32,
          marginTop: 10,
        //   shadowColor: "#7C3AED",
          shadowRadius: 18,
          shadowOpacity: 0.08,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
