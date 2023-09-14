import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const FavoriteItem = ({ url, navigation, onRemove }) => {
  const [animeData, setAnimeData] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAnimeData(data.data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnimeData();
  }, [url]);

  if (!animeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.favoriteItemContainer}
      onPress={() => navigation.navigate("AnimeDetail", { animeUrl: url })}
    >
      <Image
        source={{ uri: animeData.images.jpg.image_url }}
        style={styles.favoriteItemImage}
      />
      <View style={styles.favoriteItemInfo}>
        <Text style={styles.favoriteItemName}>{animeData.title}</Text>
        <Text style={styles.favoriteItemRating}>
          Rating: {animeData.score.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(url)}
      >
        <Ionicons name="trash-bin" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  const animeDataMap = {}; // Создаем объект для хранения данных о манге

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const data = await AsyncStorage.multiGet(keys);
          const favoriteAnime = data
            .filter(([, value]) => value === "true")
            .map(([key]) => key);

          // Здесь мы сохраняем данные о манге в объект animeDataMap
          for (const url of favoriteAnime) {
            const response = await fetch(url);
            const animeData = await response.json();
            animeDataMap[url] = animeData.data;
          }

          setFavorites(favoriteAnime);
        } catch (error) {
          console.error("Error fetching favorite anime:", error);
        }
      };
      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    const filterFavorites = () => {
      const filtered = favorites.filter((url) => {
        const animeData = animeDataMap[url];
        return (
          animeData &&
          animeData.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredFavorites(filtered);
    };

    filterFavorites();
  }, [searchQuery, favorites]);

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setFavorites([]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  const removeFavorite = async (url) => {
    try {
      await AsyncStorage.removeItem(url);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favoriteUrl) => favoriteUrl !== url)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const onSearchTextChanged = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        onChangeText={onSearchTextChanged}
        value={searchQuery}
      />
      <FlatList
        data={searchQuery ? filteredFavorites : favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FavoriteItem
            url={item}
            navigation={navigation}
            onRemove={removeFavorite}
          />
        )}
      />
      <Button title="Clear Favorites" onPress={clearStorage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  favoriteItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  favoriteItemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  favoriteItemName: {
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    marginLeft: "auto",
    padding: 5,
    backgroundColor: "red",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavoritesScreen;
