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
import { StackNavigationProp } from "@react-navigation/stack";

interface AnimeData {
  images: {
    jpg: {
      image_url: string;
    };
  };
  title: string;
  score: number;
}

interface FavoriteItemProps {
  url: string;
  navigation: any;
  onRemove: (url: string) => void;
}

type YourStackParamList = {
  Home: undefined;
  FavoritesScreen: undefined;
};

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  url,
  navigation,
  onRemove,
}) => {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);

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
        <Text style={styles.favoriteItemNameText}>{animeData.title}</Text>
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

type FavoritesScreenNavigationProp = StackNavigationProp<
  YourStackParamList,
  "FavoritesScreen"
>;

const FavoritesScreen: React.FC<{
  navigation: FavoritesScreenNavigationProp;
}> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState<string[]>([]);
  const animeDataMap: Record<string, AnimeData> = {};
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          setIsLoading(true);
          const keys = await AsyncStorage.getAllKeys();
          const data = await AsyncStorage.multiGet(keys);
          const favoriteAnime = data
            .filter(([, value]) => value === "true")
            .map(([key]) => key);

          // Используем Promise.all для асинхронной загрузки всех данных
          const animeDataPromises = favoriteAnime.map(async (url) => {
            const response = await fetch(url);
            const animeData = await response.json();
            animeDataMap[url] = animeData.data;
          });

          await Promise.all(animeDataPromises);

          setFavorites(favoriteAnime);
          setIsLoading(false);
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

  const removeFavorite = async (url: string) => {
    try {
      await AsyncStorage.removeItem(url);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favoriteUrl) => favoriteUrl !== url)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const onSearchTextChanged = (text: string) => {
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      ) : (
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
      )}
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
  favoriteItemInfo: {
    flex: 1,
  },
  favoriteItemNameText: {
    fontSize: 16,
  },
  favoriteItemRating: {
    fontSize: 14,
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
