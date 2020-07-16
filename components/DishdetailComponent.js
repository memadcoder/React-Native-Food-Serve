import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Button,
  Alert,
  PanResponder,
} from "react-native";
import { Card, Rating, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";

import { postFavorite, postComment } from "../Redux/ActionCreators";

import * as Animatable from "react-native-animatable";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (commentDetails) => dispatch(postComment(commentDetails)),
});

function RenderDish(props) {
  const dish = props.dish;

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true;
    else return false;
  };

  // handleViewRef = (ref) => (this.view = ref);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    // onPanResponderGrant: () => {
    //   this.view
    //     .rubberBand(1000)
    //     .then((endState) =>
    //       console.log(endState.finished ? "finished" : "cancelled")
    //     );
    // },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        // console.log("swiped enough");
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + dish.name + " to favorite?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress();
              },
            },
          ],
          { cancelable: false }
        );
      }
      return true;
    },
  });

  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        // ref={this.handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              flexDirection: "row",
              margin: 20,
            }}
          >
            <View>
              <Icon
                raised
                reverse
                name={props.favorite ? "heart" : "heart-o"}
                type="font-awesome"
                size={32}
                color="#f50"
                onPress={() =>
                  props.favorite
                    ? console.log("Already favorite")
                    : props.onPress()
                }
              />
            </View>
            <View>
              <Icon
                raised
                reverse
                name="pencil"
                type="font-awesome"
                size={32}
                color="#f50"
                onPress={() => props.toggleComment()}
              />
            </View>
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      author: "",
      rating: 3,
      showCommentForm: false,
    };
  }

  toggleCommentForm() {
    this.setState({ showCommentForm: !this.state.showCommentForm });
  }

  resetForm() {
    this.setState({
      comment: "",
      author: "",
      rating: "",
      showCommentForm: false,
    });
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  handleComment() {
    const dishId = this.props.navigation.getParam("dishId", "");

    const commentDetails = {
      dishId: dishId,
      comment: this.state.comment,
      author: this.state.author,
      rating: this.state.rating,
    };
    if (commentDetails.comment !== "" || commentDetails.author !== "") {
      this.props.postComment(commentDetails);
    } else {
      alert("Fill both author and comment box");
    }
    this.resetForm();
    this.toggleCommentForm();
  }

  static navigationOptions = {
    title: "Dish Details",
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          toggleComment={() => this.toggleCommentForm()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showCommentForm}
          onDismiss={() => this.toggleCommentForm()}
          onRequestClose={() => this.toggleCommentForm()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              fractions="{1}"
              startingValue="{1}"
              onFinishRating={(rating) => (this.state.rating = rating)}
            />
            <Input
              placeholder="Author"
              leftIcon={<Icon name="user" size={24} color="black" />}
              onChangeText={(value) => (this.state.author = value)}
            />
            <Input
              placeholder="Comment"
              leftIcon={<Icon name="comment" size={24} color="black" />}
              onChangeText={(value) => (this.state.comment = value)}
            />
            <View>
              <Button
                onPress={() => {
                  this.toggleCommentForm();
                  this.handleComment();
                  this.resetForm();
                }}
                color="#512DA8"
                title="Submit"
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={() => {
                  this.resetForm();
                  this.toggleCommentForm();
                }}
                color="#512DA8"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
