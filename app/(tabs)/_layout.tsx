import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null, // ❌ remove text
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
