import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
const Blank = () => null;
import Week1 from "./Week1/Default";
// import Week2 from './Week2/Week2';
// import Week3 from './Week3/Week3';
// import Week4 from './Week4/Week4';
import { TabNav } from "./Week5/Navigation";
import { DrawNav } from "./W10/Navigation";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Week 10: Manga App"
        screenOptions={{ headerShown: false, drawerPosition: "right" }}
      >
        <Drawer.Screen name="Week 1: Setup Expo" component={Week1} />
        <Drawer.Screen name="Week 2: Photo Gallery" component={Blank} />
        <Drawer.Screen name="Week 3: Photo Gallery 2.0" component={Blank} />
        <Drawer.Screen name="Week 4: Weather App" component={Blank} />
        <Drawer.Screen name="Week 5: Midterm" component={TabNav} />
        <Drawer.Screen name="Week 10: Manga App" component={DrawNav} />
        <Drawer.Screen name="Week 7: Empty" component={Blank} />
        <Drawer.Screen name="Week 8: Empty" component={Blank} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
