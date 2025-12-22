// src/components/modals/SubcategoryModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import apiClient from "../../services/apiClient";
import { pushPendingAction } from "../../services/pendingService";
import { API_ROUTES } from "../../config/apiRoutes";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: any | null;
  categories?: any[];
  isEdit?: boolean;
};

export default function SubcategoryModal({
  visible,
  onClose,
  onSaved,
  editing = null,
  categories = [],
  isEdit = false,
}: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ----------------------------------------------
     LOAD EDITING DATA
  ------------------------------------------------*/
  useEffect(() => {
    setName(
      editing?.subcategoryName ??
        editing?.subCategoryName ??
        editing?.name ??
        ""
    );
    setCategoryId(editing?.categoryId ?? editing?.category_id ?? null);
  }, [editing, visible]);

  /* ----------------------------------------------
     CLOSE & CLEAR
  ------------------------------------------------*/
  const resetAndClose = () => {
    setName("");
    setCategoryId(null);
    onClose();
  };

  /* ----------------------------------------------
     SAVE SUBCATEGORY
  ------------------------------------------------*/
  const save = async () => {
    if (!name.trim() || !categoryId) {
      Alert.alert("Validation", "Please enter name & select category");
      return;
    }

    const payload: any = {
      subcategoryName: name.trim(),
      categoryId,
    };

    // If editing → include id
    if (editing && (editing.id || editing.subcategoryId)) {
      payload.id = editing.id ?? editing.subcategoryId;
    }

    setSaving(true);
    try {
      const response = await apiClient.post(API_ROUTES.SUBCATEGORY.SAVE, payload);
      const resp = response.data;

      // SUCCESS FROM BACKEND
      if (resp?.success || resp?.result || resp?.insertId) {
        onSaved?.();
        resetAndClose();
      } else {
        // SAVE TO QUEUE
        await pushPendingAction({
          id: `sub-${Date.now()}`,
          type: editing ? "update" : "create",
          entity: "subcategory",
          payload,
        });

        onSaved?.();
        resetAndClose();
        Alert.alert("Queued", "Saved offline & queued for sync.");
      }
    } catch (err) {
      // OFFLINE MODE
      await pushPendingAction({
        id: `sub-${Date.now()}`,
        type: editing ? "update" : "create",
        entity: "subcategory",
        payload,
      });

      onSaved?.();
      resetAndClose();
      Alert.alert("Offline", "Saved locally & will sync later.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  /* ----------------------------------------------
     UI
  ------------------------------------------------*/
  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding" })}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {isEdit ? "Edit Subcategory" : "Add Subcategory"}
          </Text>

          <View style={styles.body}>
            <Text style={styles.label}>Subcategory Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              editable={!saving}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Category</Text>
            <ScrollView style={styles.categoryList}>
              {(categories || []).map((c) => {
                const cid = String(c.categoryId ?? c.id);
                const selected = String(categoryId) === cid;

                return (
                  <TouchableOpacity
                    key={cid}
                    onPress={() => setCategoryId(c.categoryId ?? c.id)}
                    style={[
                      styles.categoryItem,
                      selected && styles.categoryItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextActive,
                      ]}
                    >
                      {c.categoryName ?? c.name ?? "Untitled"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={resetAndClose}
              disabled={saving}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={save}
              disabled={saving}
            >
              <Text style={[styles.buttonText, styles.primaryText]}>
                {isEdit ? "Save" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ----------------------------------------------
   STYLES
------------------------------------------------*/
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 520,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  body: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  categoryList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  categoryItemActive: {
    backgroundColor: "#EFF6FF",
  },
  categoryText: {
    fontSize: 14,
  },
  categoryTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  primaryButton: {
    backgroundColor: "#F59E0B",
  },
  buttonText: { fontWeight: "600" },
  cancelText: { color: "#111" },
  primaryText: { color: "#fff" },
});
