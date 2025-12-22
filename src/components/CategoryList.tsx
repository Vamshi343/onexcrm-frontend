import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/dashboardStyles';

export type MenuType =
  | 'dashboard'
  | 'categories'
  | 'subcategories'
  | 'contacts'
  | 'visit'
  | 'interest';

type Category = any;
type Subcategory = any;

type Props = {
  categories?: Category[];
  subcategories?: Subcategory[];
  selectedMenu?: MenuType;
  loading?: boolean;
  expandedCategories?: Record<string, boolean>;
  toggleExpandCategory?: (id: any) => void;
  subListForCategory?: (id: any) => any[];
  onAdd?: () => void;
  onEdit?: (c: any) => void;
  onDelete?: (id: any, name: string) => void;
  onAddSub?: (catId: any) => void;
  onEditSub?: (s: any) => void;
  onDeleteSub?: (id: any, name: string) => void;
};

export default function CategoryList({
  categories = [],
  subcategories = [],
  selectedMenu,
  loading = false,
  expandedCategories = {},
  toggleExpandCategory,
  subListForCategory = () => [],
  onAdd,
  onEdit,
  onDelete,
  onAddSub,
  onEditSub,
  onDeleteSub,
}: Props) {
  const ICON_HIT = { top: 10, bottom: 10, left: 10, right: 10 };

  // ✅ FIX: Check 'id' field FIRST (categories use 'id', not 'categoryId')
  const resolveCategoryId = (cat: any) => {
    const id = cat?.id ?? cat?.categoryId ?? cat?.catId ?? cat?.raw?.categoryId ?? cat?.raw?.id ?? Math.random().toString();
    return String(id);
  };

  const resolveCategoryName = (cat: any) =>
    cat?.categoryName ||
    cat?.catName ||
    cat?.name ||
    cat?.raw?.categoryName ||
    cat?.raw?.name ||
    'Untitled';

  const resolveSubId = (s: any) =>
    s?.subcategoryId ??
    s?.subCategoryId ??
    s?.id ??
    s?.raw?.subcategoryId ??
    s?.raw?.id ??
    Math.random().toString();

  const resolveSubName = (s: any) =>
    s?.subcategoryName ||
    s?.subCategoryName ||
    s?.name ||
    s?.raw?.subcategoryName ||
    s?.raw?.name ||
    'Untitled';

  // ✅ FIX: Ensure we return a string
  const resolveSubCategoryCatId = (s: any) => {
    const id = s?.categoryId ?? s?.catId ?? s?.category_id ?? s?.raw?.categoryId ?? s?.raw?.catId ?? '';
    return String(id);
  };

  const getSubList = (catId: string) => {
    try {
      // Always use subcategories prop if available
      if (Array.isArray(subcategories) && subcategories.length > 0) {
        const filtered = subcategories.filter((s) => {
          // Direct comparison - subcategory.categoryId === category.id
          const subCategoryId = s?.categoryId ?? s?.catId ?? s?.category_id ?? '';
          return String(subCategoryId) === String(catId);
        });
        return filtered;
      }
      // Fallback to function if provided
      if (subListForCategory && typeof subListForCategory === 'function') {
        const res = subListForCategory(catId);
        if (Array.isArray(res)) return res;
      }
      return [];
    } catch (error) {
      console.error('getSubList error:', error);
      return [];
    }
  };

  return (
    <View style={{ paddingHorizontal: 12 }}>
      {/* ADD CATEGORY */}
      {onAdd && (
        <View style={{ alignItems: 'flex-end', marginBottom: 14 }}>
          <TouchableOpacity
            onPress={onAdd}
            style={[
              styles.addButton,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 14,
              },
            ]}
          >
            <Ionicons name="add-circle" size={20} color="#2196F3" />
            <Text
              style={{
                marginLeft: 6,
                fontWeight: '700',
                color: '#1976D2',
              }}
            >
              Add Category
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LOADING */}
      {loading && (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}

      {/* EMPTY */}
      {!loading && categories.length === 0 && (
        <View style={{ alignItems: 'center', paddingTop: 50 }}>
          <Ionicons name="folder-open-outline" size={70} color="#D1D5DB" />
          <Text style={styles.emptyText}>No categories found</Text>
        </View>
      )}

      {categories.map((cat) => {
        const catId = resolveCategoryId(cat);
        const name = resolveCategoryName(cat);
        const expanded = !!expandedCategories[catId];
        const subs = getSubList(catId);

        return (
          <View
            key={catId}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 14,
              marginBottom: 14,
              shadowColor: '#000',
              shadowOpacity: 0.07,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* CATEGORY HEADER */}
            <TouchableOpacity
              onPress={() => toggleExpandCategory?.(catId)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: expanded ? '#2196F3' : '#E3F2FD',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="folder" size={20} color={expanded ? '#fff' : '#2196F3'} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: expanded ? '#1976D2' : '#1A1A2E',
                  }}
                >
                  {name}
                </Text>

                {subs.length > 0 && (
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                    {subs.length} subcategor{subs.length === 1 ? 'y' : 'ies'}
                  </Text>
                )}
              </View>

              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />
            </TouchableOpacity>

            {/* CATEGORY ACTIONS */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => onAddSub?.(catId)}
                hitSlop={ICON_HIT}
                style={{
                  padding: 8,
                  backgroundColor: '#E8F5E9',
                  borderRadius: 10,
                }}
              >
                <Ionicons name="add-outline" size={18} color="#4CAF50" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onEdit?.(cat)}
                hitSlop={ICON_HIT}
                style={{
                  marginLeft: 10,
                  padding: 8,
                  backgroundColor: '#E3F2FD',
                  borderRadius: 10,
                }}
              >
                <Ionicons name="create-outline" size={18} color="#2196F3" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete?.(catId, name)}
                hitSlop={ICON_HIT}
                style={{
                  marginLeft: 10,
                  padding: 8,
                  backgroundColor: '#FFEBEE',
                  borderRadius: 10,
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {/* SUBCATEGORY LIST */}
            {expanded && subs.length > 0 && (
              <View style={{ marginTop: 16, paddingLeft: 6 }}>
                {subs.map((s) => {
                  const sid = String(resolveSubId(s));
                  const sname = resolveSubName(s);

                  return (
                    <View
                      key={sid}
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#F5F7FA',
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        marginBottom: 10,
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="document-text" size={18} color="#6B7280" style={{ marginRight: 10 }} />

                      <Text style={{ flex: 1, fontSize: 15, color: '#374151' }}>{sname}</Text>

                      {/* EDIT SUB */}
                      <TouchableOpacity
                        onPress={() => onEditSub?.(s)}
                        hitSlop={ICON_HIT}
                        style={{
                          padding: 8,
                          backgroundColor: '#E3F2FD',
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#2196F3" />
                      </TouchableOpacity>

                      {/* DELETE SUB */}
                      <TouchableOpacity
                        onPress={() => onDeleteSub?.(sid, sname)}
                        hitSlop={ICON_HIT}
                        style={{
                          padding: 8,
                          backgroundColor: '#FFEBEE',
                          borderRadius: 8,
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}