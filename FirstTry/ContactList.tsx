import { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { ContactCard } from "./ContactCard";

const CONTACTS = [
  {
    id: "1",
    name: "Dennis",
    image: "https://reactnative.dev/img/tiny_logo.png",
  },
  {
    id: "2",
    name: "Sweet Dee",
    image: "https://reactnative.dev/img/tiny_logo.png",
  },
  {
    id: "3",
    name: "Frank",
    image: "https://reactnative.dev/img/tiny_logo.png",
  },
  {
    id: "4",
    name: "Mac",
    image: "https://reactnative.dev/img/tiny_logo.png",
  },
];

// StyleSheet should always live OUTSIDE of your component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textinput: {
    borderColor: "black",
    borderWidth: 1,

    width: "25%",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginVertical: 60,
  },
});

export const ContactList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContacts, setActiveContacts] = useState(CONTACTS);
  const handleOnPress = (name: string) => {
    Alert.alert(`You pressed the ${name} row`);
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => handleOnPress(item.name)}>
        <ContactCard name={item.name} image={item.image} />
      </TouchableOpacity>
    );
  };

  const search = (query: string) => {
    const filteredContacts = CONTACTS.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
    setActiveContacts(filteredContacts);
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={search}
        placeholder="Search here"
        style={styles.textinput}
      />
      <FlatList
        data={activeContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};
