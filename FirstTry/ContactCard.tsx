import {
  Image,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

interface Props {
  name: string;
  image: string;
}
// StyleSheet should always live OUTSIDE of your component
const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  txt: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export const ContactCard = ({ name, image }: Props) => {
  return (
    <View style={styles.view}>
      <Image source={{ uri: image }} style={styles.img} />
      <Text style={styles.txt}>{name}</Text>
    </View>
  );
};
