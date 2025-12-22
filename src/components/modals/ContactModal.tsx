// src/components/modals/ContactModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
} from "react-native";

import apiClient from "../../services/apiClient";
import { API_ROUTES } from "../../config/apiRoutes";

/* -------------------------------------------------------------
   Convert to MySQL Datetime
------------------------------------------------------------- */
function toMySQLDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  } catch {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}

type Props = {
  visible: boolean;
  editing?: any | null;
  onClose: () => void;
  onSaved?: (saved?: any) => void;
};

export default function ContactModal({
  visible,
  editing = null,
  onClose,
  onSaved,
}: Props) {
  /* -------------------------------------------------------------
     DEFAULT VALUES
  ------------------------------------------------------------- */
  const defaults = {
    contactId: null,
    clientId: null,
    branchId: null,
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    dob: "",
    anniversary: "",
    tag: "",
    notes: "",
    isActive: true,
    createdBy: null,
    createdOn: new Date().toISOString(),
  };

  const [form, setForm] = useState<any>(defaults);
  const [saving, setSaving] = useState(false);

  /* -------------------------------------------------------------
     LOAD EDITING DATA
  ------------------------------------------------------------- */
  useEffect(() => {
    if (editing) {
      const src = { ...(editing.raw ?? {}), ...editing };

      setForm({
        contactId: src.contactId ?? src.id ?? null,
        clientId: src.clientId ?? null,
        branchId: src.branchId ?? null,
        fullName: src.fullName ?? src.name ?? "",
        mobile: src.mobile ?? src.phone ?? "",
        email: src.email ?? "",
        address: src.address ?? "",
        city: src.city ?? "Hyderabad",
        state: src.state ?? "Telangana",
        country: src.country ?? "India",
        dob: src.dob ?? "",
        anniversary: src.anniversary ?? "",
        tag: src.tag ?? "",
        notes: src.notes ?? "",
        isActive:
          typeof src.isActive === "boolean" ? src.isActive : true,
        createdBy: src.createdBy ?? null,
        createdOn:
          src.createdOn ??
          src.created_on ??
          src.createdAt ??
          new Date().toISOString(),
      });
    } else {
      setForm(defaults);
    }
  }, [editing, visible]);

  const setField = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  /* -------------------------------------------------------------
     SAVE CONTACT
  ------------------------------------------------------------- */
  const handleSave = async () => {
    if (!form.fullName.trim())
      return Alert.alert("Validation", "Full name is required");

    if (!form.mobile.trim())
      return Alert.alert("Validation", "Mobile is required");

    const payload = {
      contactId: form.contactId,
      clientId: form.clientId,
      branchId: form.branchId,
      fullName: form.fullName,
      mobile: form.mobile,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      dob: form.dob,
      anniversary: form.anniversary,
      tag: form.tag,
      notes: form.notes,
      isActive: form.isActive ? 1 : 0,
      createdBy: form.createdBy,
      createdOn: toMySQLDateTime(form.createdOn),
    };

    setSaving(true);
    try {
      const response = await apiClient.post(API_ROUTES.CONTACT.SAVE, payload);
      const resp = response.data;

      const insertId =
        resp?.insertId ??
        resp?.result?.insertId ??
        (typeof resp?.result === "number" ? resp.result : null);

      const savedItem = {
  contactId: insertId ?? payload.contactId ?? null,
  clientId: payload.clientId ?? null,
  branchId: payload.branchId ?? null,
  fullName: payload.fullName,
  mobile: payload.mobile,
  email: payload.email,
  address: payload.address,
  city: payload.city,
  state: payload.state,
  country: payload.country,
  dob: payload.dob,
  anniversary: payload.anniversary,
  tag: payload.tag,
  notes: payload.notes,
  isActive: payload.isActive,
  createdBy: payload.createdBy,
  createdOn: payload.createdOn,
  raw: { ...payload } // stored separately, does NOT merge with above
};


     onSaved?.(savedItem);

      Alert.alert("Success", resp?.message ?? "Contact saved");
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding" })}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {form.contactId ? "Edit Contact" : "Add Contact"}
          </Text>

         <ScrollView
  showsVerticalScrollIndicator={false}
  style={styles.form}
  contentContainerStyle={{
    paddingBottom: 50, // 👈 THIS FIXES IT
  }}
  keyboardShouldPersistTaps="handled"
>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={(t) => setField("fullName", t)}
            />

            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={form.mobile}
              onChangeText={(t) => setField("mobile", t)}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => setField("email", t)}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Tag / Company</Text>
            <TextInput
              style={styles.input}
              value={form.tag}
              onChangeText={(t) => setField("tag", t)}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.address}
              onChangeText={(t) => setField("address", t)}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={form.city}
                  onChangeText={(t) => setField("city", t)}
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={form.state}
                  onChangeText={(t) => setField("state", t)}
                />
              </View>
            </View>

            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={form.country}
              onChangeText={(t) => setField("country", t)}
            />

            <Text style={styles.label}>DOB (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={form.dob}
              onChangeText={(t) => setField("dob", t)}
            />

            <Text style={styles.label}>Anniversary (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={form.anniversary}
              onChangeText={(t) => setField("anniversary", t)}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active</Text>
              <Switch
                value={!!form.isActive}
                onValueChange={(v) => setField("isActive", v)}
              />
            </View>

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.notes}
              onChangeText={(t) => setField("notes", t)}
              multiline
            />
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.cancel]}
              onPress={() => !saving && onClose()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.save]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* -------------------------------------------------------------
   STYLES
------------------------------------------------------------- */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 720,
    maxHeight: "90%",
    overflow: "hidden",
  },
  title: {
    textAlign: "center",
    paddingVertical: 14,
    fontWeight: "700",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  multiline: {
    textAlignVertical: "top",
    minHeight: 70,
  },
  row: {
    flexDirection: "row",
    columnGap: 10,
  },
  col: {
    flex: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  cancel: {
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    color: "#111",
    fontWeight: "600",
  },
  save: {
    backgroundColor: "#F59E0B",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
