import React, { Component } from "react";
import Menu from "./MenuComponent";
import Dishdetail from "./DishdetailComponent";
import {
  View,
  Platform,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerItems,
} from "react-navigation";
import Constants from "expo-constants";
import { Icon } from "react-native-elements";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Home from "./HomeComponent";
import AboutUs from "./AboutComponent";
import ContactUs from "./ContactComponent";

import { connect } from "react-redux";
import {
  fetchDishes,
  fetchComments,
  fetchPromos,
  fetchLeaders,
} from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
});

const MenuNavigator = createStackNavigator(
  {
    Menu: {
      screen: Menu,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <Icon
            name="menu"
            size={24}
            color="white"
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      }),
    },
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

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <View style={styles.drawerHeader}>
          <View style={{ flex: 1 }}>
            <Image
              source={require("./images/logo.png")}
              style={styles.drawerImage}
            />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
          </View>
        </View>
        <DrawerItems {...props} />
      </SafeAreaView>
    </SafeAreaProvider>
  </ScrollView>
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
      headerLeft: (
        <Icon
          name="menu"
          size={24}
          color="white"
          onPress={() => navigation.toggleDrawer()}
        />
      ),
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
      headerLeft: (
        <Icon
          name="menu"
          size={24}
          color="white"
          onPress={() => navigation.toggleDrawer()}
        />
      ),
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
      headerLeft: (
        <Icon
          name="menu"
          size={24}
          color="white"
          onPress={() => navigation.toggleDrawer()}
        />
      ),
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
        drawerIcon: ({ tintColor, focused }) => (
          <Icon name="home" type="font-awesome" size={24} color={tintColor} />
        ),
      },
    },
    Menu: {
      screen: MenuNavigator,
      navigationOptions: {
        title: "Menu",
        drawerLabel: "Menu",
        drawerLabel: "Menu",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon name="list" type="font-awesome" size={24} color={tintColor} />
        ),
      },
    },
    AboutUs: {
      screen: AboutUsNavigator,
      navigationOptions: {
        title: "About Us",
        drawerLabel: "About Us",
        drawerLabel: "About Us",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name="info-circle"
            type="font-awesome"
            size={24}
            color={tintColor}
          />
        ),
      },
    },
    ContactUs: {
      screen: ContactUsNavigator,
      navigationOptions: {
        title: "Contact Us",
        drawerLabel: "Contact Us",
        title: "Contact Us",
        drawerLabel: "Contact Us",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name="address-card"
            type="font-awesome"
            size={22}
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    drawerBackgroundColor: "#D1C4E9",
    contentComponent: CustomDrawerContentComponent,
  }
);

class Main extends Component {
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#512DA8",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
