import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import Modal from "react-native-modal"; // Импортируем библиотеку для модального окна

type YourStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  YourStackParamList,
  "Profile"
>;

interface AnimeData {
  url: string;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface FavoriteItemProps {
  url: string;
  navigation: any;
  onRemove: (url: string) => void;
}

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
        const animeData = data.data;
        setAnimeData(animeData);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnimeData();
  }, [url]);

  if (!animeData) {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.favoriteMangaItem}
      onPress={() => navigation.navigate("AnimeDetail", { animeUrl: url })}
    >
      <View style={styles.favoriteMangaItemNameContainer}>
        <Text style={styles.favoriteMangaItemName}>{animeData.title}</Text>
      </View>
      <Image
        source={{ uri: animeData.images.jpg.image_url }}
        style={styles.favoriteMangaItemImage}
      />
    </TouchableOpacity>
  );
};

const Profile: React.FC<{
  navigation: ProfileScreenNavigationProp;
}> = ({ navigation }) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null); // Добавляем состояние для никнейма
  const [showNicknameModal, setShowNicknameModal] = useState<boolean>(false); // Состояние для модального окна
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState<string[]>([]);
  const animeDataMap: Record<string, AnimeData> = {};

  useFocusEffect(
    useCallback(() => {
      const fetchNickname = async () => {
        try {
          // Проверяем, есть ли уже сохраненный никнейм
          const savedNickname = await AsyncStorage.getItem("nickname");
          if (savedNickname) {
            setNickname(savedNickname);
          } else {
            // Если никнейма нет, открываем модальное окно для его ввода
            setShowNicknameModal(true);
          }

          const keys = await AsyncStorage.getAllKeys();
          const data = await AsyncStorage.multiGet(keys);
          const favoriteAnime = data
            .filter(([, value]) => value === "true")
            .map(([key]) => key);

          for (const url of favoriteAnime) {
            const response = await fetch(url);
            const animeData = await response.json();
            animeDataMap[url] = animeData.data;
          }
          setFavorites(favoriteAnime);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchNickname();
    }, [])
  );

  const pickImage = async () => {
    const result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })) as ImagePicker.ImagePickerSuccessResult; // Явное указание типа

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };
  // Функция для сохранения никнейма
  const saveNickname = async (newNickname: string) => {
    try {
      await AsyncStorage.setItem("nickname", newNickname);
      setNickname(newNickname);
      setShowNicknameModal(false);
    } catch (error) {
      console.error("Error saving nickname:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={showNicknameModal}>
        <View style={styles.modalContent}>
          <Text>Enter Your Nickname:</Text>
          <TextInput
            placeholder="Your Nickname"
            onChangeText={(text) => setNickname(text)}
            style={styles.nicknameInput}
          />
          <Button
            title="Save"
            onPress={() => (nickname !== null ? saveNickname(nickname) : null)}
          />
        </View>
      </Modal>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>Upload Avatar</Text>
          </View>
        )}
      </TouchableOpacity>
      {nickname ? (
        <Text style={styles.nickname}>{nickname} </Text>
      ) : (
        <Text style={styles.noNicknameText}>No Nickname</Text>
      )}
      <View style={styles.favoriteMangaContainer}>
        <View style={styles.separator} />
        <Text style={styles.favoriteMangaTitle}>Favorite Manga</Text>
        <FlatList
          data={searchQuery ? filteredFavorites : favorites}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <FavoriteItem
              url={item}
              navigation={navigation}
              onRemove={() => {
                // Добавьте здесь логику удаления элемента из избранного
              }}
            />
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
  noNicknameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
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
    flexDirection: "row-reverse", // Изменение направления элементов
    alignItems: "center",
    paddingVertical: 8,
  },
  favoriteMangaItemNameContainer: {
    flex: 1, // Занимает доступное пространство
    flexDirection: "row-reverse", // Располагает элементы в обратном порядке
    alignItems: "center", // Выравнивает элементы по центру
  },
  favoriteMangaItemName: {
    fontSize: 20, // Увеличьте размер шрифта
  },
  favoriteMangaItemImage: {
    width: 80, // Увеличьте ширину
    height: 80, // Увеличьте высоту
    marginRight: 10,
    borderRadius: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  nicknameInput: {
    borderWidth: 2,
    borderColor: "black", // Устанавливаем черный цвет границы
    fontSize: 20, // Увеличиваем размер шрифта
    padding: 10, // Добавляем внутренний отступ
    width: 300, // Устанавливаем желаемую ширину
    marginBottom: 10, // Добавляем отступ снизу
  },
});

export default Profile;
