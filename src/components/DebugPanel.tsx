import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { readPendingFromStorage, popPendingAction } from '../services/pendingService';
import { apiClient } from '../services/apiClient';

type Props = {
  visible: boolean;
  onClose: () => void;
  pendingActions: any[];
  lastApiLog: any;
  onReplayed?: () => void;
};

export default function DebugPanel({ visible, onClose, pendingActions = [], lastApiLog, onReplayed }: Props) {
  const replayAll = async () => {
    // naive replay: attempt to resubmit all pending actions sequentially
    try {
      const queue = await readPendingFromStorage();
      for (const a of queue) {
        try {
          if (a.entity === 'contact' && a.type === 'create') {
            await apiClient.post('/contact/saveContact', a.payload);
          } else if (a.entity === 'lead' && a.type === 'create') {
            await apiClient.post('/contact/saveLead', a.payload);
          } else if (a.entity === 'category' && a.type === 'create') {
            await apiClient.post('/common/saveCategory', a.payload);
          } else if (a.entity === 'subcategory' && a.type === 'create') {
            await apiClient.post('/common/saveSubcategory', a.payload);
          } else if (a.type === 'delete' && a.entity) {
            // try delete endpoints (best-effort)
            if (a.entity === 'category') await apiClient.post('/common/deleteCategory', { id: a.payload.id });
            if (a.entity === 'subcategory') await apiClient.post('/common/deleteSubcategory', { id: a.payload.id });
            if (a.entity === 'contact') await apiClient.post('/contact/deleteContact', { id: a.payload.id });
            if (a.entity === 'lead') await apiClient.post('/contact/deleteLead', { id: a.payload.id });
          }
          // remove successful ones from queue locally (pendingService.popPendingAction already available)
          await popPendingAction(a.id);
        } catch (err) {
          /* keep failing ones for later */
        }
      }
      if (onReplayed) onReplayed();
    } catch (e) {
      console.warn('replayAll failed', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Debug Panel</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            <Text style={styles.sectionTitle}>Pending Actions ({pendingActions.length})</Text>
            {pendingActions.length === 0 ? <Text style={styles.empty}>No pending actions</Text> : pendingActions.map((p: any) => (
              <View key={p.id} style={styles.block}>
                <Text style={{ fontWeight: '700' }}>{p.id}</Text>
                <Text>entity: {p.entity} • type: {p.type}</Text>
                <Text>payload: {JSON.stringify(p.payload)}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Last API Log</Text>
            <View style={styles.block}>
              <Text>{JSON.stringify(lastApiLog, null, 2)}</Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={replayAll}>
              <Text style={styles.btnText}>Replay Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnClose]} onPress={onClose}>
              <Text style={styles.btnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  content: { width: '100%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  close: { color: '#EF4444', fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '700' },
  scroll: { marginBottom: 12 },
  sectionTitle: { fontWeight: '700', marginTop: 8, marginBottom: 6 },
  block: { padding: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 8 },
  empty: { color: '#6B7280' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { padding: 12, backgroundColor: '#F59E0B', borderRadius: 8, marginLeft: 8 },
  btnClose: { backgroundColor: '#6B7280' },
  btnText: { color: '#fff', fontWeight: '700' },
});