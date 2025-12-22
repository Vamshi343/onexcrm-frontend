// src/components/modals/CategoryModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import apiClient from '../../services/apiClient';
import { pushPendingAction } from '../../services/pendingService';
import { API_ROUTES } from '../../config/apiRoutes';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: any | null;
};

export default function CategoryModal({
  visible,
  onClose,
  onSaved,
  editing,
}: Props) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------
     Load data when editing
  ------------------------------------------------------ */
  useEffect(() => {
    setName(
      editing?.categoryName ??
      editing?.name ??
      editing?.raw?.categoryName ??
      editing?.raw?.name ??
      ''
    );
  }, [editing, visible]);

  const resetAndClose = () => {
    setName('');
    onClose();
  };

  /* ------------------------------------------------------
     Save Category (Add / Update)
  ------------------------------------------------------ */
  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a category name');
      return;
    }

    const payload: any = {
      categoryName: name.trim(),
    };

    if (editing) {
      // UPDATE mode
      payload.categoryId =
        editing?.categoryId ??
        editing?.id ??
        editing?.raw?.categoryId ??
        editing?.raw?.id;
    }

    setSaving(true);

    try {
      const response = await apiClient.post(API_ROUTES.CATEGORY.SAVE, payload);
      const resp = response?.data;

      if (resp?.success) {
        onSaved();
        resetAndClose();
      } else {
        // fallback to pending queue
        await pushPendingAction({
          id: `category-${Date.now()}`,
          type: editing ? "update" : "create",
          entity: "category",
          payload,
        });

        onSaved();
        resetAndClose();
        Alert.alert("Queued", "Saved locally and queued for sync.");
      }
    } catch (err) {
      await pushPendingAction({
        id: `category-${Date.now()}`,
        type: editing ? "update" : "create",
        entity: "category",
        payload,
      });

      onSaved();
      resetAndClose();
      Alert.alert("Offline", "Saved locally and queued.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !saving && resetAndClose()}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {editing ? "Edit Category" : "Add Category"}
          </Text>

          <View style={styles.body}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={name}
              onChangeText={setName}
              editable={!saving}
            />
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
                {editing ? "Save" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    ...(Platform.OS === 'web'
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }
      : null),
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111827',
  },
  body: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    minWidth: 96,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: '#111827',
  },
  primaryText: {
    color: '#FFFFFF',
  },
});
