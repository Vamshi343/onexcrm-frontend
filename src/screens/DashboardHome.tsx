import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { API_ROUTES } from "../config/apiRoutes";
import apiClient from "../services/apiClient";

const screenWidth = Dimensions.get("window").width;

/* ---------------- TYPES ---------------- */

type StatsProps = {
  totalContacts: number;
  totalCategories: number;
  totalRecords: number;
};

type Props = {
  stats: StatsProps;
  onStartVisit?: () => void;
  onInterestSearch?: () => void;
};

type TabKey = "overview" | "analytics" | "activity" | "performance";

/* ---------------- COMPONENT ---------------- */

export default function DashboardHome({
  stats,
  onStartVisit,
  onInterestSearch,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(false);
  const analyticsFetchedRef = useRef(false);

  const [analytics, setAnalytics] = useState({
    visitsByDay: [],
    categoryInterest: [],
    purchase: { purchased: 0, notPurchased: 0 },
    topCategories: [],
    recentActivity: [],
  });

  /* ---------------- FETCH ANALYTICS ---------------- */

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await apiClient.get(API_ROUTES.DASHBOARD.ANALYTICS);
      
      console.log("📊 Analytics Response:", JSON.stringify(resp?.data, null, 2));
      
      const result = resp?.data?.result;
      
      if (result) {
        setAnalytics({
          visitsByDay: result.visitsByDay || [],
          categoryInterest: result.categoryInterest || [],
          purchase: result.purchase || { purchased: 0, notPurchased: 0 },
          topCategories: result.topCategories || [],
          recentActivity: result.recentActivity || [],
        });
        
        console.log("✅ Data Set Successfully");
      }
    } catch (err) {
      console.log("❌ Analytics fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch analytics when leaving overview tab
  useEffect(() => {
    if (activeTab !== "overview" && !analyticsFetchedRef.current) {
      fetchAnalytics();
      analyticsFetchedRef.current = true;
    }
  }, [activeTab, fetchAnalytics]);

  /* ---------------- HELPERS ---------------- */

  const renderLoading = () => (
    <View style={{ paddingVertical: 30 }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="file-tray-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyText}>No data available</Text>
      <Text style={styles.emptySubtext}>Visit data will appear here</Text>
    </View>
  );

  const { totalContacts, totalCategories, totalRecords } = stats;

  const SafeBarChart: any = BarChart;
  const SafePieChart: any = PieChart;

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.wrapper}>
      {/* TABS */}
      <View style={styles.tabRow}>
        {tabItems.map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabItem, active && styles.tabItemActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Ionicons
                name={t.icon as any}
                size={18}
                color={active ? "#1D4ED8" : "#6B7280"}
              />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ✅ NO MORE SCROLLVIEW - Parent handles scrolling */}
      <View>
        {/* ---------------- OVERVIEW ---------------- */}
        {activeTab === "overview" && (
          <>
            <View style={{ marginBottom: 20 }}>
              <View style={styles.kpiCardFull}>
                <Ionicons name="people-outline" size={20} color="#3B82F6" />
                <Text style={styles.kpiLabel}>Total Contacts</Text>
                <Text style={styles.kpiValue}>{totalContacts}</Text>
              </View>
            </View>

            <View style={styles.rowWrap}>
              <KpiCard label="Categories" value={totalCategories} icon="grid-outline" accentColor="#10B981" />
              <KpiCard label="Total Records" value={totalRecords} icon="layers-outline" accentColor="#6366F1" />
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.rowWrap}>
              <TouchableOpacity style={styles.quickCard} onPress={onStartVisit}>
                <Ionicons name="walk-outline" size={20} color="#2563EB" />
                <Text style={styles.quickLabel}>Start Visit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickCard} onPress={onInterestSearch}>
                <Ionicons name="search-outline" size={20} color="#2563EB" />
                <Text style={styles.quickLabel}>Interest Search</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ---------------- ANALYTICS ---------------- */}
        {activeTab === "analytics" && (
          <>
            {/* ✅ Visits by Day - Last 7 Days */}
            <Text style={styles.sectionTitle}>Visits by Day (Last 7 Days)</Text>
            {loading ? (
              renderLoading()
            ) : Array.isArray(analytics.visitsByDay) && analytics.visitsByDay.length > 0 ? (
              <SafeBarChart
                data={{
                  labels: analytics.visitsByDay.map((v: any) => {
                    const date = new Date(v.visitDate);
                    return date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }),
                  datasets: [{ 
                    data: analytics.visitsByDay.map((v: any) => Number(v.cnt) || 0)
                  }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig as any}
                style={styles.chart}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />
            ) : (
              renderEmpty()
            )}

            {/* ✅ Category Wise Interest */}
            <Text style={styles.sectionTitle}>Category Wise Interest</Text>
            {loading ? (
              renderLoading()
            ) : Array.isArray(analytics.categoryInterest) && analytics.categoryInterest.length > 0 ? (
              <SafeBarChart
                data={{
                  labels: analytics.categoryInterest.map((c: any) => 
                    String(c.name || 'Unknown').substring(0, 8)
                  ),
                  datasets: [{ 
                    data: analytics.categoryInterest.map((c: any) => Number(c.cnt) || 0)
                  }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig as any}
                style={styles.chart}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />
            ) : (
              renderEmpty()
            )}

            {/* ✅ Purchase Breakdown */}
            <Text style={styles.sectionTitle}>Purchase Breakdown</Text>
            {loading ? (
              renderLoading()
            ) : (() => {
                const purchased = Number(analytics.purchase?.purchased) || 0;
                const notPurchased = Number(analytics.purchase?.notPurchased) || 0;
                const total = purchased + notPurchased;
                
                return total > 0 ? (
                  <SafePieChart
                    data={[
                      { 
                        name: "Purchased", 
                        population: purchased, 
                        color: "#10B981", 
                        legendFontColor: "#6B7280",
                        legendFontSize: 13 
                      },
                      { 
                        name: "Not Purchased", 
                        population: notPurchased, 
                        color: "#EF4444", 
                        legendFontColor: "#6B7280",
                        legendFontSize: 13 
                      },
                    ]}
                    width={screenWidth - 40}
                    height={220}
                    accessor="population"
                    backgroundColor="transparent"
                    chartConfig={chartConfig as any}
                    paddingLeft="15"
                  />
                ) : (
                  renderEmpty()
                );
              })()
            }
          </>
        )}

        {/* ---------------- ACTIVITY ---------------- */}
        {activeTab === "activity" && (
          <>
            <Text style={styles.sectionTitle}>Recent Activity (Last 10 Visits)</Text>
            {loading ? (
              renderLoading()
            ) : Array.isArray(analytics.recentActivity) && analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map((a: any, i: number) => {
                // ✅ Parse the datetime correctly
                const visitDate = a.visitDate ? new Date(a.visitDate) : null;
                
                return (
                  <View key={i} style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <Ionicons name="person-circle-outline" size={20} color="#2563EB" />
                      <Text style={styles.activityTitle}>{a.name || 'Unknown Contact'}</Text>
                    </View>
                    <Text style={styles.activityTime}>
                      {visitDate ? visitDate.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'Date not available'}
                    </Text>
                  </View>
                );
              })
            ) : (
              renderEmpty()
            )}
          </>
        )}

        {/* ---------------- PERFORMANCE / STATS ---------------- */}
        {activeTab === "performance" && (
          <>
            <Text style={styles.sectionTitle}>Top 5 Categories by Interest</Text>
            {loading ? (
              renderLoading()
            ) : (() => {
                const categories = Array.isArray(analytics.topCategories) 
                  ? analytics.topCategories 
                  : [];
                
                // Already sorted by backend (ORDER BY cnt DESC LIMIT 5)
              const maxCount = categories.length > 0 ? (Number((categories[0] as any).cnt) || 1) : 1;

                return categories.length > 0 ? (
                  categories.map((c: any, i: number) => {
                    const categoryName = c.name || 'Unknown';
                    const count = Number(c.cnt) || 0;
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <View key={i} style={styles.perfCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.perfLabel}>
                            #{i + 1} {categoryName}
                          </Text>
                          <View style={styles.progressBarContainer}>
                            <View
                              style={[
                                styles.progressBarFill,
                                { width: `${percentage}%` }
                              ]}
                            />
                          </View>
                        </View>
                        <Text style={styles.perfValue}>{count}</Text>
                      </View>
                    );
                  })
                ) : (
                  renderEmpty()
                );
              })()
            }
          </>
        )}
      </View>
    </View>
  );
}

/* ---------------- CONFIG ---------------- */

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: () => "#2563EB",
  labelColor: () => "#6B7280",
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#E5E7EB",
    strokeWidth: 1,
  },
};

