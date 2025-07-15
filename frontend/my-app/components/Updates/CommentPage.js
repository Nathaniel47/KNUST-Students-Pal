import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  findNodeHandle,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-video";

const fakeComments = [
  {
    id: 1,
    name: "Dan Adu",
    comment: "Loving this already",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
    replies: [
      {
        id: 0,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },

      {
        id: 1,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },
      {
        id: 2,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },
      {
        id: 3,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },
      {
        id: 4,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },
    ],
  },

  {
    id: 2,
    name: "Justice Abban",
    comment:
      "I think this is really funny. I just love you content and I hope you do more of every day , It is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
    replies: [
      {
        id: 1,
        name: "Emmanuel Doe",
        comment: "That is nice bro",
        image: require("../../assets/st1.jpg"),
        likes: 2,
        hours: "10h age",
        media: [],
      },
    ],
  },
  {
    id: 3,
    name: "James Abban",
    comment:
      "This is the nicest post I have seen in a while and it is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
  },
  {
    id: 4,
    name: "James Abban",
    comment:
      "This is the nicest post I have seen in a while and it is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
  },
  {
    id: 5,
    name: "James Abban",
    comment:
      "This is the nicest post I have seen in a while and it is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
  },
  {
    id: 6,
    name: "James Abban",
    comment:
      "This is the nicest post I have seen in a while and it is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
  },
  {
    id: 7,
    name: "James Abban",
    comment:
      "This is the nicest post I have seen in a while and it is really interesting.",
    image: require("../../assets/st1.jpg"),
    likes: 23,
    hours: "10h ago",
    dislikes: 2,
  },
];

