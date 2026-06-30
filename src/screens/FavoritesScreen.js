import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  deleteFavorite,
  subscribeFavorites,
  updateFavoriteNickname,
} from "../services/favoritesService";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeFavorites(
      (data) => {
        setFavorites(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        Alert.alert("Erro no Firebase", error.message);
      }
    );

    return unsubscribe;
  }, []);

  const openEditModal = (favorite) => {
    setSelectedFavorite(favorite);
    setNickname(favorite.apelido || favorite.nome);
  };

  const closeEditModal = () => {
    setSelectedFavorite(null);
    setNickname("");
  };

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert("Aviso", "Digite um apelido válido.");
      return;
    }

    try {
      setSaving(true);
      await updateFavoriteNickname(selectedFavorite.id, nickname);
      Alert.alert("Sucesso", "Apelido atualizado no Firebase.");
      closeEditModal();
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFavorite = (favorite) => {
    Alert.alert(
      "Excluir favorito",
      `Deseja remover ${favorite.apelido || favorite.nome} dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFavorite(favorite.id);
              Alert.alert("Sucesso", "Favorito excluído do Firebase.");
            } catch (error) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  const renderFavorite = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={styles.infoArea}>
        <Text style={styles.nickname}>{item.apelido || item.nome}</Text>
        <Text style={styles.originalName}>{item.nome?.toUpperCase()}</Text>
        <Text style={styles.types}>{item.tipos?.join(" • ")}</Text>

        <View style={styles.actionsArea}>
          <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFavorite(item)}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingArea}>
        <ActivityIndicator size="large" color="#3b4cca" />
        <Text style={styles.loadingText}>Lendo favoritos no Firebase...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pokémons Favoritos</Text>
        <Text style={styles.subtitle}>
          Aqui ficam os registros salvos no Firestore. Nesta tela é possível ler, editar e excluir.
        </Text>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavorite}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyArea}>
              <Text style={styles.emptyText}>Nenhum favorito salvo ainda.</Text>
              <Text style={styles.emptyHint}>
                Abra a lista de Pokémons, entre nos detalhes e toque em “Adicionar aos favoritos”.
              </Text>
            </View>
          }
        />

        <Modal visible={!!selectedFavorite} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar apelido</Text>
              <Text style={styles.modalSubtitle}>
                {selectedFavorite?.nome?.toUpperCase()}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Digite o novo apelido"
              />

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleUpdateNickname}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Salvando..." : "Salvar alteração"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#25316d",
  },
  subtitle: {
    color: "#4f5b7a",
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
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
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
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
  image: {
    width: 92,
    height: 92,
    backgroundColor: "#eef2ff",
    borderRadius: 46,
  },
  infoArea: {
    flex: 1,
    marginLeft: 14,
  },
  nickname: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#25316d",
    textTransform: "capitalize",
  },
  originalName: {
    color: "#8791b1",
    marginTop: 2,
    fontWeight: "bold",
  },
  types: {
    color: "#4f5b7a",
    marginTop: 4,
    textTransform: "capitalize",
  },
  actionsArea: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#ffcb05",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  editButtonText: {
    color: "#25316d",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e63946",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyArea: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    marginTop: 10,
  },
  emptyText: {
    color: "#25316d",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyHint: {
    color: "#4f5b7a",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#25316d",
    textAlign: "center",
  },
  modalSubtitle: {
    color: "#8791b1",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#f6f8ff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dce2ff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#3b4cca",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: "#4f5b7a",
    fontWeight: "bold",
  },
});
