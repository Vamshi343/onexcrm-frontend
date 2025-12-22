import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_KEY = '@onex9_pending_actions_v1';

export type PendingAction = {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'contact' | 'lead' | 'category' | 'subcategory';
  payload: any;
};

export const readPendingFromStorage = async (): Promise<PendingAction[]> => {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('readPendingFromStorage error', e);
    return [];
  }
};

export const savePendingActions = async (arr: PendingAction[]) => {
  try {
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('savePendingActions error', e);
  }
};

export const pushPendingAction = async (action: PendingAction) => {
  try {
    const current = await readPendingFromStorage();
    const arr = [...current, action];
    await savePendingActions(arr);
    if (__DEV__) console.log('[pendingService] pushed', action.id, action.entity, action.type);
  } catch (e) {
    console.warn('pushPendingAction error', e);
  }
};

export const popPendingAction = async (id: string) => {
  try {
    const current = await readPendingFromStorage();
    const arr = current.filter(a => a.id !== id);
    await savePendingActions(arr);
    if (__DEV__) console.log('[pendingService] popped', id);
  } catch (e) {
    console.warn('popPendingAction error', e);
  }
};