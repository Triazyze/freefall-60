import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#111827", // Bleu-noir très profond pour garder la cohérence "haute altitude"
    justifyContent: "center", 
    alignItems: "center", 
    padding: 24 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "900", // Poids maximal pour un effet titre de mission très arcade
    color: "#fff", 
    marginBottom: 40, 
    letterSpacing: 3,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: { 
    width: "100%", 
    gap: 16, 
    marginBottom: 35 
  },
  modeButton: { 
    width: "100%", 
    padding: 18, 
    borderRadius: 16, // Coins adoucis modernes, identiques au HomeScreen
    backgroundColor: "#1f2937", // Fond cockpit gris-bleu pour les cartes de mode
    borderWidth: 1.5, // Épaisseur de bordure plus fine et précise (la couleur reste gérée dynamiquement par ton code)
    alignItems: "center",
    // Légère ombre pour donner du relief à la carte de sélection
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  modeTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: "uppercase" // Titres des modes en majuscules pour le côté pro/gaming
  },
  modeDesc: { 
    fontSize: 13, 
    color: "#9ca3af", // Gris clair texturé pour une meilleure lisibilité
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  backButton: { 
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Bouton retour discret mais palpable
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  backButtonText: { 
    color: "#9ca3af", 
    fontSize: 14, 
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
});