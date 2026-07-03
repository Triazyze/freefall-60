import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  starsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f1c40f",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#34495e",
  },
  tabButtonText: {
    color: "#bdc3c7",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  listContent: {
    gap: 15,
  },
  itemCard: {
    backgroundColor: "#34495e",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  itemIconImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: "cover",
  },
  itemIconEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemIconEmoji: {
    fontSize: 35,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  itemPrice: {
    fontSize: 16,
    color: "#f1c40f",
    fontWeight: "600",
    marginTop: 3,
  },
  buyButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 85,
    alignItems: "center",
  },
  buyButtonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.5,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  equipButton: {
    backgroundColor: "#3498db",
  },
  equippedButton: {
    backgroundColor: "#16a085",
  },
});