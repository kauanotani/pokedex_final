import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=30";

export default function PokemonListScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os Pokémons.");
      }

      const data = await response.json();
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          const details = await detailResponse.json();

          return {
            id: details.id,
            name: details.name,
            image:
              details.sprites?.other?.["official-artwork"]?.front_default ||
              details.sprites?.front_default,
            types: details.types.map((item) => item.type.name),
          };
        })
      );

      setPokemons(detailedPokemons);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredPokemons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return pokemons;
    }

    return pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(normalizedSearch) ||
        String(pokemon.id).includes(normalizedSearch)
    );
  }, [pokemons, search]);

  const handleSearchByNameOrId = async () => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      Alert.alert("Aviso", "Digite o nome ou o ID de um Pokémon.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${normalizedSearch}`
      );

      if (!response.ok) {
        throw new Error("Pokémon não encontrado.");
      }

      const details = await response.json();
      navigation.navigate("PokemonDetails", { pokemonId: details.id });
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPokemon = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("PokemonDetails", { pokemonId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.pokemonImage} />
      <View style={styles.cardContent}>
        <Text style={styles.pokemonNumber}>#{String(item.id).padStart(3, "0")}</Text>
        <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
        <Text style={styles.pokemonTypes}>{item.types.join(" • ")}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchArea}>
          <TextInput
            style={styles.input}
            placeholder="Buscar por nome ou ID"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchByNameOrId}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.favoritesShortcut}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.favoritesShortcutText}>Abrir favoritos salvos no Firebase</Text>
        </TouchableOpacity>

        {loading && !refreshing ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#3b4cca" />
            <Text style={styles.loadingText}>Carregando Pokémons...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPokemons}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderPokemon}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadPokemons();
                }}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum Pokémon encontrado.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8ff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#dce2ff",
  },
  searchButton: {
    backgroundColor: "#ffcb05",
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#25316d",
    fontWeight: "bold",
  },
  favoritesShortcut: {
    backgroundColor: "#3b4cca",
    padding: 13,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  favoritesShortcutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#4f5b7a",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  pokemonImage: {
    width: 76,
    height: 76,
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  pokemonNumber: {
    color: "#8791b1",
    fontWeight: "bold",
    marginBottom: 3,
  },
  pokemonName: {
    color: "#25316d",
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonTypes: {
    color: "#4f5b7a",
    marginTop: 4,
    textTransform: "capitalize",
  },
  arrow: {
    fontSize: 34,
    color: "#3b4cca",
  },
  emptyText: {
    textAlign: "center",
    color: "#4f5b7a",
    marginTop: 30,
  },
});
