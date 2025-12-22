// src/components/DashboardHeader.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  user?: any;
  isMobile?: boolean;
  onLogout?: () => void;
  onToggleMenu?: () => void;
  menuCollapsed?: boolean;
  onChangePassword?: () => void;
};

export default function DashboardHeader({
  user,
  isMobile,
  onLogout,
  onToggleMenu,
  menuCollapsed,
  onChangePassword,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName =
    user?.fullName ?? user?.name ?? user?.userName ?? (user ? "User" : "");
  
  // Get first letter for avatar
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";
  
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 12,
          paddingBottom: 8,
          minHeight: 64 + insets.top,
        },
      ]}
    >
      {/* LEFT SIDE */}
      <View style={styles.left}>
        {/* Toggle Menu Button */}
        {!isMobile && (
          <TouchableOpacity onPress={onToggleMenu}>
            <Ionicons name="menu" size={24} />
          </TouchableOpacity>
        )}

        {/* LOGO + Welcome */}
        <View style={styles.logoWrap}>
          <Image
            source={require("../assets/images/1x9.jpg")}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.right}>
        {displayName ? (
          <>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => setMenuOpen(true)}
            >
              <Text style={styles.signedInLabel}>{displayName}</Text>
            </TouchableOpacity>

            {/* MODERN AVATAR - Choose your preferred option below */}
            
            {/* OPTION 1: Initials Avatar (RECOMMENDED - Most Modern) */}
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setMenuOpen(true)}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            </TouchableOpacity>

           
          </>
        ) : null}
      </View>

      {/* DROPDOWN MENU */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menu}>
            {/* Menu Header with Avatar */}
            <View style={styles.menuHeader}>
              <View style={styles.menuAvatarCircle}>
                <Text style={styles.menuAvatarText}>{initial}</Text>
              </View>
              <Text style={styles.menuHeading}>{displayName}</Text>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onChangePassword?.();
              }}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color="#374151"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.menuItemText}>Change password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 4 }]}
              onPress={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#EF4444"
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.menuItemText, { color: "#EF4444" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    zIndex: 5,
  },

  /* LEFT SIDE */
  left: { flexDirection: "row", alignItems: "center" },
  menuButton: { padding: 6, marginRight: 12 },

  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoImg: {
    width: 110,
    height: 45,
    borderRadius: 8,
    marginRight: 10,
  },

  /* RIGHT SIDE */
  right: { flexDirection: "row", alignItems: "center", gap: 8 },

  userInfo: { marginRight: 2 },
  signedInLabel: { 
    color: "#374151", 
    fontSize: 15,
    fontWeight: "500",
  },

  avatarButton: { paddingHorizontal: 4 },

  /* AVATAR STYLES - OPTION 1: Initials (RECOMMENDED) */
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
     borderWidth: 2,           
    borderColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  /* AVATAR STYLES - OPTION 2: Outlined */
  avatarOutlined: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  
  avatarSolid: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  /* DROPDOWN MENU */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  menu: {
    width: 260,
    marginTop: 75,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },

  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  menuAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  menuAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  menuHeading: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111827",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },

  menuItemText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
});