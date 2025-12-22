// src/screens/VisitFlow.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_ROUTES } from "../config/apiRoutes";
import apiClient from "../services/apiClient";

/* ----------------------------- TYPES ----------------------------- */

type Step =
  | "lookup"
  | "details"
  | "visit"
  | "purchaseQuestion"
  | "purchase"
  | "summary";

type Contact = {
  contactId?: number;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  country: string;
  notes: string;
};

type VisitState = {
  categoryId: string;
  subcategoryId: string;
  productNote: string;
};

type PurchaseState = {
  amount: string;
  qty: string;
};

type Props = {
  categories: any[];
  subcategories: any[];
  loadCategories?: () => Promise<void>;
  loadSubcategories?: () => Promise<void>;
  onAfterSave?: () => Promise<any> | void;
  onBack?: () => void;
};

const today = new Date().toISOString().split("T")[0];

/* ----------------------------- DROPDOWN ----------------------------- */

function Dropdown({
  label,
  placeholder,
  value,
  options,
  onChange,
  closeSignal,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  closeSignal?: any;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    setOpen(false);
  }, [closeSignal]);

  return (
    <View style={{ marginBottom: 16, zIndex: open ? 1000 : 1 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen((p) => !p)}
      >
        <Text style={{ color: selected ? "#000" : "#999" }}>
          {selected?.label || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#666"
        />
      </TouchableOpacity>

      {open && options.length > 0 && (
        <ScrollView
          style={styles.dropdownList}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {options.map((o, index) => (
            <TouchableOpacity
              key={`${o.value}-${index}`}
              style={[
                styles.dropdownItem,
                index === options.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {open && options.length === 0 && (
        <View style={styles.dropdownList}>
          <View style={styles.dropdownItem}>
            <Text style={{ color: "#999", textAlign: "center" }}>
              No options available
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/* ----------------------------- MAIN ----------------------------- */

export default function VisitFlow({
  categories: propCategories,
  subcategories: propSubcategories,
  loadCategories,
  loadSubcategories,
  onAfterSave,
  onBack,
}: Props) {
  const [step, setStep] = useState<Step>("lookup");
  const [mobile, setMobile] = useState("");

  const isMobileValid = /^[6-9]\d{9}$/.test(mobile.trim());

  const [contact, setContact] = useState<Contact>({
    fullName: "",
    mobile: "",
    email: "",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    notes: "",
  });

  const [visit, setVisit] = useState<VisitState>({
    categoryId: "",
    subcategoryId: "",
    productNote: "",
  });

  const [purchase, setPurchase] = useState<PurchaseState>({
    amount: "",
    qty: "",
  });

  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [localSubcategories, setLocalSubcategories] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const savingRef = useRef(false);
  const dataLoadedRef = useRef(false);

  /* ----------------------------- LOAD DATA ----------------------------- */

  const loadData = async () => {
    if (dataLoadedRef.current || loadingData) return;

    setLoadingData(true);
    dataLoadedRef.current = true;

    try {
      // Load categories
      if (loadCategories) {
        await loadCategories();
      } else {
        const catResp = await apiClient.get(API_ROUTES.COMMON.GET_CATEGORIES);
        const cats = Array.isArray(catResp?.data?.result) 
          ? catResp.data.result 
          : Array.isArray(catResp?.data) 
          ? catResp.data 
          : [];
        setLocalCategories(cats);
      }

      // Load subcategories
      if (loadSubcategories) {
        await loadSubcategories();
      } else {
        const subResp = await apiClient.get(
          API_ROUTES.COMMON.GET_SUBCATEGORIES
        );
        const subs = Array.isArray(subResp?.data?.result) 
          ? subResp.data.result 
          : Array.isArray(subResp?.data) 
          ? subResp.data 
          : [];
        setLocalSubcategories(subs);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load categories and subcategories");
    } finally {
      setLoadingData(false);
    }
  };

  // Load data when visit step is reached
  useEffect(() => {
    if (step === "visit" && !dataLoadedRef.current) {
      loadData();
    }
  }, [step]);

  // Use either prop data or local data
  const categories =
    propCategories && propCategories.length > 0
      ? propCategories
      : localCategories;
  const subcategories =
    propSubcategories && propSubcategories.length > 0
      ? propSubcategories
      : localSubcategories;

  /* ----------------------------- VALIDATIONS ----------------------------- */

 const validateLookup = () => {
  const trimmed = mobile.trim();

  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    setTimeout(() => {
      Alert.alert(
        "Invalid Mobile Number",
        "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
        [{ text: "OK" }]
      );
    }, 0);

    return false;
  }

  return true;
};



  const validateDetails = () => {
    if (!contact.fullName.trim()) {
      Alert.alert("Missing", "Customer name is required");
      return false;
    }
    if (!contact.mobile.trim()) {
      Alert.alert("Missing", "Mobile number is required");
      return false;
    }
    return true;
  };

  const validateVisit = () => {
    if (!visit.categoryId) {
      Alert.alert("Required", "Please select a category");
      return false;
    }
    if (!visit.subcategoryId) {
      Alert.alert("Required", "Please select a subcategory");
      return false;
    }
    if (!visit.productNote.trim()) {
      Alert.alert("Required", "Please enter product note");
      return false;
    }
    return true;
  };

  const validatePurchase = () => {
    if (!purchase.amount.trim()) {
      Alert.alert("Missing", "Enter purchase amount");
      return false;
    }
    if (!purchase.qty.trim()) {
      Alert.alert("Missing", "Enter quantity");
      return false;
    }
    if (isNaN(Number(purchase.amount)) || Number(purchase.amount) <= 0) {
      Alert.alert("Invalid", "Enter valid amount");
      return false;
    }
    if (isNaN(Number(purchase.qty)) || Number(purchase.qty) <= 0) {
      Alert.alert("Invalid", "Enter valid quantity");
      return false;
    }
    return true;
  };

  /* ----------------------------- LOOKUP ----------------------------- */

  const handleLookup = async () => {
    if (!validateLookup()) return;

    try {
      console.log("🔍 Searching for mobile:", mobile.trim());
      
      // Check if clientId header is being sent
      //console.log("📋 Request headers:", apiClient.defaults.headers);
      
      // Try searchMobile API first
      const res = await apiClient.post(API_ROUTES.CONTACT.SEARCH_MOBILE, {
        mobile: mobile.trim(),
      });

      console.log("📦 Response Data:", res?.data);
      console.log("📊 Data Count:", res?.data?.dataCount);
      console.log("📊 Result:", res?.data?.result);

      let found = null;

      // Check if result has data (now it returns single object, not array)
      if (res?.data?.result && res.data.result !== null) {
        found = res.data.result;
        console.log("✅ Contact found from searchMobile:", found);
      }

      // FALLBACK: If searchMobile returns null, try getting all contacts and filter
      if (!found && res?.data?.dataCount === 0) {
        console.log("⚠️ searchMobile returned null (dataCount=0), trying getAllContacts...");
        
        try {
          const allContactsRes = await apiClient.get(API_ROUTES.CONTACT.GET_ALL);
          const allContacts = allContactsRes?.data?.result || allContactsRes?.data || [];
          
          console.log("📋 Total contacts fetched:", Array.isArray(allContacts) ? allContacts.length : 0);
          
          // Find contact by mobile
          if (Array.isArray(allContacts)) {
            found = allContacts.find((c: any) => {
              const contactMobile = String(c.mobile || c.phone || "").trim();
              const searchMobile = mobile.trim();
              console.log(`🔍 Comparing: ${contactMobile} === ${searchMobile}`);
              return contactMobile === searchMobile;
            });
            
            if (found) {
              console.log("✅ Found by filtering all contacts:", found);
            } else {
              console.log("❌ Not found in all contacts. Available mobiles:", 
                allContacts.map((c: any) => c.mobile).join(", ")
              );
            }
          }
        } catch (fallbackError) {
          console.error("❌ Fallback getAllContacts failed:", fallbackError);
        }
      }

      // Check if we have a valid contact
      if (found && (found.id || found.contactId)) {
        const loadedContact = {
          contactId: found.id || found.contactId,
          fullName: found.fullName || found.full_name || found.name || "",
          mobile: found.mobile || found.phone || mobile.trim(),
          email: found.email || "",
          city: found.city || "Hyderabad",
          state: found.state || "Telangana",
          country: found.country || "India",
          notes: found.notes || found.note || "",
        };
        
        console.log("✅ SETTING CONTACT STATE:", loadedContact);
        setContact(loadedContact);
        
        Alert.alert(
          "✅ Existing Customer Found",
          `Name: ${loadedContact.fullName || 'Not set'}\nMobile: ${loadedContact.mobile}`,
          [{ text: "OK" }]
        );
      } else {
        console.log("❌ No valid contact found - treating as NEW customer");
        console.log("❌ This could mean:");
        console.log("   1. Contact doesn't exist in database");
        console.log("   2. clientId header is missing or incorrect");
        console.log("   3. Mobile number format doesn't match in DB");
        
        setContact({
          fullName: "",
          mobile: mobile.trim(),
          email: "",
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          notes: "",
        });
        
       
      }

      setStep("details");
    } catch (error) {
      
      
      
      // Proceed as new customer on error
      setContact({
        fullName: "",
        mobile: mobile.trim(),
        email: "",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        notes: "",
      });
      
      
      setStep("details");
    }
  };

  /* ----------------------------- SAVE VISIT (OPTIMIZED - NO DUPLICATE SAVES) ----------------------------- */

  const saveVisit = async (isPurchased: boolean) => {
    if (savingRef.current) return;

    if (!validateVisit()) return;
    if (isPurchased && !validatePurchase()) return;

    savingRef.current = true;

    try {
      let contactId = contact.contactId;

      // CRITICAL LOGIC:
      // Case 1: New customer (no contactId) - MUST save contact first to get ID
      // Case 2: Existing customer with purchase - Update contact details
      // Case 3: Existing customer NO purchase - DO NOT touch contact at all
      
    if (!contactId && isPurchased) {
  console.log("New customer with purchase - saving contact");

  try {
    const cRes = await apiClient.post(API_ROUTES.CONTACT.SAVE, {
      ...contact,
    });

    const savedId =
      cRes?.data?.result ||
      cRes?.data?.data ||
      cRes?.data?.id;

    if (savedId) {
      contactId = Number(savedId);
    } else {
      console.warn("Contact saved but ID not returned:", cRes?.data);
    }
  } catch (e) {
    console.warn("Contact save failed, continuing visit save", e);
  }

} else if (contactId && isPurchased) {
  console.log("Existing customer with purchase - updating contact");

  try {
    await apiClient.post(API_ROUTES.CONTACT.SAVE, {
      ...contact,
    });
  } catch (e) {
    console.warn("Contact update failed, continuing visit save", e);
  }

} else {
  console.log("No purchase - skipping contact save");
}

     
      // Save visit
      const visitPayload = {
        contactId,
        visitDate: today,
        categoryId: Number(visit.categoryId),
        subcategoryId: Number(visit.subcategoryId),
        productNote: visit.productNote.trim(),
        isPurchased: isPurchased ? 1 : 0,
        purchasedAmount: isPurchased ? Number(purchase.amount) : null,
        purchasedQty: isPurchased ? Number(purchase.qty) : null,
      };

      console.log("Saving visit:", visitPayload);
      await apiClient.post(API_ROUTES.CONTACT.SAVE_VISIT, visitPayload);

      // Refresh stats
      if (onAfterSave) {
        await onAfterSave();
      }

      setStep("summary");
    } catch (error) {
  console.error("Save visit error:", error);

  // ONLY show error if VISIT API failed
  Alert.alert(
    "Error",
    "Visit could not be saved. Please try again."
  );
}
 finally {
      savingRef.current = false;
    }
  };

  /* ----------------------------- BACK HANDLER ----------------------------- */

  const handleBack = () => {
    if (step === "lookup") {
      onBack?.();
      return;
    }

    if (step === "details") setStep("lookup");
    else if (step === "visit") setStep("details");
    else if (step === "purchaseQuestion") setStep("visit");
    else if (step === "purchase") setStep("purchaseQuestion");
    else if (step === "summary") onBack?.();
  };

  /* ----------------------------- RESET FLOW ----------------------------- */

  const resetFlow = () => {
    setMobile("");
    setContact({
      fullName: "",
      mobile: "",
      email: "",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      notes: "",
    });
    setVisit({
      categoryId: "",
      subcategoryId: "",
      productNote: "",
    });
    setPurchase({ amount: "", qty: "" });
    setStep("lookup");
  };

  /* ----------------------------- PREPARE DROPDOWN OPTIONS ----------------------------- */

  const categoryOptions = categories.map((c) => ({
    label: c.categoryName || c.name || "Unnamed Category",
    value: String(c.categoryId || c.id),
  }));

  const subcategoryOptions = subcategories
    .filter((s) => {
      const catId =
        s?.categoryId || s?.catId || s?.category_id || s?.raw?.categoryId;
      return String(catId) === visit.categoryId;
    })
    .map((s) => ({
      label:
        s?.subcategoryName ||
        s?.subCategoryName ||
        s?.name ||
        "Unnamed Subcategory",
      value: String(s?.subcategoryId || s?.subCategoryId || s?.id),
    }));

  /* ----------------------------- UI ----------------------------- */

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 10 }}
    >
      {/* BACK BUTTON */}
      <TouchableOpacity onPress={handleBack} style={styles.backRow}>
        <Ionicons name="arrow-back" size={20} color="#2563EB" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* LOOKUP STEP */}
      {step === "lookup" && (
        <View style={styles.card}>
          <Text style={styles.title}>Customer Lookup</Text>
          <Text style={styles.subtitle}>
            Enter mobile number to search for existing customer
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit mobile number"
            keyboardType="number-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
            autoFocus
          />

          <TouchableOpacity
  style={[
    styles.btn,
    !isMobileValid && { backgroundColor: "#9CA3AF" },
  ]}
  onPress={handleLookup}
  disabled={!isMobileValid}
>
  <Text style={styles.btnText}>Continue</Text>
</TouchableOpacity>

        </View>
      )}

      {/* DETAILS STEP */}
      {step === "details" && (
        <View style={styles.card}>
          <Text style={styles.title}>Customer Details</Text>
          <Text style={styles.subtitle}>
            {contact.contactId
              ? "Update customer information"
              : "Enter new customer details"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={contact.fullName}
            onChangeText={(t) => setContact({ ...contact, fullName: t })}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile Number *"
            value={contact.mobile}
            onChangeText={(t) => setContact({ ...contact, mobile: t })}
            keyboardType="phone-pad"
            maxLength={10}
            editable={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={contact.email}
            onChangeText={(t) => setContact({ ...contact, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={contact.city}
            onChangeText={(t) => setContact({ ...contact, city: t })}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="State"
            value={contact.state}
            onChangeText={(t) => setContact({ ...contact, state: t })}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Country"
            value={contact.country}
            onChangeText={(t) => setContact({ ...contact, country: t })}
            autoCapitalize="words"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Additional Notes"
            value={contact.notes}
            onChangeText={(t) => setContact({ ...contact, notes: t })}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => validateDetails() && setStep("visit")}
          >
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VISIT STEP */}
      {step === "visit" && (
        <View style={styles.card}>
          <Text style={styles.title}>Visit Details</Text>
          <Text style={styles.subtitle}>
            Select category and product information
          </Text>

          {loadingData ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={{ marginTop: 12, color: "#666" }}>
                Loading categories...
              </Text>
            </View>
          ) : (
            <>
              <Dropdown
                label="Category *"
                placeholder="Select category"
                value={visit.categoryId}
                options={categoryOptions}
                closeSignal={visit.categoryId}
                onChange={(v: string) =>
                  setVisit({ ...visit, categoryId: v, subcategoryId: "" })
                }
              />

              <Dropdown
                label="Subcategory *"
                placeholder={
                  visit.categoryId
                    ? "Select subcategory"
                    : "Select category first"
                }
                value={visit.subcategoryId}
                options={subcategoryOptions}
                closeSignal={visit.categoryId}
                onChange={(v: string) =>
                  setVisit({ ...visit, subcategoryId: v })
                }
              />

              <Text style={styles.label}>Product Note *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product details, specifications, or notes"
                value={visit.productNote}
                onChangeText={(t) => setVisit({ ...visit, productNote: t })}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.btn}
                onPress={() => validateVisit() && setStep("purchaseQuestion")}
              >
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* PURCHASE QUESTION STEP */}
      {step === "purchaseQuestion" && (
        <View style={styles.card}>
          <Text style={styles.title}>Purchase Status</Text>
          <Text style={styles.subtitle}>
            Did the customer make a purchase today?
          </Text>

          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[styles.choice, styles.choiceYes]}
              onPress={() => setStep("purchase")}
            >
              <Ionicons name="checkmark-circle" size={32} color="#fff" />
              <Text style={styles.choiceText}>YES</Text>
              <Text style={styles.choiceSubtext}>Customer purchased</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choice, styles.choiceNo]}
              onPress={() => saveVisit(false)}
            >
              <Ionicons name="close-circle" size={32} color="#fff" />
              <Text style={styles.choiceText}>NO</Text>
              <Text style={styles.choiceSubtext}>No purchase made</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PURCHASE STEP */}
      {step === "purchase" && (
        <View style={styles.card}>
          <Text style={styles.title}>Purchase Details</Text>
          <Text style={styles.subtitle}>Enter purchase information</Text>

          <Text style={styles.label}>Purchase Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="decimal-pad"
            value={purchase.amount}
            onChangeText={(t) => setPurchase({ ...purchase, amount: t })}
          />

          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            keyboardType="number-pad"
            value={purchase.qty}
            onChangeText={(t) => setPurchase({ ...purchase, qty: t })}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => saveVisit(true)}
            disabled={savingRef.current}
          >
            {savingRef.current ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Save Visit</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* SUMMARY STEP */}
      {step === "summary" && (
        <View style={styles.card}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>

          <Text style={styles.title}>Visit Saved Successfully!</Text>
          <Text style={styles.subtitle}>
            The visit has been recorded in the system
          </Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Customer:</Text>
            <Text style={styles.summaryValue}>{contact.fullName}</Text>

            <Text style={styles.summaryLabel}>Mobile:</Text>
            <Text style={styles.summaryValue}>{contact.mobile}</Text>

            {purchase.amount && (
              <>
                <Text style={styles.summaryLabel}>Purchase Amount:</Text>
                <Text style={styles.summaryValue}>₹{purchase.amount}</Text>

                <Text style={styles.summaryLabel}>Quantity:</Text>
                <Text style={styles.summaryValue}>{purchase.qty}</Text>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.btn} onPress={resetFlow}>
            <Text style={styles.btnText}>Record New Visit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={onBack}
          >
            <Text style={styles.btnTextSecondary}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  backText: {
    color: "#2563EB",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },

  textArea: {
    height: 100,
    paddingTop: 14,
  },

  btn: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  btnSecondary: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2563EB",
    marginTop: 12,
  },
  btnTextSecondary: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 16,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  dropdownList: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 10000,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#1F2937",
  },

  choiceRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  choice: {
    flex: 1,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  choiceYes: {
    backgroundColor: "#10B981",
  },

  choiceNo: {
    backgroundColor: "#EF4444",
  },

  choiceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 8,
  },

  choiceSubtext: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },

  successIcon: {
    alignItems: "center",
    marginBottom: 16,
  },

  summaryBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    fontWeight: "500",
  },

  summaryValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: 4,
  },
});