/* ---------------- SMALL COMPONENTS ---------------- */

function KpiCard({ label, value, icon, accentColor }: any) {
  return (
    <View style={styles.kpiCard}>
      <Ionicons name={icon} size={18} color={accentColor} />
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

const tabItems: { key: TabKey; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "speedometer-outline" },
  { key: "analytics", label: "Analytics", icon: "stats-chart-outline" },
  { key: "activity", label: "Activity", icon: "time-outline" },
  { key: "performance", label: "Stats", icon: "trophy-outline" },
];

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
  },

  tabItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },

  tabItemActive: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
  },

  tabText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#374151",
  },

  tabTextActive: {
    fontWeight: "700",
    color: "#1D4ED8",
  },

  rowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 14,
    color: "#111827",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },

  kpiCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  kpiCardFull: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  kpiLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  kpiValue: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
    color: "#111827",
  },

  quickCard: {
    width: "48%",
    paddingVertical: 20,
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    alignItems: "center",
  },

  quickLabel: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 14,
  },

  chart: {
    borderRadius: 16,
    marginBottom: 8,
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  activityTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 15,
    marginLeft: 8,
  },

  activityTime: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 28,
  },

  perfCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  perfLabel: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    fontSize: 14,
  },

  perfValue: {
    fontWeight: "700",
    color: "#2563EB",
    fontSize: 18,
    minWidth: 40,
    textAlign: "right",
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },

  progressBarFill: {
    height: 8,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
});