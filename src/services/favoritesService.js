import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

const COLLECTION_NAME = "favoritos";

export async function createFavorite(pokemon) {
  const favoriteRef = doc(db, COLLECTION_NAME, String(pokemon.id));
  const favoriteSnapshot = await getDoc(favoriteRef);

  if (favoriteSnapshot.exists()) {
    throw new Error("Este Pokémon já está salvo nos favoritos.");
  }

  await setDoc(favoriteRef, {
    pokemonId: pokemon.id,
    nome: pokemon.name,
    apelido: pokemon.name,
    imagem:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ||
      pokemon.sprites?.front_default ||
      "",
    tipos: pokemon.types?.map((item) => item.type.name) || [],
    habilidades: pokemon.abilities?.map((item) => item.ability.name) || [],
    peso: pokemon.weight,
    altura: pokemon.height,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeFavorites(onSuccess, onError) {
  const favoritesQuery = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    favoritesQuery,
    (snapshot) => {
      const favorites = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onSuccess(favorites);
    },
    onError
  );
}

export async function updateFavoriteNickname(favoriteId, newNickname) {
  const favoriteRef = doc(db, COLLECTION_NAME, String(favoriteId));

  await updateDoc(favoriteRef, {
    apelido: newNickname.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFavorite(favoriteId) {
  const favoriteRef = doc(db, COLLECTION_NAME, String(favoriteId));
  await deleteDoc(favoriteRef);
}
