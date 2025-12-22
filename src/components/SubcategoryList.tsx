import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/dashboardStyles';

type Props = {
  subcategories?: any[];
  categories?: any[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (s: any) => void;
  onDelete?: (id: number | string, name: string) => void;
};

/* ------------------------------------------------------------------
   Safe ID Resolver: prevents undefined id crashes
------------------------------------------------------------------ */
const resolveId = (s: any) =>
  s?.subcategoryId ??
  s?.subCategoryId ??
  s?.id ??
  s?.raw?.subcategoryId ??
  s?.raw?.id ??
  null;

/* ------------------------------------------------------------------
   Safe Name Resolver: backend can send many variations
------------------------------------------------------------------ */
const resolveSubName = (s: any) =>
  s?.subcategoryName ||
  s?.subCategoryName ||
  s?.name ||
  s?.raw?.subcategoryName ||
  s?.raw?.name ||
  "Untitled";

/* ------------------------------------------------------------------
   Safe Category Name Resolver
------------------------------------------------------------------ */
const resolveCategoryName = (categories: any[], catId: any) => {
  if (!catId) return "";
  const idStr = String(catId);

  const found = categories.find(
    c =>
      String(c?.categoryId ??
             c?.catId ??
             c?.id ??
             c?.raw?.categoryId ??
             c?.raw?.id) === idStr
  );

  return (
    found?.categoryName ||
    found?.catName ||
    found?.name ||
    found?.raw?.categoryName ||
    found?.raw?.name ||
    ""
  );
};

export default function SubcategoryList({
  subcategories = [],
  categories = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
}: Props) {

  if (loading) {
    return (
      <View style={[styles.card, { paddingVertical: 32, alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 12 }}>
      {/* ADD SUBCATEGORY */}
      {onAdd && (
        <View style={{ alignItems: "flex-end", marginBottom: 14 }}>
          <TouchableOpacity
            onPress={onAdd}
            style={[
              styles.addButton,
              {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 14,
              },
            ]}
          >
            <Ionicons name="add-circle" size={20} color="#2196F3" />
            <Text style={{ marginLeft: 6, fontWeight: "700", color: "#1976D2" }}>
              Add Subcategory
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ REMOVED ScrollView - Parent handles scrolling */}
      <View>
        {/* EMPTY */}
        {subcategories.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 50 }}>
            <Ionicons name="document-text-outline" size={70} color="#D1D5DB" />
            <Text style={styles.emptyText}>No subcategories found</Text>
          </View>
        )}

        {/* LIST */}
        {subcategories.map((s) => {
          const id = String(resolveId(s) ?? Math.random().toString());
          const name = resolveSubName(s);

          const categoryName = resolveCategoryName(
            categories,
            s?.categoryId ?? s?.catId ?? s?.category_id ?? s?.raw?.categoryId
          );

          return (
            <View
              key={id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 16,
                marginBottom: 14,
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 6,
                elevation: 3,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* ICON */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#E8F5E9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Ionicons name="document-text" size={24} color="#4CAF50" />
              </View>

              {/* TEXT */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#1A1A2E",
                  }}
                >
                  {name}
                </Text>

                {categoryName ? (
                  <View style={{ flexDirection: "row", marginTop: 4 }}>
                    <Ionicons name="folder-outline" size={14} color="#6B7280" />
                    <Text
                      style={{
                        marginLeft: 6,
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      {categoryName}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* EDIT */}
              <TouchableOpacity
                onPress={() => onEdit?.(s)}
                style={{
                  padding: 10,
                  backgroundColor: "#E3F2FD",
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <Ionicons name="create-outline" size={20} color="#2196F3" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                onPress={() => onDelete?.(id, name)}
                style={{
                  padding: 10,
                  backgroundColor: "#FFEBEE",
                  borderRadius: 10,
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}