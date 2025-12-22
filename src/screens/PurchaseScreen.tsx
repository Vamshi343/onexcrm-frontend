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

const PurchaseScreen = ({ route, navigation }: any) => {
  const { contact, contactVisit } = route.params;

  const [amount, setAmount] = useState("");
  const [qty, setQty] = useState("");
  const [weight, setWeight] = useState("");
  const [employeeId, setEmployeeId] = useState(
    contactVisit.employeeId ? String(contactVisit.employeeId) : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSavePurchase = async () => {
    if (!amount.trim()) {
      Alert.alert("Validation", "Please enter purchase amount");
      return;
    }

    const payload = {
      id: contactVisit.id || contactVisit.contactVisitId,
      contactId: contact.contactId,
      isPurchased: true,
      purchasedAmount: Number(amount),
      purchasedQty: qty ? Number(qty) : null,
      purchasedWeight: weight ? Number(weight) : null,
      employeeId: employeeId ? Number(employeeId) : null,
    };

    try {
      setSaving(true);

      const res = await contactService.saveVisit(payload);

      navigation.replace("VisitSummary", {
        contact,
        contactVisit: { ...payload, id: res.result },
      });
    } catch {
      Alert.alert("Error", "Failed to save purchase");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Purchase Details</Text>
      <Text style={styles.subtitle}>{contact.fullName}</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
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
        onPress={handleSavePurchase}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Save Purchase"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PurchaseScreen;

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
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
