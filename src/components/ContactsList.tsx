import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

type Contact = {
  id?: any;
  contactId?: any;
  fullName?: string;
  mobile?: string;
  email?: string;
  raw?: any;
};

type Props = {
  contacts: Contact[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (c: Contact) => void;
  onDelete?: (id: any) => void;
};

const resolveId = (c: Contact) =>
  c?.contactId ?? c?.id ?? c?.raw?.contactId ?? c?.raw?.id ?? null;

export default function ContactsList({
  contacts = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    const query = searchQuery.toLowerCase();
    
    return contacts.filter((c) => {
      const name = (
        c?.fullName ||
        c?.raw?.fullName ||
        (c.raw as any)?.name ||
        ""
      ).toLowerCase();

      const mobile = (
        c?.mobile ||
        c?.raw?.mobile ||
        (c.raw as any)?.phone ||
        ""
      ).toLowerCase();

      const email = (
        c?.email ||
        c?.raw?.email ||
        ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        mobile.includes(query) ||
        email.includes(query)
      );
    });
  }, [contacts, searchQuery]);

  if (loading) {
    return (
      <View style={[styles.card, { paddingVertical: 32, alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 12 }}>
      {/* Header Row: Search + Add Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          gap: 10,
        }}
      >
        {/* Search Bar - Sleeker Design */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: searchQuery ? "#2196F3" : "#E5E7EB",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={searchQuery ? "#2196F3" : "#9CA3AF"}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              color: "#111827",
              paddingVertical: 2,
            }}
            placeholder="Search contacts..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={{ padding: 2 }}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Add Contact Button - Sleeker */}
        {onAdd && (
          <TouchableOpacity
            onPress={onAdd}
            style={{
              backgroundColor: "#2196F3",
              borderRadius: 10,
              padding: 10,
              shadowColor: "#2196F3",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Info - Lighter */}
      {searchQuery.trim() && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 12, color: "#9CA3AF", fontWeight: "500" }}>
            {filteredContacts.length} result{filteredContacts.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <View style={{ paddingTop: 60, alignItems: "center", opacity: 0.8 }}>
          <Ionicons
            name={searchQuery ? "search" : "people-outline"}
            size={70}
            color="#D1D5DB"
          />
          <Text style={styles.emptyText}>
            {searchQuery
              ? `No contacts found for "${searchQuery}"`
              : "No contacts available"}
          </Text>
          {searchQuery && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={{
                marginTop: 16,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#2196F3", fontWeight: "600" }}>
                Clear Search
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Contact List */}
      {filteredContacts.map((c) => {
        const id = String(resolveId(c) ?? Math.random().toString());

        // Safe fallback fields from raw response
        const name =
          c?.fullName ||
          c?.raw?.fullName ||
          (c.raw as any)?.name ||
          "Unnamed Contact";

        const mobile =
          c?.mobile ||
          c?.raw?.mobile ||
          (c.raw as any)?.phone ||
          "No mobile";

        const email = c?.email || c?.raw?.email || "";

        // Highlight search matches
        const highlightText = (text: string) => {
          if (!searchQuery.trim()) return text;
          
          const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
          return parts.map((part, i) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? (
              <Text key={i} style={{ backgroundColor: "#FEF3C7", fontWeight: "700" }}>
                {part}
              </Text>
            ) : (
              <Text key={i}>{part}</Text>
            )
          );
        };

        return (
          <View
            key={id}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 16,
              marginBottom: 14,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 6,
              elevation: 3,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Avatar Icon */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: "#E3F2FD",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#2196F3"
              />
            </View>

            {/* Contact Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#1A1A2E",
                }}
              >
                {highlightText(name)}
              </Text>

              <Text
                style={{
                  color: "#6B7280",
                  marginTop: 4,
                  fontSize: 13,
                }}
              >
                {highlightText(mobile)}
              </Text>

              {email ? (
                <Text
                  style={{
                    color: "#6B7280",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  {highlightText(email)}
                </Text>
              ) : null}
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={() => onEdit?.(c)}
              style={{
                padding: 10,
                backgroundColor: "#E3F2FD",
                borderRadius: 10,
                marginRight: 10,
              }}
            >
              <Ionicons name="create-outline" size={20} color="#2196F3" />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => onDelete?.(id)}
              style={{
                padding: 10,
                backgroundColor: "#FFEBEE",
                borderRadius: 10,
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}