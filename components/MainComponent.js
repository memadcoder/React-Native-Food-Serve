import React, { Component } from "react";
import Menu from "./MenuComponent";
import { DISHES } from "../shared/dishes";
import Dishdetail from "./DishdetailComponent";
import { View, Platform } from "react-native";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import Constants from "expo-constants";
import { Icon } from "react-native-elements";

import Home from "./HomeComponent";
import AboutUs from "./AboutComponent";
import ContactUs from "./ContactComponent";

const MenuNavigator = createStackNavigator(
  {
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail },
  },
  {
    initialRouteName: "Menu",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const HomeNavigator = createStackNavigator(
  {
    Home: { screen: Home },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
    }),
  }
);

const AboutUsNavigator = createStackNavigator(
  {
    AboutUs: { screen: AboutUs },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
    }),
  }
);

const ContactUsNavigator = createStackNavigator(
  {
    ContactUs: { screen: ContactUs },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
    }),
  }
);

const MainNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        title: "Home",
        drawerLabel: "Home",
      },
    },
    Menu: {
      screen: MenuNavigator,
      navigationOptions: {
        title: "Menu",
        drawerLabel: "Menu",
      },
    },
    AboutUs: {
      screen: AboutUsNavigator,
      navigationOptions: {
        title: "About Us",
        drawerLabel: "About Us",
      },
    },
    ContactUs: {
      screen: ContactUsNavigator,
      navigationOptions: {
        title: "Contact Us",
        drawerLabel: "Contact Us",
      },
    },
  },
  {
    drawerBackgroundColor: "#D1C4E9",
  }
);

class Main extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          // paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
        }}
      >
        <MainNavigator />
      </View>
    );
  }
}

export default Main;
