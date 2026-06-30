import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />

        <Text style={styles.title}>Pokedex Interativa</Text>
        <Text style={styles.subtitle}>
          Consulte Pokémons pela PokeAPI e salve seus favoritos usando Firebase.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requisitos implementados</Text>
          <Text style={styles.cardText}>• Navegação com React Navigation</Text>
          <Text style={styles.cardText}>• Consumo da API pública PokeAPI</Text>
          <Text style={styles.cardText}>• CRUD completo no Firebase Firestore</Text>
          <Text style={styles.cardText}>• Animação com Animated</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("PokemonList")}
        >
          <Text style={styles.primaryButtonText}>Ver Pokémons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.secondaryButtonText}>Meus Favoritos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8ff",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 260,
    height: 120,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#25316d",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4f5b7a",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 23,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25316d",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#3d4563",
    marginBottom: 6,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#ffcb05",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#25316d",
    fontSize: 17,
    fontWeight: "bold",
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "#3b4cca",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
