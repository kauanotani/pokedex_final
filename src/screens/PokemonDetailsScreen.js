import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { createFavorite } from "../services/favoritesService";

export default function PokemonDetailsScreen({ route, navigation }) {
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const imageScale = useRef(new Animated.Value(0.55)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPokemonDetails();
  }, [pokemonId]);

  useEffect(() => {
    if (pokemon) {
      imageScale.setValue(0.55);
      imageOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pokemon, imageScale, imageOpacity]);

  const loadPokemonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os detalhes do Pokémon.");
      }

      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFavorite = async () => {
    if (!pokemon) {
      return;
    }

    try {
      setSaving(true);
      await createFavorite(pokemon);
      Alert.alert("Sucesso", "Pokémon adicionado aos favoritos no Firebase.", [
        {
          text: "Ver favoritos",
          onPress: () => navigation.navigate("Favorites"),
        },
        { text: "Continuar" },
      ]);
    } catch (error) {
      Alert.alert("Aviso", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingArea}>
        <ActivityIndicator size="large" color="#3b4cca" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.loadingArea}>
        <Text style={styles.loadingText}>Pokémon não encontrado.</Text>
      </View>
    );
  }

  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;
  const types = pokemon.types.map((item) => item.type.name);
  const abilities = pokemon.abilities.map((item) => item.ability.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.pokemonNumber}>#{String(pokemon.id).padStart(3, "0")}</Text>
          <Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text>

          <Animated.View
            style={[
              styles.imageCircle,
              {
                opacity: imageOpacity,
                transform: [{ scale: imageScale }],
              },
            ]}
          >
            <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
          </Animated.View>

          <View style={styles.typeContainer}>
            {types.map((type) => (
              <Text key={type} style={styles.typeBadge}>
                {type}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações</Text>
          <Text style={styles.infoText}>Altura: {pokemon.height}</Text>
          <Text style={styles.infoText}>Peso: {pokemon.weight}</Text>
          <Text style={styles.infoText}>Habilidades: {abilities.join(", ")}</Text>
        </View>

        <TouchableOpacity
          style={[styles.favoriteButton, saving && styles.disabledButton]}
          onPress={handleCreateFavorite}
          disabled={saving}
        >
          <Text style={styles.favoriteButtonText}>
            {saving ? "Salvando..." : "Adicionar aos favoritos"}
          </Text>
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
    padding: 20,
    paddingBottom: 34,
  },
  loadingArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f8ff",
  },
  loadingText: {
    marginTop: 10,
    color: "#4f5b7a",
  },
  heroCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pokemonNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8791b1",
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#25316d",
    marginTop: 4,
  },
  imageCircle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  pokemonImage: {
    width: 210,
    height: 210,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "#ffcb05",
    color: "#25316d",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#25316d",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#3d4563",
    marginBottom: 7,
    textTransform: "capitalize",
  },
  favoriteButton: {
    backgroundColor: "#3b4cca",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  favoriteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
