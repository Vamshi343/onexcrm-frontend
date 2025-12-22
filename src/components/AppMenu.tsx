// src/components/AppMenu.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

type MenuKey =
  | "dashboard"
  | "categories"
  | "subcategories"
  | "contacts"
  | "visit";

type Props = {
  isMobile: boolean;
  visible: boolean;
  onClose: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  selectedMenu: MenuKey;
  setSelectedMenu: (m: MenuKey) => void;
};

const COLLAPSED_WIDTH = 72;

const menuItems: { id: MenuKey; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: "speedometer-outline" },
  { id: "categories", label: "Product Categories", icon: "grid-outline" },
  { id: "subcategories", label: "Sub Categories", icon: "layers-outline" },
  { id: "contacts", label: "Contacts", icon: "people-outline" },
 
  { id: "visit", label: "Customer Visit", icon: "walk-outline" },
];

export default function AppMenu({
  isMobile,
  visible,
  onClose,
  collapsed,
  setCollapsed,
  selectedMenu,
  setSelectedMenu,
}: Props) {
  /* MOBILE DRAWER */
  if (isMobile) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.mobileDrawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>

            <TouchableOpacity
              onPress={onClose}
              style={{ padding: 6 }}
            >
              <Ionicons
                name="close"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {menuItems.map((mi) => (
              <TouchableOpacity
                key={mi.id}
                style={[
                  styles.drawerItem,
                  selectedMenu === mi.id && styles.drawerItemActive,
                ]}
                onPress={() => {
                  setSelectedMenu(mi.id);
                  onClose();
                }}
              >
                <Ionicons
                  name={mi.icon}
                  size={20}
                  color={
                    selectedMenu === mi.id ? "#F59E0B" : "#6B7280"
                  }
                />

                <Text
                  style={[
                    styles.drawerItemLabel,
                    selectedMenu === mi.id &&
                      styles.drawerItemLabelActive,
                  ]}
                >
                  {mi.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  /* DESKTOP SIDEBAR */
  return (
    <View
      style={{
        width: collapsed ? COLLAPSED_WIDTH : 240,
        backgroundColor: "#F9FAFB",
        borderRightWidth: 1,
        borderRightColor: "#E5E7EB",
        paddingTop: 20,
        height: "100%",
      }}
    >
      <View
        style={{
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: collapsed ? 0 : 12,
          marginBottom: 20,
        }}
      >
        {!collapsed && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#374151",
            }}
          >
            Menu
          </Text>
        )}

        <TouchableOpacity
          onPress={() => setCollapsed(!collapsed)}
          style={{ padding: 6 }}
        >
          <Ionicons
            name={collapsed ? "chevron-forward" : "chevron-back"}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      <View>
        {menuItems.map((mi) => (
          <TouchableOpacity
            key={mi.id}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: collapsed ? 0 : 14,
                marginBottom: 4,
                borderRadius: 8,
              },
              selectedMenu === mi.id && {
                backgroundColor: "#FFF7E6",
                borderLeftWidth: 4,
                borderLeftColor: "#F59E0B",
              },
              collapsed && { justifyContent: "center" },
            ]}
            onPress={() => setSelectedMenu(mi.id)}
          >
            <Ionicons
              name={mi.icon}
              size={22}
              color={
                selectedMenu === mi.id ? "#F59E0B" : "#6B7280"
              }
              style={!collapsed ? { marginRight: 12 } : {}}
            />

            {!collapsed && (
              <Text
                style={{
                  color:
                    selectedMenu === mi.id
                      ? "#F59E0B"
                      : "#374151",
                  fontSize: 15,
                  fontWeight:
                    selectedMenu === mi.id ? "600" : "500",
                }}
              >
                {mi.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
