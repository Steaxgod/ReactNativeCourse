import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const Profile = () => {
  const [avatarUri, setAvatarUri] = useState(null);
  const nickname = "Your Nickname";
  const route = useRoute();
  const favoriteManga = route.params?.favoriteManga || []; // Обновлено: извлекаем параметр favoriteManga
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>Upload Avatar</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.nickname}>{nickname}</Text>
      <View style={styles.favoriteMangaContainer}>
        <View style={styles.separator} />
        <Text style={styles.favoriteMangaTitle}>Favorite Manga</Text>
        <FlatList
          data={favoriteManga}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.favoriteMangaItem}
              onPress={() =>
                navigation.navigate("MangaDetail", { manga: item })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.favoriteMangaItemImage}
              />
              <Text style={styles.favoriteMangaItemName}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  nickname: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoriteMangaContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
  },
  favoriteMangaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoriteMangaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  favoriteMangaItemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  favoriteMangaItemName: {
    fontSize: 16,
  },
});

export default Profile;
