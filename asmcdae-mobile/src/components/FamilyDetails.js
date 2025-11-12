import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FamilyDetails = ({ familyMemberData, handleEditFamilyMember }) => {
  return (
    <View>
      {familyMemberData.length > 0 ? (
        familyMemberData.map((item, index) => {
          console.log("familyMemberData");
          return (
            <View style={styles.card} key={index}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEditFamilyMember(item, index)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="create-outline" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Mobile:</Text> {item.mobile}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Email:</Text> {item.email}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Dependent:</Text>{" "}
                  {item.is_dependent ? "Yes" : "No"}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Relation:</Text> {item.relation}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>T-Shirt Name:</Text>{" "}
                  {item.tshirt_name}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Clothing Type:</Text>{" "}
                  {item.clothing_type}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={styles.label}>Clothing Size:</Text>{" "}
                  {item.clothing_size}
                </Text>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Family Members</Text>
        </View>
      )}
    </View>
  );
};

export default FamilyDetails;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  cardContent: {
    marginTop: 10,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
});
