// import { StyleSheet, Dimensions } from 'react-native';
// const { width } = Dimensions.get('window');
// const isMobileDefault = width < 768;

// export default StyleSheet.create({
//   // Layout
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, backgroundColor: '#F9FAFB' },
//   body: { flex: 1, flexDirection: 'row' },
//   mainContent: { flex: 1, padding: 16 },

//   // Header / top bar
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     height: 64,
//   },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerRight: { flexDirection: 'row', alignItems: 'center' },
//   logo: { width: 110, height: 80, borderRadius: 12 },
//   smallWelcome: { fontSize: 24, fontWeight: '600', marginLeft: 8 },
//   welcomeText: { fontSize: isMobileDefault ? 14 : 16, fontWeight: '300', color: '#374151' },
//   logoutButton: { padding: 8 },

//   // Sidebar / menu
//   sidebar: { width: 240, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#E5E7EB', paddingTop: 16, paddingHorizontal: 12, minHeight: '100%' },
//   sidebarCollapsed: { width: 64, alignItems: 'center' },
//   sidebarTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, marginBottom: 8 },
//   collapseBtn: { padding: 8 },
//   sidebarTitle: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase' },
//   sidebarList: { flex: 1 },

//   menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 4 },
//   menuItemCollapsed: { justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 6 },
//   menuItemActive: { backgroundColor: '#FEF3C7' },
//   menuLabel: { fontSize: 14, marginLeft: 12, color: '#6B7280', fontWeight: '500' },
//   menuLabelActive: { color: '#F59E0B', fontWeight: '600' },

//   // Mobile drawer / overlay
//   menuOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
//   mobileDrawer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '78%', maxWidth: 360, backgroundColor: '#fff', padding: 12, paddingTop: 34 },
//   drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   drawerTitle: { fontSize: 18, fontWeight: '700' },
//   drawerCloseBtn: { padding: 6 },
//   drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8 },
//   drawerItemActive: { backgroundColor: '#FEF3C7' },
//   drawerItemLabel: { marginLeft: 12, color: '#374151' },
//   drawerItemLabelActive: { color: '#F59E0B', fontWeight: '700' },

//   // Mobile horizontal menu
//   mobileMenu: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 8 },
//   mobileMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, marginRight: 8, backgroundColor: '#F3F4F6' },
//   mobileMenuItemActive: { backgroundColor: '#FEF3C7' },
//   mobileMenuLabel: { fontSize: 12, marginLeft: 6, color: '#6B7280', fontWeight: '500' },
//   mobileMenuLabelActive: { color: '#F59E0B', fontWeight: '600' },

//   // Content header / title
//   contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   contentTitle: { fontSize: 20, fontWeight: '700' },
//   pageHeader: { marginBottom: 12 },
//   contentCount: { color: '#666' },

//   // Inputs & buttons
//   input: { borderWidth: 1, borderColor: '#E6E6F0', padding: 12, borderRadius: 8, marginVertical: 8, backgroundColor: '#fff' },
//   modalInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
//   btnPrimary: { backgroundColor: '#F59E0B', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
//   btnPrimaryText: { color: '#fff', fontWeight: '700' },

//   // Cards, lists, modals
//   card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, minHeight: 200 },
//   emptyText: { textAlign: 'center', fontSize: 14, color: '#9CA3AF', marginTop: 30 },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
//   modalContent: { backgroundColor: '#FFF', borderRadius: 12, padding: 24, width: '100%', maxWidth: 600 },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

//   // Category / sub lists
//   categoryRow: { marginBottom: 10, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
//   categoryLeft: { flexDirection: 'row', alignItems: 'center' },
//   categoryActions: { flexDirection: 'row', alignItems: 'center' },
//   subList: { marginTop: 10, paddingLeft: 18 },
//   subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
//   subText: { marginLeft: 8, color: '#111827', fontWeight: '500' },

//   // Contacts / leads row
//   contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },

//   // Dropdowns
//   dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   dropdownItemActive: { backgroundColor: '#FEF3C7' },

//   // Add button & list item styles
//   addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 8, borderRadius: 8 },
//   listItemText: { fontSize: 15, fontWeight: '600', color: '#111827' },
//   listItemSubtext: { fontSize: 12, color: '#6B7280', marginTop: 2, marginLeft: 8 },

//   // optional hooks / legacy keys used in components
//   logoSmall: { height: 32, width: 120 },
// });




























// src/styles/dashboardStyles.ts
// Modern Jobs App inspired theme with blue primary color

import { StyleSheet } from 'react-native';

const colors = {
  primary: '#2196F3',        // Blue primary
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  secondary: '#4CAF50',      // Green accent
  background: '#F5F7FA',     // Light blue-grey background
  cardBg: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
};

export default StyleSheet.create({
  // Main container
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Page header
  pageHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  contentCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Modern card design
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },

  // Add button (floating style)
  addButton: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },

  // Category row (list item)
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // List item text styles
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listItemMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listItemSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Subcategory nested list
  subList: {
    marginTop: 12,
    marginLeft: 28,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.primaryLight,
  },

  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },

  subText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Empty state
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
  },

  // List item card variant
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
},

mobileDrawer: {
  width: 260,
  height: '100%',
  backgroundColor: '#fff',
  position: 'absolute',
  left: 0,
  top: 0,
  paddingTop: 40,
  paddingHorizontal: 12,
  borderRightWidth: 1,
  borderRightColor: '#E5E7EB',
},

drawerHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},

drawerTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#111827',
},

drawerItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 10,
  borderRadius: 8,
  marginBottom: 6,
},

drawerItemActive: {
  backgroundColor: '#FFF7E6',
},

drawerItemLabel: {
  marginLeft: 12,
  fontSize: 15,
  color: '#374151',
  fontWeight: '500',
},

drawerItemLabelActive: {
  color: '#F59E0B',
  fontWeight: '600',
},

});