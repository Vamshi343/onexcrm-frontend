// src/components/modals/ChangePasswordModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import authService from '../../services/authService';
import storageUtil from '../../services/storageUtil';
import apiClient from '../../services/apiClient'; // ✅ FIXED
import { API_ROUTES } from '../../config/apiRoutes';

type Props = {
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
};

export default function ChangePasswordModal({
  visible,
  onClose,
  onChanged,
}: Props) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [matchIndicator, setMatchIndicator] =
    useState<'match' | 'no' | ''>('');
  const [oldPassError, setOldPassError] = useState('');

  useEffect(() => {
    if (!newPassword || !confirm) setMatchIndicator('');
    else if (newPassword === confirm) setMatchIndicator('match');
    else setMatchIndicator('no');
  }, [newPassword, confirm]);

  const resetFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirm('');
    setMatchIndicator('');
    setOldPassError('');
  };

  const showPopup = (msg: string) => {
    setTimeout(() => {
      Platform.OS === 'web'
        ? window.alert(msg)
        : Alert.alert('Success', msg);
    }, 200);
  };

  const handleChange = async () => {
    if (!oldPassword || !newPassword || !confirm) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (newPassword !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const user = await storageUtil.getUser();
      if (!user) {
        Alert.alert('Error', 'Session expired. Please login again.');
        return;
      }

      const loginResp = await authService.login({
        userName: user.userName,
        userPassword: oldPassword,
      });

      if (!loginResp?.success) {
        setOldPassError('Current password is incorrect');
        return;
      }

      setOldPassError('');

      const payload = {
        id: user.id || user.appUserId,
        userPassword: newPassword,
      };

      
      const resp = await apiClient.post(
        API_ROUTES.USER.CHANGE_PASSWORD,
        payload
      );

      const data = resp?.data;

if (data?.success === true || data?.result >= 0) {
  setLoading(false);
  resetFields();
  onChanged?.();
  onClose();
  showPopup('Password changed successfully');
} else {
  setLoading(false);
  Alert.alert('Error', data?.message || 'Failed to change password');
}

    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || Platform.OS !== 'web') return null;

  return (
    <View style={styles.webBackdrop}>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>

        <TextInput
          placeholder="Current password"
          secureTextEntry
          value={oldPassword}
          onChangeText={(t) => {
            setOldPassword(t);
            setOldPassError('');
          }}
          style={[
            styles.input,
            oldPassError ? styles.inputErrorBorder : null,
          ]}
        />

        {oldPassError ? (
          <Text style={styles.errorText}>{oldPassError}</Text>
        ) : null}

        <TextInput
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm new password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
        />

        {matchIndicator === 'match' && (
          <Text style={styles.matchText}>✔ Passwords match</Text>
        )}
        {matchIndicator === 'no' && (
          <Text style={styles.noMatchText}>✖ Passwords do not match</Text>
        )}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              if (!loading) {
                resetFields();
                onClose();
              }
            }}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.changeButton]}
            onPress={handleChange}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.changeText}>CHANGE</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  webBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  container: {
    width: '90%',
    maxWidth: 760,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  inputErrorBorder: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 8 },
  matchText: { color: 'green', marginBottom: 6 },
  noMatchText: { color: 'red', marginBottom: 6 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  button: {
    minWidth: 120,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#03A9F4',
  },
  cancelText: { color: '#03A9F4', fontWeight: '700' },
  changeButton: { backgroundColor: '#03A9F4' },
  changeText: { color: '#fff', fontWeight: '700' },
});
