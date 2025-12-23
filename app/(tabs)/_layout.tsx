import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // 🔥 THIS IS THE KEY FIX
        tabBarStyle: {
          height: 56,
          paddingBottom: Platform.OS === "android" ? 0 : 10,
        },

        tabBarItemStyle: {
          paddingVertical: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