const CommentPage = ({ commentItems }) => {
  const [text, setText] = useState("");
  const [enteredComments, setEnteredComments] = useState(null);
  const [comments, setComments] = useState([...fakeComments]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyVisibility, setReplyVisibility] = useState({});
  const inputRef = useRef();
  const [replyingToId, setReplyingToId] = useState(null);
  const [likes, setLikes] = useState(null);
  const [dislikes, setDislikes] = useState(null);
  const commentsRef = useRef({});
  const flatListRef = useRef();
  const [likedComments, setLikedComments] = useState({});
  const [dislikedComments, setDislikedComments] = useState({});
  const [likedReplies, setLikedReplies] = useState({});
  const [dislikedReplies, setDislikedReplies] = useState({});

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [replyingToId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    // Fix: check if result.assets is valid
    if (result?.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      setComments((prevComments) => [
        {
          id: uuidv4(),
          name: "Jane Adu",
          image: require("../../assets/st2.jpg"),
          comment: "", // No text, just media
          likes: 0,
          dislikes: 0,
          hours: `${new Date().getHours()}h ago`,
          media: [imageUri],
          replies: [],
        },
        ...prevComments,
      ]);
    }
  };

  const handleLikeReply = (commentId, replyId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const updatedReplies = comment.replies?.map((reply) => {
            if (reply.id === replyId) {
              const alreadyLiked = likedReplies[`${commentId}_${replyId}`];
              const newLikes = alreadyLiked ? reply.likes - 1 : reply.likes + 1;
              return { ...reply, likes: newLikes };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );

    const replyKey = `${commentId}_${replyId}`;
    setLikedReplies((prev) => ({
      ...prev,
      [replyKey]: !prev[replyKey],
    }));

    if (dislikedReplies[replyKey]) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            const updatedReplies = comment.replies?.map((reply) => {
              if (reply.id === replyId) {
                return { ...reply, dislikes: reply.dislikes - 1 };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );
      setDislikedReplies((prev) => ({
        ...prev,
        [replyKey]: false,
      }));
    }
  };

  const handleDislikeReply = (commentId, replyId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const updatedReplies = comment.replies?.map((reply) => {
            if (reply.id === replyId) {
              const alreadyDisliked =
                dislikedReplies[`${commentId}_${replyId}`];
              const newDislikes = alreadyDisliked
                ? reply.dislikes - 1
                : reply.dislikes + 1;
              return { ...reply, dislikes: newDislikes };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );

    const replyKey = `${commentId}_${replyId}`;
    setDislikedReplies((prev) => ({
      ...prev,
      [replyKey]: !prev[replyKey],
    }));

    if (likedReplies[replyKey]) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            const updatedReplies = comment.replies?.map((reply) => {
              if (reply.id === replyId) {
                return { ...reply, likes: reply.likes - 1 };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );
      setLikedReplies((prev) => ({
        ...prev,
        [replyKey]: false,
      }));
    }
  };

  const handleLike = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const alreadyLiked = likedComments[commentId];
          const newLikes = alreadyLiked ? comment.likes - 1 : comment.likes + 1;
          return { ...comment, likes: newLikes };
        }
        return comment;
      })
    );

    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // If it was disliked before, remove dislike
    if (dislikedComments[commentId]) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, dislikes: comment.dislikes - 1 };
          }
          return comment;
        })
      );
      setDislikedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  const handleDislike = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const alreadyDisliked = dislikedComments[commentId];
          const newDislikes = alreadyDisliked
            ? comment.dislikes - 1
            : comment.dislikes + 1;
          return { ...comment, dislikes: newDislikes };
        }
        return comment;
      })
    );

    setDislikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // If it was liked before, remove like
    if (likedComments[commentId]) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes - 1 };
          }
          return comment;
        })
      );
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  const handleFocus = (commentId) => {
    setReplyingToId(commentId);
    inputRef.current?.focus();

    // setTimeout(() => {
    //   const commentRef = commentsRef.current[commentId];
    //   if (commentRef && flatListRef.current) {
    //     console.log(commentRef.measureLayout);
    //     commentRef.measureLayout(
    //       findNodeHandle(flatListRef.current),
    //       (x, y) => {
    //         flatListRef.current.scrollToOffset({
    //           offset: Math.max(0, y - 100),
    //           animated: true,
    //         });
    //       },
    //       (error) => {
    //         console.warn("Layout measurement failed:", error);
    //       }
    //     );
    //   }
    // }, 100);
  };

  const handleShowMoreReplies = (commentId, totalReplies) => {
    setReplyVisibility((prev) => {
      const currentCount = prev[commentId] || 0;
      const nextCount = Math.min(currentCount + 3, totalReplies);
      return { ...prev, [commentId]: nextCount };
    });
  };

  const handleHideReplies = (commentId) => {
    setReplyVisibility((prev) => ({ ...prev, [commentId]: 0 }));
  };

  const handleInputComments = () => {
    if (!text) return;

    const replyData = {
      id: uuidv4(),
      name: "Jane Adu",
      image: require("../../assets/st2.jpg"),
      comment: text,
      likes: likes,
      dislikes: dislikes,
      hours: `${new Date().getHours()}h ago`,
      media: [],
    };

    if (replyingToId) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === replyingToId) {
            const newReplies = comment.replies
              ? [replyData, ...comment.replies]
              : [replyData];
            return { ...comment, replies: newReplies };
          }
          return comment;
        })
      );

      // 👉 Make sure the new reply becomes visible
      setReplyVisibility((prev) => {
        const currentCount = prev[replyingToId] || 0;
        return {
          ...prev,
          [replyingToId]: currentCount + 1,
        };
      });
    } else {
      // New top-level comment
      const newComment = {
        ...replyData,
        replies: [],
      };
      setComments((prev) => [newComment, ...prev]);
    }

    setText("");
    setReplyingToId(null); // Reset reply target
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <BottomSheetFlatList
        ref={flatListRef}
        data={comments}
        contentContainerStyle={{ margin: 10, marginTop: 30, paddingBottom: 30 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.comments,
              replyingToId === item.id && styles.highlighted,
            ]}
            ref={(ref) => {
              if (ref) commentsRef.current[item.id] = ref;
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleFocus(item.id);
              }}
            >
              <View style={styles.commentContainer}>
                <Image style={styles.img} source={item.image} />
                <View style={styles.commentBox}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  {item.media && item.media.length > 0 && (
                    <FlatList
                      data={item.media}
                      keyExtractor={(uri) => uri}
                      horizontal
                      renderItem={({ item }) => {
                        const isImage = item.match(/\.(jpeg|jpg|gif|png)$/i);
                        const isVideo = item.match(
                          /\.(mp4|mov|avi|mkv|webm)$/i
                        );
                        console.log(isVideo);
                        console.log(item);

                        return (
                          <View style={{ marginTop: 5, marginRight: 10 }}>
                            {isImage ? (
                              <Image
                                source={{ uri: item }}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 10,
                                }}
                              />
                            ) : isVideo ? (
                              <Video
                                source={{ uri: item }}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 10,
                                }}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                              />
                            ) : null}
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.statisticsContainer}>
              <View style={styles.statisticsContent}>
                <Text style={styles.time}>{item.hours}</Text>
                <TouchableOpacity
                  style={styles.replyText}
                  onPress={() => {
                    handleFocus(item.id);
                  }}
                >
                  <Text>Reply</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.iconBox}>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => handleLike(item.id)}
                >
                  <Ionicons
                    name={likedComments[item.id] ? "heart" : "heart-outline"}
                    size={16}
                    color={likedComments[item.id] ? "red" : "black"}
                  />
                  <Text>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => handleDislike(item.id)}
                >
                  <Ionicons
                    name={
                      dislikedComments[item.id]
                        ? "thumbs-down"
                        : "thumbs-down-outline"
                    }
                    size={16}
                    color={dislikedComments[item.id] ? "blue" : "black"}
                  />
                  <Text>{item.dislikes}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {item.replies && item.replies.length > 0 && (
              <View style={styles.repliesContainer}>
                {(replyVisibility[item.id] ?? 0) > 0 &&
                  item.replies
                    .slice(0, replyVisibility[item.id] ?? 0)
                    .map((reply) => (
                      <View
                        key={reply.id}
                        style={{ marginLeft: 50, marginVertical: 5 }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            handleFocus(reply.id);
                          }}
                        >
                          <View style={styles.replyContainer}>
                            <Image
                              style={styles.replyImg}
                              source={reply.image}
                            />
                            <View style={styles.commentBox}>
                              <Text style={styles.name}>{reply.name}</Text>
                              <Text style={styles.commentText}>
                                {reply.comment}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>

                        <View style={styles.statisticsContainer}>
                          <View style={styles.replyStatisticsContent}>
                            <Text style={styles.time}>{reply.hours}</Text>
                            <TouchableOpacity
                              style={styles.replyText}
                              onPress={() => {
                                handleFocus(reply.id);
                              }}
                            >
                              <Text>Reply</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.iconBox}>
                            <TouchableOpacity
                              style={styles.icon}
                              onPress={() => handleLikeReply(item.id, reply.id)}
                            >
                              <Ionicons
                                name={
                                  likedReplies[`${item.id}_${reply.id}`]
                                    ? "heart"
                                    : "heart-outline"
                                }
                                size={16}
                                color={
                                  likedReplies[`${item.id}_${reply.id}`]
                                    ? "red"
                                    : "black"
                                }
                              />
                              <Text>{reply.likes}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.icon}
                              onPress={() =>
                                handleDislikeReply(item.id, reply.id)
                              }
                            >
                              <Ionicons
                                name={
                                  dislikedReplies[`${item.id}_${reply.id}`]
                                    ? "thumbs-down"
                                    : "thumbs-down-outline"
                                }
                                size={16}
                                color={
                                  dislikedReplies[`${item.id}_${reply.id}`]
                                    ? "blue"
                                    : "black"
                                }
                              />
                              <Text>{reply.dislikes}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}

                {item.replies.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                      marginLeft: 50,
                      marginTop: 5,
                    }}
                  >
                    {(replyVisibility[item.id] ?? 0) < item.replies.length && (
                      <TouchableOpacity
                        onPress={() =>
                          handleShowMoreReplies(item.id, item.replies.length)
                        }
                      >
                        <Text style={{ color: "#00BF63" }}>
                          View{" "}
                          {item.replies.length -
                            (replyVisibility[item.id] ?? 0)}{" "}
                          more replies
                        </Text>
                      </TouchableOpacity>
                    )}

                    {(replyVisibility[item.id] ?? 0) > 0 && (
                      <TouchableOpacity
                        onPress={() => handleHideReplies(item.id)}
                      >
                        <Text style={{ color: "#00BF63" }}>Hide</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <Image source={require("../../assets/st1.jpg")} style={styles.img} />
        <BottomSheetTextInput
          placeholder={
            replyingToId
              ? `Replying to ${
                  comments.find((c) => c.id === replyingToId)?.name || "user"
                }...`
              : "Write a comment on update..."
          }
          style={styles.input}
          ref={inputRef}
          value={text}
          onChangeText={(value) => {
            setText(value);
          }}
          onEndEditing={handleInputComments}
          multiline
        />
        <TouchableOpacity
          onPress={text ? handleInputComments : pickImage}
          style={styles.inputIcon}
        >
          <Ionicons name={text ? "send" : "image"} size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
    justifyContent: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    maxHeight: 100,
  },
  inputIcon: {
    backgroundColor: "blue",
    padding: 6,
    borderRadius: 20,
  },

  img: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  comments: {
    padding: 10,
  },
  commentContainer: {
    flexDirection: "row",
    gap: 6,
  },
  commentBox: {
    padding: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: 300,
  },
  commentText: {
    fontSize: 16,
    width: 300,
    paddingRight: 10,
  },
  statisticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statisticsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20,
    marginLeft: 40,
    padding: 5,
  },
  iconBox: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  replyContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  replyImg: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  replyStatisticsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20,
    marginLeft: 35,
    padding: 5,
  },
  highlighted: {
    backgroundColor: "#f0f0f0", // Light blue"#e0f7fa"
    borderRadius: 8,
  },
});

export default CommentPage;
