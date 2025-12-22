import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import contactService from "../services/contactService";

const VisitFormScreen = ({ route, navigation }: any) => {
  const { contact } = route.params;

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [productNote, setProductNote] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveVisit = async () => {
    if (!categoryId.trim()) {
      Alert.alert("Validation", "Please enter category");
      return;
    }

    const visit = {
      contactId: contact.contactId,
      visitDate: new Date().toISOString(),
      categoryId: categoryId ? Number(categoryId) : null,
      subcategoryId: subcategoryId ? Number(subcategoryId) : null,
      productNote,
      isPurchased: false,
      purchasedAmount: null,
      purchasedQty: null,
      purchasedWeight: null,
      employeeId: employeeId ? Number(employeeId) : null,
    };

    try {
      setSaving(true);

      const res = await contactService.saveVisit(visit);

      Alert.alert(
        "Visit saved",
        "Did the customer purchase?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () =>
              navigation.replace("VisitSummary", {
                contact,
                contactVisit: { ...visit, id: res.result },
              }),
          },
          {
            text: "Yes",
            onPress: () =>
              navigation.replace("Purchase", {
                contact,
                contactVisit: { ...visit, id: res.result },
              }),
          },
        ],
        { cancelable: false }
      );
    } catch {
      Alert.alert("Error", "Failed to save visit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Visit</Text>
      <Text style={styles.subtitle}>{contact.fullName}</Text>

      <Text style={styles.label}>Category Id</Text>
      <TextInput
        style={styles.input}
        value={categoryId}
        onChangeText={setCategoryId}
      />

      <Text style={styles.label}>Subcategory Id</Text>
      <TextInput
        style={styles.input}
        value={subcategoryId}
        onChangeText={setSubcategoryId}
      />

      <Text style={styles.label}>Product Note</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={productNote}
        onChangeText={setProductNote}
        multiline
      />

      <Text style={styles.label}>Employee Id</Text>
      <TextInput
        style={styles.input}
        value={employeeId}
        onChangeText={setEmployeeId}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveVisit}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Save Visit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VisitFormScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F3F4F6" },
  title: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  label: { fontSize: 14, marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
