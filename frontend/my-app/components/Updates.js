import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tabs = createMaterialTopTabNavigator();

const News = () => {
  return (
    <View>
      <Text>this is the news page</Text>
    </View>
  );
};

const Announcements = () => {
  return (
    <View>
      <Text>this is the Announcements page</Text>
    </View>
  );
};

const Scholarship = () => {
  return (
    <View>
      <Text>this is the scholarship page</Text>
    </View>
  );
};

const Updates = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="News" component={News} />
      <Tabs.Screen name="Announcement" component={Announcements} />
      <Tabs.Screen name="Scholarship" component={Scholarship} />
    </Tabs.Navigator>
  );
};

export default Updates;
