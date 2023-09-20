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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const FavoriteItem = ({ url, navigation, onRemove }) => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [url]);

  if (!productData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.favoriteItemContainer}
      onPress={() => navigation.navigate("ProductDetail", { productUrl: url })}
    >
      <Image
        source={{ uri: productData.image }}
        style={styles.favoriteItemImage}
      />
      <Text style={styles.favoriteItemName}>{productData.title}</Text>
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

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const data = await AsyncStorage.multiGet(keys);
          const favoriteProducts = data
            .filter(([, value]) => value === "true")
            .map(([key]) => key);
          setFavorites(favoriteProducts);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
      fetchFavorites();
    }, [])
  );

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

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

export default FavoritesScreen;
