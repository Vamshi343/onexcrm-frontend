import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import contactService from "../services/contactService";

const CustomerDetailsScreen = ({ route, navigation }: any) => {
  const { mobile, contact: existingContact, isNew } = route.params;

  const [form, setForm] = useState({
    id: existingContact?.contactId,
    fullName: existingContact?.fullName || "",
    mobile,
    email: existingContact?.email || "",
    address: existingContact?.address || "",
    city: existingContact?.city || "",
    state: existingContact?.state || "",
    country: existingContact?.country || "",
    tag: existingContact?.tag || "",
    notes: existingContact?.notes || "",
    isActive: existingContact?.isActive ?? true,
  });

  const [saving, setSaving] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAndStartVisit = async () => {
    if (!form.fullName.trim()) {
      Alert.alert("Validation", "Please enter customer name");
      return;
    }

    try {
      setSaving(true);

      const res = await contactService.save(form);

      navigation.navigate("VisitForm", {
        contact: { ...form, contactId: res.result },
      });
    } catch {
      Alert.alert("Error", "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isNew ? "New Customer" : "Customer Details"}
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={form.fullName}
        onChangeText={t => updateField("fullName", t)}
      />

      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#E5E7EB" }]}
        value={form.mobile}
        editable={false}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={t => updateField("email", t)}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={form.city}
        onChangeText={t => updateField("city", t)}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={form.notes}
        multiline
        onChangeText={t => updateField("notes", t)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveAndStartVisit}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Save & Start Visit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
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
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
