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
  StatusBar,
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
  const colors = {
    News: {
      primary: "#FF6B6B",
      secondary: "#FFE5E5",
      accent: "#FF8E8E"
    },
    Events: {
      primary: "#6C5CE7",
      secondary: "#E8E5FF",
      accent: "#8B7EE8"
    },
    Announcements: {
       primary: "#FF6B6B",
      secondary: "#FFE5E5",
      accent: "#FF8E8E"
    },
    default: {
      // primary: "#00BF63",
      // secondary: "#E5FFF2",
      // accent: "#4DD390"

         primary: "#FF6B6B",
      secondary: "#FFE5E5",
      accent: "#FF8E8E"
    }
  };
  return colors[tag] || colors.default;
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const AnnouncementCard = ({ item, onPress, onComment, onLike, onShare, onSave }) => {
  const tagColors = getTagColor(item.tag);
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modernCard,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
      onPress={() => onPress(item)}
      android_ripple={{ color: '#f0f0f0' }}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.authorSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="business" size={20} color={tagColors.primary} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.category}</Text>
            <Text style={styles.timeStamp}>{formatTimeAgo(item.date)}</Text>
          </View>
        </View>
        
        <View style={[styles.modernTag, { backgroundColor: tagColors.secondary }]}>
          <View style={[styles.tagDot, { backgroundColor: tagColors.primary }]} />
          <Text style={[styles.tagText, { color: tagColors.primary }]}>{item.tag}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={styles.modernTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.modernSummary} numberOfLines={3}>{item.summary}</Text>
      </View>

      {/* Card Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/knust-logo.png")}
          style={styles.modernImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)']}
          style={styles.imageOverlay}
        />
      </View>

      {/* Engagement Stats */}
      <View style={styles.engagementSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#666" />
            <Text style={styles.statNumber}>2.4k</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={14} color="#666" />
            <Text style={styles.statNumber}>124</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={14} color="#666" />
            <Text style={styles.statNumber}>89</Text>
          </View>
        </View>
        
        <Pressable style={styles.readMoreBtn}>
          <Text style={[styles.readMoreText, { color: tagColors.primary }]}>Read More</Text>
          <Ionicons name="arrow-forward" size={14} color={tagColors.primary} />
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Ionicons name="heart-outline" size={18} color="#666" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={18} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <Ionicons name="bookmark-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
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

      if (currentScrollY > previousScrollY.value && currentScrollY > 0) {
        scrollDirection.value = "down";
      } else if (currentScrollY < previousScrollY.value) {
        scrollDirection.value = "up";
      } else if (currentScrollY <= 0) {
        scrollDirection.value = "up";
      }

      previousScrollY.value = currentScrollY;
      scrollY.value = currentScrollY;
    },
  });

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    setLoadingFeeds(true);
    setNetworkError(false);
    const response = await fetchUpdates("announcements");
    if (response.error) {
      setNetworkError(true);
      showToast(
        "Network error. Please check your connection",
        3000,
        "#FF6B6B",
        "bottom"
      );
    } else {
      setFeeds(response.data);
    }
    setLoadingFeeds(false);
  };

  const onRefreshing = async () => {
    setRefreshing(true);
    const response = await fetchUpdates("announcements");
    if (response.error) {
      showToast(
        "Couldn't refresh feeds. Check your connection",
        3000,
        "#FF6B6B",
        "top"
      );
    } else {
      setFeeds(response.data);
      showToast("Updates refreshed successfully", 2000, "#00BF63", "top");
    }
    setRefreshing(false);
  };

  const handleOpenFeedModal = (feedItem) => {
    setSelectedFeed(feedItem);
    setModalVisible(true);
  };

  const handleOpenComments = () => {
    openSheet({ content: <CommentPage /> });
  };

  const handleLike = () => {
    showToast("Liked!", 1000, "#FF6B6B", "bottom");
  };

  const handleShare = () => {
    showToast("Shared!", 1000, "#00BF63", "bottom");
  };

  const handleSave = () => {
    showToast("Saved!", 1000, "#6C5CE7", "bottom");
  };

  if (loadingFeeds) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#00BF63" />
            <Text style={styles.loadingText}>Loading announcements...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (networkError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Connection Problem</Text>
          <Text style={styles.errorMessage}>
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFeeds}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Announcements</Text>
        <Text style={styles.headerSubtitle}>{feeds.length} updates available</Text>
      </View>

      {/* Feed List */}
      <Animated.FlatList
        data={feeds}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshing}
            colors={["#00BF63"]}
            tintColor="#00BF63"
            progressViewOffset={10}
          />
        }
        renderItem={({ item, index }) => (
          <AnnouncementCard
            item={item}
            onPress={handleOpenFeedModal}
            onComment={handleOpenComments}
            onLike={handleLike}
            onShare={handleShare}
            onSave={handleSave}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalActionButton}>
                <Ionicons name="share-social" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalActionButton}>
                <Ionicons name="bookmark" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {selectedFeed && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Featured Image */}
              <View style={styles.modalImageContainer}>
                <Image
                  source={require("../../assets/knust-logo.png")}
                  style={styles.modalImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.1)']}
                  style={styles.modalImageOverlay}
                />
              </View>

              {/* Content Section */}
              <View style={styles.modalBody}>
                {/* Article Header */}
                <View style={styles.articleHeader}>
                  <View style={styles.modalAuthorSection}>
                    <View style={styles.modalAvatarContainer}>
                      <Ionicons name="business" size={24} color={getTagColor(selectedFeed.tag).primary} />
                    </View>
                    <View>
                      <Text style={styles.modalAuthorName}>{selectedFeed.category}</Text>
                      <Text style={styles.modalTimestamp}>{formatTimeAgo(selectedFeed.date)}</Text>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.modalTag, 
                    { backgroundColor: getTagColor(selectedFeed.tag).secondary }
                  ]}>
                    <Text style={[
                      styles.modalTagText, 
                      { color: getTagColor(selectedFeed.tag).primary }
                    ]}>
                      {selectedFeed.tag}
                    </Text>
                  </View>
                </View>

                {/* Article Title */}
                <Text style={styles.modalTitle}>{selectedFeed.title}</Text>

                {/* Article Meta */}
                <View style={styles.articleMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={16} color="#888" />
                    <Text style={styles.metaText}>{selectedFeed.date}</Text>
                  </View>
                  {selectedFeed.link && (
                    <TouchableOpacity style={styles.metaRow}>
                      <Ionicons name="link-outline" size={16} color="#007AFF" />
                      <Text style={styles.linkText} numberOfLines={1}>
                        {selectedFeed.link}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Article Content */}
                <View style={styles.articleContent}>
                  <RenderHTML
                    tagsStyles={{
                      p: { 
                        fontSize: 16, 
                        lineHeight: 26, 
                        fontWeight: '400',
                        color: '#333',
                        marginBottom: 16
                      },
                      h1: { 
                        fontSize: 24, 
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: 16
                      },
                      h2: { 
                        fontSize: 20, 
                        fontWeight: '600',
                        color: '#1a1a1a',
                        marginBottom: 12
                      },
                      img: { 
                        marginVertical: 16, 
                        borderRadius: 12,
                        overflow: 'hidden'
                      },
                    }}
                    contentWidth={width - 40}
                    source={{ html: selectedFeed.content || '<p>No content available</p>' }}
                  />
                </View>

                {/* Engagement Section */}
                <View style={styles.modalEngagement}>
                  <View style={styles.engagementStats}>
                    <Text style={styles.engagementText}>2.4k views • 124 comments • 89 likes</Text>
                  </View>
                  
                  <View style={styles.modalActionBar}>
                    <TouchableOpacity style={styles.modalActionBtn}>
                      <Ionicons name="chatbubble-outline" size={20} color="#666" />
                      <Text style={styles.modalActionText}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalActionBtn}>
                      <Ionicons name="heart-outline" size={20} color="#666" />
                      <Text style={styles.modalActionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalActionBtn}>
                      <Ionicons name="share-social-outline" size={20} color="#666" />
                      <Text style={styles.modalActionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BF63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // List
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  separator: {
    height: 16,
  },

  // Modern Card
  modernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  modernTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Card Content
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modernTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 8,
  },
  modernSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Image
  imageContainer: {
    position: 'relative',
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  modernImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },

  // Engagement
  engagementSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Action Bar
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    height: 300,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  modalBody: {
    padding: 20,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAuthorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAuthorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  modalTimestamp: {
    fontSize: 13,
    color: '#888',
  },
  modalTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 32,
    marginBottom: 16,
  },
  articleMeta: {
    gap: 12,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#888',
  },
  linkText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
    flex: 1,
  },
  articleContent: {
    marginBottom: 32,
  },
  modalEngagement: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  engagementStats: {
    marginBottom: 20,
  },
  engagementText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  modalActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  modalActionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default AnnouncementPage;