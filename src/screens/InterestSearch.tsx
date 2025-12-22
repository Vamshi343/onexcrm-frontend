// src/screens/InterestSearch.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_ROUTES } from "../config/apiRoutes";
import apiClient from "../services/apiClient";

type InterestSearchProps = {
  onBack?: () => void;
};

export default function InterestSearch({ onBack }: InterestSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  /* -----------------------------------------------------
        SEARCH FUNCTION - FIXED ENDPOINT
  ----------------------------------------------------- */
  const performSearch = async (text: string) => {
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ FIXED: Using the correct endpoint with query parameter
      const res = await apiClient.get(
        `${API_ROUTES.DASHBOARD.SEARCH_INTEREST}?keyword=${encodeURIComponent(text)}`
      );
      console.log("🔍 InterestSearch API raw response:", res.data);
console.log("🔍 InterestSearch result:", res.data?.result);

      const list =
        res?.data?.result && Array.isArray(res.data.result)
          ? res.data.result
          : [];

      setResults(list);
      setSelected({});
      setSelectAll(false);
    } catch (err) {
      console.log("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
        DEBOUNCE SEARCH (350ms)
  ----------------------------------------------------- */
  useEffect(() => {
    const timeout = setTimeout(() => performSearch(keyword), 350);
    return () => clearTimeout(timeout);
  }, [keyword]);

  /* -----------------------------------------------------
        MANUAL BUTTON SEARCH
  ----------------------------------------------------- */
  const manualSearch = () => performSearch(keyword);

  /* -----------------------------------------------------
        INDIVIDUAL SELECTION
  ----------------------------------------------------- */
  const toggleSelect = (id: any) => {
    setSelected((prev) => {
      const updated: Record<string, boolean> = {
        ...prev,
        [id]: !prev[id],
      };

      const allSelected =
        results.length > 0 && results.every((item) => updated[item.id]);

      setSelectAll(allSelected);
      return updated;
    });
  };

  /* -----------------------------------------------------
        SELECT ALL
  ----------------------------------------------------- */
  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);

    const newSelected: Record<string, boolean> = {};
    results.forEach((item) => (newSelected[item.id] = newVal));

    setSelected(newSelected);
  };

  /* -----------------------------------------------------
        SEND SELECTED
  ----------------------------------------------------- */
  const handleSendSelected = () => {
    const selectedItems = results.filter((item) => selected[item.id]);

    if (selectedItems.length === 0) return alert("Select at least 1 customer");

    selectedItems.forEach((item) => {
      const interest = item.interest || "your interest";
      const msg = `Hi ${item.fullName}, regarding your interest in ${interest}...`;
      Linking.openURL(
        `https://wa.me/91${item.mobile}?text=${encodeURIComponent(msg)}`
      );
    });
  };

  /* -----------------------------------------------------
        INDIVIDUAL SEND
  ----------------------------------------------------- */
  const sendWhatsApp = (mobile: string, name: string, interest: string) => {
    const interestText = interest || "your interest";
    const msg = `Hi ${name}, regarding your interest in ${interestText}...`;
    Linking.openURL(
      `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: "#2563EB", marginBottom: 12 }}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Search Interested Customers</Text>

      {/* Search UI */}
      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search by interest"
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
          />

          <TouchableOpacity style={styles.searchBtn} onPress={manualSearch}>
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && results.length === 0 && keyword.length >= 2 && (
        <Text style={styles.noData}>No results found.</Text>
      )}

      {results.length > 0 && (
        <View style={styles.bulkRow}>
          <TouchableOpacity
            style={styles.selectAllRow}
            onPress={handleSelectAll}
          >
            <Ionicons
              name={selectAll ? "checkbox-outline" : "square-outline"}
              size={22}
              color="#2563EB"
            />
            <Text style={styles.selectTxt}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendBtn} onPress={handleSendSelected}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.sendTxt}>Send Selected</Text>
          </TouchableOpacity>
        </View>
      )}

      {results.map((item, idx) => (
        <View key={idx} style={styles.resultCard}>
          <TouchableOpacity
            onPress={() => toggleSelect(item.id)}
            style={styles.checkboxWrap}
          >
            <Ionicons
              name={selected[item.id] ? "checkbox-outline" : "square-outline"}
              size={24}
              color="#2563EB"
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.fullName || "Unnamed"}</Text>
            <Text style={styles.mobile}>{item.mobile}</Text>
            
            {/* ✅ FIXED: Use 'interest' field instead of 'notes' */}
            {item.interest && (
              <Text style={styles.note}>Interest: {item.interest}</Text>
            )}

            {item.email && (
              <Text style={styles.email}>{item.email}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.waBtn}
            onPress={() =>
              sendWhatsApp(item.mobile, item.fullName, item.interest)
            }
          >
            <Ionicons name="logo-whatsapp" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F4F7FB", flex: 1 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  searchCard: {
    backgroundColor: "#EEF3FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  searchBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#2563EB",
    marginLeft: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    marginTop: 40,
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },
  bulkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  selectAllRow: { flexDirection: "row", alignItems: "center" },
  selectTxt: { marginLeft: 8, fontSize: 15, fontWeight: "600" },
  sendBtn: {
    flexDirection: "row",
    backgroundColor: "#25D366",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  sendTxt: {
    marginLeft: 6,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
  },
  checkboxWrap: { justifyContent: "center", marginRight: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  mobile: { marginTop: 4, fontSize: 13, color: "#6B7280" },
  note: { marginTop: 4, color: "#374151", fontSize: 13 },
  email: { marginTop: 2, fontSize: 12, color: "#9CA3AF" },
  waBtn: {
    backgroundColor: "#25D366",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    alignSelf: "center",
  },
});