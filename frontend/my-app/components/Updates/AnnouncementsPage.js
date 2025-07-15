import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollContext } from "../utility/ScrollContext";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalBottomSheet } from "../utility/GlobalBottomSheetContext";
import { useFetchContext } from "../utility/FetchContext";
import CommentPage from "./CommentPage";
import { useToast } from "../utility/ToastContext";
import RenderHTML from "react-native-render-html";

const getTagColor = (tag) => {
  switch (tag) {
    case "News":
      return "#E74C3C"; // A shade of red
    case "Events":
      return "#9B59B6"; // A shade of purple
    case "Announcements":
      return "#F39C12"; // A shade of orange
    default:
      return "#3498DB"; // Default blue
  }
};

const AnnouncementPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const { width } = useWindowDimensions();

  const { showToast } = useToast();

  const { fetchUpdates } = useFetchContext();

  const { scrollY, previousScrollY, scrollDirection } = useScrollContext();

  const { open: openSheet, close: closeSheet } = useGlobalBottomSheet();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";

      const currentScrollY = event.contentOffset.y;

      // Determine scroll direction
      if (currentScrollY > previousScrollY.value && currentScrollY > 0) {
        // Scrolling down and not at the very top
        scrollDirection.value = "down";
      } else if (currentScrollY < previousScrollY.value) {
        // Scrolling up
        scrollDirection.value = "up";
        // console.log("scrolling up", scrollDirection.value); // You can keep or remove this console log
      } else if (currentScrollY <= 0) {
        // At the very top or overscrolling up
        scrollDirection.value = "up"; // Ensure header is visible
      }

      // Always update previousScrollY and scrollY values
      previousScrollY.value = currentScrollY;
      scrollY.value = currentScrollY;
    },
  });

  useEffect(() => {
    loadFeeds();
    console.log(new Date());
  }, []);

  const loadFeeds = async () => {
    setLoadingFeeds(true);
    setNetworkError(false);
    const response = await fetchUpdates("announcements");
    if (response.error) {
      setNetworkError(true);
      showToast(
        "Network error. Make sure you are connected to the internet",
        3000,
        "#222",
        "bottom"
      );
    } else {
      setFeeds(response.data);
    }
    setLoadingFeeds(false);
  };

  function shuffleFeeds(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const onRefreshing = async () => {
    setRefreshing(true);
    const response = await fetchUpdates("all");
    if (response.error) {
      showToast(
        "Couldn't refresh feeds. Check your internet connection",
        6000,
        "#222",
        "top"
      );
    } else {
      setFeeds(shuffleFeeds(response.data));
      showToast("Updates refreshed successfully", 6000, "#222", "top");
    }
    setRefreshing(false);
  };

  const handleOpenFeedModal = (feedItem) => {
    setSelectedFeed(feedItem);
    setModalVisible(true);
  };

  const handleOpenComments = ({ comments }) => {
    openSheet({ content: <CommentPage /> });
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["white", "white"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {loadingFeeds ? (
          <View style={styles.centeredLoading}>
            <ActivityIndicator size="large" color="#00BF63" />
            <Text style={styles.loadingText}>Loading feeds...</Text>
          </View>
        ) : networkError ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 20, color: "red", fontWeight: "bold" }}>
              Network Error
            </Text>
            <Text style={{ fontWeight: 300, padding: 10, textAlign: "center" }}>
              Make sure you have your data ON and connected to the internet.
              Press reload to load updates
            </Text>
            <TouchableOpacity
              onPress={loadFeeds}
              style={{
                padding: 10,
                borderRadius: 20,
                backgroundColor: "blue",
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white" }}>Reload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.innerContainer]}>
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ position: "absolute", top: 50 }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefreshing}
                  progressViewOffset={30}
                />
              }
              data={feeds}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.normalCard,
                    {
                      backgroundColor: pressed ? "#f1f1f1" : "#fff",
                    },
                  ]}
                  onPress={() => handleOpenFeedModal(item)}
                >
                  <View style={styles.normalCardHeader}>
                    <TouchableHighlight
                      underlayColor="#f0f0f0"
                      onPress={() => console.log("Source pressed")}
                      style={styles.sourceHighlight}
                    >
                      <View style={styles.sourceInfo}>
                        <Ionicons
                          name="person-circle-outline"
                          size={28}
                          color="#555"
                        />
                        <Text style={styles.sourceText}>{item.category}</Text>
                      </View>
                    </TouchableHighlight>
                    <View
                      style={[
                        styles.tagBadge,
                        { borderBottomColor: getTagColor(item.tag) },
                      ]}
                    >
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.normalTitle}>{item.title}</Text>
                  <Pressable>
                    <Image
                      source={require("../../assets/knust-logo.png")}
                      style={styles.normalImage}
                      resizeMode="cover"
                    />
                  </Pressable>

                  <View style={styles.normalContent}>
                    <Text style={styles.normalDescription}>{item.summary}</Text>
                    <Pressable
                      style={styles.readMoreButton}
                      onPress={() => {
                        handleOpenFeedModal(item);
                      }}
                    >
                      <Text style={styles.readMoreText}>Read More</Text>
                    </Pressable>
                  </View>

                  <View style={styles.statisticsContainer}>
                    <Pressable>
                      <Text style={styles.hashtag}>#TreatAsUrgent</Text>
                    </Pressable>

                    <View style={styles.statsIcons}>
                      <Pressable style={styles.statItem}>
                        <Text style={styles.statText}>24k</Text>

                        <Ionicons name="chatbubble" color="#3498DB" size={16} />
                      </Pressable>
                      <Pressable style={styles.statItem}>
                        <Text style={styles.statText}>220</Text>
                        <Ionicons name="heart" color="#E74C3C" size={16} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.interactionIconsContainer}>
                    <Pressable
                      style={styles.interactionButton}
                      onPress={handleOpenComments}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#555"
                      />
                      <Text style={styles.interactionButtonText}>Comment</Text>
                    </Pressable>
                    <Pressable style={styles.interactionButton}>
                      <Ionicons name="heart-outline" size={18} color="#555" />
                      <Text style={styles.interactionButtonText}>Like</Text>
                    </Pressable>
                    <Pressable style={styles.interactionButton}>
                      <Ionicons name="share-outline" size={18} color="#555" />
                      <Text style={styles.interactionButtonText}>Share</Text>
                    </Pressable>
                    <Pressable style={styles.interactionButton}>
                      <Ionicons
                        name="bookmark-outline"
                        size={18}
                        color="#555"
                      />
                      <Text style={styles.interactionButtonText}>Save</Text>
                    </Pressable>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}
      </LinearGradient>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#222", "#444", "#777", "#888", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.modalHeaderGradientContainer}
          >
            <View style={styles.modalHeaderGradient}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </Pressable>
              <View style={styles.modalHeaderActions}>
                <Pressable
                  style={styles.modalActionButton}
                  onPress={() => setImageModalVisible(true)}
                >
                  <Ionicons name="image" size={24} color="#fff" />
                </Pressable>
                <Pressable style={styles.modalActionButton}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </Pressable>
              </View>
            </View>
          </LinearGradient>

          {selectedFeed && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.feedDetailImageContainer}>
                <Image
                  source={require("../../assets/knust-logo.png")}
                  style={styles.feedDetailImage}
                />
                <View
                  style={[
                    styles.feedDetailRoundedImageContainer,
                    { borderColor: getTagColor(selectedFeed.tag) },
                  ]}
                >
                  <Image
                    source={require("../../assets/knust-logo.png")}
                    style={styles.feedDetailRoundedImage}
                  />
                </View>
              </View>

              <View style={styles.feedDetailContent}>
                <View style={styles.feedDetailHeader}>
                  <View style={styles.feedDetailSource}>
                    <Text style={styles.feedDetailSourceText}>
                      {selectedFeed.source}
                    </Text>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color="#555"
                      style={styles.feedDetailSourceIcon}
                    />
                  </View>
                  <View
                    style={[
                      styles.feedDetailTag,
                      { borderBottomColor: getTagColor(selectedFeed.tag) },
                    ]}
                  >
                    <Text style={styles.feedDetailTagText}>
                      {selectedFeed.tag}
                    </Text>
                  </View>
                </View>

                <Text style={styles.feedDetailTitle}>{selectedFeed.title}</Text>

                <View style={styles.feedDetailMetaInfo}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#777" />
                    <Text style={styles.metaText}>{selectedFeed.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#777" />
                    <Text style={styles.metaText}>{selectedFeed.date}</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.feedDetailSourceLink} numberOfLines={1}>
                      {selectedFeed.link}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.feedDescriptionSection}>
                  <Text style={styles.feedDescriptionTitle}>
                    {selectedFeed.title}
                  </Text>
                  <Text style={styles.feedDescriptionLabel}>Description</Text>

                  <RenderHTML
                    tagsStyles={{
                      p: { fontSize: 15, lineHeight: 28, fontWeight: 300 },
                      img: { margin: 20, width: 350, borderRadius: 10 },
                      figure: { margin: 10 },
                    }}
                    contentWidth={width}
                    source={{ html: selectedFeed.content }}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      <Modal
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.fullImageModalContainer}>
          <Pressable
            style={styles.fullImageModalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close-circle" color="#fff" size={40} />
          </Pressable>
          {selectedFeed && (
            <Image
              source={{ uri: selectedFeed.image }}
              resizeMode="contain"
              style={styles.fullImage}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  centeredLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },

  // Section Headers (Urgent & Trending)
  sectionContainer: {},
  sectionHeaderContainer: {
    paddingLeft: 5,
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    padding: 5,
  },

  // Urgent Feed Card
  urgentCard: {
    width: 250,
    marginRight: 5,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  urgentImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  urgentContent: {
    padding: 15,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  urgentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  urgentSourceText: {
    fontSize: 13,
    color: "#777",
  },
  urgentTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  urgentTagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  // Normal Feed Card
  normalCard: {
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    overflow: "hidden",
  },
  normalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingBottom: 0,
  },
  sourceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sourceHighlight: {
    borderRadius: 20,
    padding: 5,
  },
  sourceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  tagBadge: {
    borderBottomWidth: 3,
    paddingBottom: 2,
    alignSelf: "flex-start",
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#555",
  },
  normalTitle: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#333",
  },
  normalImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    marginTop: 10,
  },
  normalContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  normalDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: "#666",
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  readMoreText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  statisticsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  hashtag: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  statsIcons: {
    flexDirection: "row",
    gap: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    fontSize: 13,
    color: "#555",
  },
  interactionIconsContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
  },
  interactionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  interactionButtonText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },

  // Trending Feed Card
  trendingCard: {
    width: 280,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 5,
  },
  trendingImageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15,
  },
  trendingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 15,

    height: "100%",
    justifyContent: "flex-end",
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  trendingDescription: {
    fontSize: 13,
    color: "#eee",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  modalHeaderGradientContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    opacity: 0.6,
    paddingBottom: 5,
  },

  modalHeaderGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalGradientOverlay: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBackButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 25,
    padding: 8,
  },
  modalHeaderActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalActionButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 25,
    padding: 8,
  },

  feedDetailImageContainer: {
    height: 250,
  },
  feedDetailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  feedDetailRoundedImageContainer: {
    position: "relative",
    bottom: 60,
    marginLeft: 20,
    borderWidth: 4,
    alignSelf: "flex-start",
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 2,
  },
  feedDetailRoundedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  feedDetailContent: {
    paddingHorizontal: 20,
  },
  feedDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  feedDetailSource: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 70,
  },
  feedDetailSourceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  feedDetailSourceIcon: {
    opacity: 0.8,
  },
  feedDetailTag: {
    borderBottomWidth: 3,
    paddingBottom: 2,
    alignSelf: "flex-start",
    margin: 10,
  },
  feedDetailTagText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
  },
  feedDetailTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 15,
    color: "#333",
  },
  feedDetailMetaInfo: {
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 20,
    padding: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: "#777",
  },
  feedDetailSourceLink: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  feedDescriptionSection: {
    marginBottom: 30, // Space at the bottom
  },
  feedDescriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  feedDescriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  feedDescriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
    marginBottom: 15,
  },
  feedDescriptionImg: {
    width: "100%",
    height: 200, // Fixed height for inline image
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 15,
  },

  // Full Image Modal Styles
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)", // Darker, semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageModalCloseButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker background for button
    borderRadius: 30,
    padding: 5,
  },
  fullImage: {
    width: "90%", // Max width
    height: "80%", // Max height
  },
});

export default AnnouncementPage;
