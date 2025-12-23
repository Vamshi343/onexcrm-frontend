import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import AppMenu from "../components/AppMenu";
import DashboardHeader from "../components/DashboardHeader";

import BottomNav from "../components/BottomNav";
import CategoryList from "../components/CategoryList";
import ContactsList from "../components/ContactsList";
import SubcategoryList from "../components/SubcategoryList";


import DashboardHome from "./DashboardHome";
import InterestSearch from "./InterestSearch";
import VisitFlow from "./VisitFlow";

import CategoryModal from "../components/modals/CategoryModal";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import ContactModal from "../components/modals/ContactModal";
import SubcategoryModal from "../components/modals/SubcategoryModal";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuType } from "../types/menu";


import { API_ROUTES } from "../config/apiRoutes";
import apiClient from "../services/apiClient";



/* ---------------- TYPES ---------------- */

// type MenuType =
//   | "dashboard"
//   | "categories"
//   | "subcategories"
//   | "contacts"
//   | "visit"
//   | "interest";

/* ---------------- HELPERS ---------------- */

function toArray(resp: any) {
  try {
    return resp?.data?.result ?? resp?.result ?? [];
  } catch {
    return [];
  }
}

/* ================== MAIN ================== */

export default function Dashboard({ user, onLogout }: any) {
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const [selectedMenu, setSelectedMenu] = useState<MenuType>("dashboard");

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});


  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCategories: 0,
    totalRecords: 0,
  });

  const [loaded, setLoaded] = useState({
    categories: false,
    subcategories: false,
    contacts: false,
  });

  const [refreshing, setRefreshing] = useState(false);

  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [editingContact, setEditingContact] = useState<any | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [visitKey, setVisitKey] = useState(0);
  const afterSaveInFlight = useRef<Promise<void> | null>(null);

  const [contactsLoading, setContactsLoading] = useState(false);


 const toggleExpandCategory = (id: string) => {
 // console.log('🔵 TOGGLE CALLED with ID:', id, 'Type:', typeof id);
  setExpandedCategories((prev) => {
    const newState = {
      ...prev,
      [String(id)]: !prev[String(id)],
    };
   // console.log('🟢 NEW expandedCategories:', newState);
    return newState;
  });
};



  /* ---------------- API CALLS ---------------- */

  const fetchStats = useCallback(async () => {
    try {
      const resp = await apiClient.get(API_ROUTES.DASHBOARD.STATS);
      const d = resp?.data?.result || {};

      setStats({
        totalContacts: d.totalContacts || 0,
        totalCategories: d.totalCategories || 0,
        totalRecords: d.totalRecords || 0,
      });
    } catch (err) {
      console.warn("fetchStats error:", err);
    }
  }, []);




  const fetchCategories = useCallback(async () => {
    try {
      const resp = await apiClient.get(API_ROUTES.COMMON.GET_CATEGORIES);
      setCategories(toArray(resp));
      setLoaded((p) => ({ ...p, categories: true }));
    } catch (err) {
      console.warn("fetchCategories error:", err);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    try {
      const resp = await apiClient.get(API_ROUTES.COMMON.GET_SUBCATEGORIES);
      setSubcategories(toArray(resp));
      setLoaded((p) => ({ ...p, subcategories: true }));
    } catch (err) {
      console.warn("fetchSubcategories error:", err);
    }
  }, []);




  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const resp = await apiClient.get(API_ROUTES.CONTACT.GET_ALL);
      setContacts(toArray(resp));
      setLoaded((p) => ({ ...p, contacts: true }));
    } catch (err) {
      console.warn("fetchContacts error:", err);
    } finally {
      setContactsLoading(false);
    }
  }, []);



  /* ---------------- EFFECTS ---------------- */

  // STATS — ONCE
const statsLoadedRef = useRef(false);
useEffect(() => {
  if (statsLoadedRef.current) return;
  statsLoadedRef.current = true;
  fetchStats();
}, [fetchStats]);

// CONTACTS
useEffect(() => {
  if (selectedMenu === "contacts" && !loaded.contacts && !contactsLoading) {
    fetchContacts();
  }
}, [selectedMenu, loaded.contacts, contactsLoading, fetchContacts]);

// MORE (CATEGORIES + SUBCATEGORIES)
useEffect(() => {
  if (selectedMenu === "categories") {
    if (!loaded.categories) {
      fetchCategories();
    }
    if (!loaded.subcategories) {
      fetchSubcategories();
    }
  }
}, [
  selectedMenu,
  loaded.categories,
  loaded.subcategories,
  fetchCategories,
  fetchSubcategories,
]);







  /* ---------------- REFRESH ---------------- */

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStats();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAfterSave = useCallback(() => {
  if (afterSaveInFlight.current) return afterSaveInFlight.current;

  const p = (async () => {
    await fetchStats();

    // 🔥 THIS IS THE MISSING PIECE
    if (selectedMenu === "contacts") {
      await fetchContacts();
    }
  })().finally(() => {
    afterSaveInFlight.current = null;
  });

  afterSaveInFlight.current = p;
  return p;
}, [fetchStats, fetchContacts, selectedMenu]);


  /* ---------------- RENDER ---------------- */
