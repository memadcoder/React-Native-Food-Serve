import React, { Component } from "react";
import { Card, Input } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Modal,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import DateTimePicker from "@react-native-community/datetimepicker";
import FaIcon from "react-native-vector-icons/FontAwesome";
import * as Calendar from "expo-calendar";

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      showModal: false,
      showDatepicker: false,
    };
  }

  static navigationOptions = {
    title: "Reserve Table",
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  obtainCalendarPermission = async () => {
    let calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
    if (calendarPermission.status !== "granted") {
      Alert.alert("Permission not granted to show notifications");
    }
    return calendarPermission;
  };

  addReservationToCalendar = async (date) => {
    let permission = await this.obtainCalendarPermission();
    // console.log(JSON.stringify(permission));
    if (permission.status == "granted") {
      // console.log("adding to calendar!");

      let defaultCalendars = await Calendar.getCalendarsAsync();

      console.log(defaultCalendars);

      const calendar = defaultCalendars.find(({ isPrimary }) => isPrimary);

      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: "Expo Calendar" };

      let details = {
        title: "Con Fusion Table Reservation",

        source: defaultCalendarSource,

        name: "internalCalendarName",

        color: "blue",

        entityType: Calendar.EntityTypes.EVENT,

        sourceId: defaultCalendarSource.id,

        ownerAccount: "personal",

        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      };

      const calendarId = await Calendar.createCalendarAsync(details);

      console.log("Calender " + calendarId);

      await Calendar.createEventAsync(calendarId, {
        title: "Con Fusion Table Reservation",
        timeZone: "Asia/Hong_Kong",
        location:
          "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
        startDate: new Date(Date.parse(date)),
        endDate: new Date(Date.parse(date) + 7200000),
      });
    }
  };

  handleReservation() {
    const details = this.state;

    this.addReservationToCalendar(details.date);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date().toISOString(),
      showModal: false,
    });
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (permission.status !== "granted") {
        Alert.alert("Permission not granted to show notifications");
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: "Your Reservation",
      body: "Reservation for " + date + " requested",
      ios: {
        sound: true,
      },
      android: {
        sound: true,
        vibrate: true,
        color: "#512DA8",
      },
    });
  }
  toggleDatepicker() {
    this.setState({ showDatepicker: !this.state.showDatepicker });
  }

  render() {
    const onDateChange = (event, selectedDate) => {
      if (event.type == "set") {
        this.setState({
          date: selectedDate.toISOString(),
          showDatepicker: false,
        });
      } else {
        this.setState({ showDatepicker: false });
      }
    };

    const DatePicker = () => {
      if (this.state.showDatepicker) {
        return (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        );
      } else {
        return <View></View>;
      }
    };

    return (
      <ScrollView>
        <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ guests: itemValue })
              }
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              onTintColor="#512DA8"
              onValueChange={(value) => this.setState({ smoking: value })}
            ></Switch>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <FaIcon
              name="calendar"
              size={24}
              onPress={() => this.setState({ showDatepicker: true })}
            />
            <DatePicker />
          </View>

          <View style={styles.formRow}>
            <Button
              onPress={() => {
                Alert.alert(
                  "Your Reservation OK?",
                  "Number of guests: " +
                    this.state.guests +
                    "\n" +
                    "Smoking: " +
                    this.state.smoking +
                    "\n" +
                    "Date and Time: " +
                    this.state.date,
                  [
                    {
                      text: "Cancel",
                      onPress: () => this.resetForm(),
                      style: " cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        this.handleReservation();
                        this.presentLocalNotification(this.state.date);
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              title="Reserve"
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    // alignItems: 'center',
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 1,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: "space-between",
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
});

export default Reservation;
