import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuType } from "../types/menu";

type Props = {
  active: MenuType;
  onChange: (m: MenuType) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  const items: { key: MenuType; label: string; icon: any }[] = [
    { key: "dashboard", label: "Home", icon: "home-outline" },
    { key: "contacts", label: "Contacts", icon: "people-outline" },
    { key: "visit", label: "Visit", icon: "walk-outline" },
    { key: "categories", label: "More", icon: "grid-outline" },
  ];

  return (
    <View style={styles.container}>
      {items.map((i) => {
        const isActive = active === i.key;
        return (
          <TouchableOpacity
            key={i.key}
            style={styles.item}
            onPress={() => onChange(i.key)}
          >
            <Ionicons
              name={i.icon}
              size={22}
              color={isActive ? "#2563EB" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#2563EB" : "#6B7280" },
              ]}
            >
              {i.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "600",
  },
});