const renderContent = () => {
  /* ---------------- DASHBOARD ---------------- */
  if (selectedMenu === "dashboard") {
    return (
      <DashboardHome
        stats={stats}
        onStartVisit={() => {
          setVisitKey((v) => v + 1);
          setSelectedMenu("visit");
        }}
        onInterestSearch={() => setSelectedMenu("interest")}
      />
    );
  }

  /* ---------------- VISIT ---------------- */
  if (selectedMenu === "visit") {
    return (
      <VisitFlow
        key={`visit-${visitKey}`}
        categories={categories}
        subcategories={subcategories}
        loadCategories={fetchCategories}
        loadSubcategories={fetchSubcategories}
        onAfterSave={handleAfterSave}
        onBack={() => setSelectedMenu("dashboard")}
      />
    );
  }

  /* ---------------- INTEREST ---------------- */
  if (selectedMenu === "interest") {
    return <InterestSearch onBack={() => setSelectedMenu("dashboard")} />;
  }

  /* ---------------- CATEGORIES + SUBCATEGORIES (MORE TAB) ---------------- */
  if (selectedMenu === "categories") {
//     console.log('📊 Rendering CategoryList:');
//     console.log('  - categories:', categories.length, categories);
//     console.log('  - subcategories:', subcategories.length, subcategories);
// console.log('🔍 FIRST SUBCATEGORY FULL DATA:', JSON.stringify(subcategories[0], null, 2));
//     console.log('  - expandedCategories:', expandedCategories);
    
    if (!loaded.categories || !loaded.subcategories) {
      return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }

    return (
      <CategoryList
        categories={categories}
        subcategories={subcategories}

        /* ✅ REQUIRED FOR EXPAND / COLLAPSE */
        expandedCategories={expandedCategories}
        toggleExpandCategory={toggleExpandCategory}

        /* CATEGORY CRUD */
        onAdd={() => {
          setEditingCategory(null);
          setShowCategoryModal(true);
        }}
        onEdit={(c) => {
          setEditingCategory(c);
          setShowCategoryModal(true);
        }}
        onDelete={async (id, name) => {
          await apiClient.post(API_ROUTES.COMMON.DELETE_CATEGORY, { id });
          await Promise.all([
            fetchCategories(),
            fetchSubcategories(),
            fetchStats(),
          ]);
        }}

        /* SUBCATEGORY CRUD */
        onAddSub={(categoryId) => {
          setEditingSub({ categoryId });
          setShowSubModal(true);
        }}
        onEditSub={(s) => {
          setEditingSub(s);
          setShowSubModal(true);
        }}
        onDeleteSub={async (id, name) => {
          await apiClient.post(API_ROUTES.COMMON.DELETE_SUBCATEGORY, { id });
          await Promise.all([
            fetchSubcategories(),
            fetchStats(),
          ]);
        }}
      />
    );
  }

  /* ---------------- CONTACTS ---------------- */
  if (selectedMenu === "contacts") {
    if (contactsLoading) {
      return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }

    if (!loaded.contacts) {
      return (
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#2563EB",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => {
              setEditingContact(null);
              setShowContactModal(true);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Add Contact
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ContactsList
        contacts={contacts}
        onAdd={() => {
          setEditingContact(null);
          setShowContactModal(true);
        }}
        onEdit={(c) => {
          setEditingContact(c);
          setShowContactModal(true);
        }}
       onDelete={async (id) => {
  await apiClient.post(API_ROUTES.CONTACT.DELETE, { id });

  await Promise.all([
    fetchContacts(), // 🔥 REQUIRED
    fetchStats(),
  ]);
}}

      />
    );
  }

  return null;
};

  /* ---------------- JSX ---------------- */

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <DashboardHeader
  user={user}
  isMobile={isMobile}
  onLogout={onLogout}
  onToggleMenu={() => {
    if (!isMobile) {
      setMenuCollapsed(!menuCollapsed);
    }
  }}
  menuCollapsed={menuCollapsed}
  onChangePassword={() => setShowChangePassword(true)}
/>


        <View style={{ flex: 1, flexDirection: "row" }}>
          {!isMobile && (
            <AppMenu
              isMobile={false}
              visible
              collapsed={menuCollapsed}
              setCollapsed={setMenuCollapsed}
              selectedMenu={selectedMenu as any}
              setSelectedMenu={setSelectedMenu as any}
              onClose={() => {}}
            />
          )}

          

         <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{
    padding: 16,
    paddingBottom: isMobile ? 120 : 16, // 🔥 INCREASED FROM 96 to 120
    alignItems: "center",
  }}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  <View style={{ width: "100%", maxWidth: 480 }}>
    {renderContent()}
  </View>
</ScrollView>


        </View>

        {/* {isMobile && (
          <AppMenu
            isMobile
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            collapsed={false}
            setCollapsed={() => {}}
            selectedMenu={selectedMenu as any}
            setSelectedMenu={(m: any) => {
              setSelectedMenu(m);
              setMenuVisible(false);
            }}
          />
        )} */}

        <CategoryModal
          visible={showCategoryModal}
          editing={editingCategory}
          onClose={() => setShowCategoryModal(false)}
          onSaved={async () => {
            await Promise.all([fetchCategories(), fetchSubcategories(), fetchStats()]);
            setShowCategoryModal(false);
          }}
        />

        <SubcategoryModal
          visible={showSubModal}
          editing={editingSub}
          categories={categories}
          onClose={() => setShowSubModal(false)}
          onSaved={async () => {
            await Promise.all([fetchSubcategories(), fetchStats()]);
            setShowSubModal(false);
          }}
        />

        <ContactModal
  visible={showContactModal}
  editing={editingContact}
  onClose={() => setShowContactModal(false)}
  onSaved={async () => {
    await Promise.all([
      fetchContacts(), 
      fetchStats(),
    ]);
    setShowContactModal(false);
  }}
/>


        <ChangePasswordModal
          visible={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
{isMobile && (
  <View
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0, // 🔥 CHANGED FROM insets.bottom to 0
      height: 64 + insets.bottom, // 🔥 ADDED insets.bottom to height
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingBottom: insets.bottom, // 🔥 ADDED paddingBottom
    }}
  >
    <BottomNav
      active={selectedMenu}
      onChange={(m) => setSelectedMenu(m)}
    />
  </View>
)}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}