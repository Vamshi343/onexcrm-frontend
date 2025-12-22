import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const VisitSummaryScreen = ({ route, navigation }: any) => {
  const { contact, contactVisit } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Visit Completed</Text>
        <Text style={styles.name}>{contact.fullName}</Text>

        {contactVisit?.isPurchased ? (
          <Text style={styles.info}>
            Purchased Amount: {contactVisit.purchasedAmount}
          </Text>
        ) : (
          <Text style={styles.info}>No purchase this visit.</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.buttonText}>Back to Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VisitSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
