import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface RouteParams {
  animeUrl: string;
}
interface AnimeData {
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  authors: {
    name: string;
  }[];
  published: {
    from: string;
    to?: string;
  };
  background: string;
  // Добавьте другие поля, если они присутствуют в данных
}
const AnimeDetailScreen = () => {
  const route = useRoute<RouteParams | any>();
  const { animeUrl } = route.params;
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(animeUrl);
        console.log(animeUrl);
        const data = await response.json();
        setAnimeData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [animeUrl]);

  useFocusEffect(
    useCallback(() => {
      const checkFavorite = async () => {
        try {
          const isFavoriteStr = await AsyncStorage.getItem(animeUrl);
          setIsFavorite(!!isFavoriteStr);
        } catch (error) {
          console.error("Error checking favorite:", error);
        }
      };

      checkFavorite();
    }, [animeUrl])
  );

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await AsyncStorage.removeItem(animeUrl);
        setIsFavorite(false);
      } else {
        await AsyncStorage.setItem(animeUrl, JSON.stringify(true));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const formatDateString = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (typeof dateString === "string") {
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    }
    return "";
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ff6b6b" : "#000"}
          />
        </TouchableOpacity>
      ),
    });
  }, [isFavorite]);

  if (!animeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  const starIcons = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(animeData.score)) {
      starIcons.push(
        <Ionicons key={i} name="star" size={24} color="#ff6b6b" />
      );
    } else {
      starIcons.push(
        <Ionicons key={i} name="star-outline" size={24} color="#ff6b6b" />
      );
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{animeData.title}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: animeData.images.jpg.image_url }}
          style={styles.image}
        />
      </View>
      <View style={styles.ratingContainer}>
        {starIcons}
        <Text style={styles.rating}>{animeData.score.toFixed(2)}</Text>
      </View>
      <Text style={styles.author}>Author: {animeData.authors[0].name}</Text>
      <Text style={styles.published}>
        Published: {formatDateString(animeData.published.from)} -{" "}
        {animeData.published.to
          ? formatDateString(animeData.published.to)
          : "Present"}
      </Text>
      <View style={styles.backgroundContainer}>
        <Text style={styles.background}>{animeData.background}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: "#666",
  },
  published: {
    fontSize: 16,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginLeft: 4,
  },
  backgroundContainer: {
    borderTopWidth: 1,
    borderColor: "#ff6b6b",
    marginTop: 16,
    paddingTop: 16,
  },
  background: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default AnimeDetailScreen;
