import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid"; // Make sure you have 'uuid' installed: npm install uuid

const SEARCH_HISTORY_KEY = "@knustpal_search_history";

const SearchPage = () => {
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  // Function to save a new search term
  const saveSearchTerm = async (term) => {
    try {
      term = term.trim();
      if (!term) return; // Don't save empty terms

      const existingHistoryString = await AsyncStorage.getItem(
        SEARCH_HISTORY_KEY
      );
      // Initialize with an empty array if no history exists
      let history = existingHistoryString
        ? JSON.parse(existingHistoryString)
        : [];

      // Filter out the current term if it already exists, to bring it to the top
      history = history.filter((item) => item.text !== term);

      // Add the new term to the beginning of the array
      history.unshift({ text: term, key: uuidv4() });

      // Limit the number of recent searches
      if (history.length > 10) {
        history = history.slice(0, 10); // Assign the new array back to history
      }

      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      console.log("Search term saved:", term);

      // After saving, immediately update the state to reflect the change
      setRecentSearches(history);
    } catch (err) {
      console.error("Error setting searched item:", err); // Use console.error for errors
    }
  };

  // Function to get recent search terms
  const getRecentSearches = async () => {
    try {
      const historyString = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      // Ensure we parse to an array, and if null/empty, use an empty array
      const history = historyString ? JSON.parse(historyString) : [];
      setRecentSearches(history);
      console.log("Recent searches loaded:", history);
    } catch (err) {
      console.error("Error getting searched items:", err);
      setRecentSearches([]); // Ensure state is cleared on error
    }
  };

  // Handler for when the user submits a search
  const handleSearch = async () => {
    if (searchText.trim()) {
      await saveSearchTerm(searchText);
      // Optionally navigate to a search results page here
      // navigation.navigate('SearchResults', { query: searchText.trim() });
      setSearchText(""); // Clear the input after search
    }
  };

  // Handler for when a user clicks a recent search term
  const handleRecentSearchPress = async (term) => {
    setSearchText(term); // Populate the search input with the recent term
    // Optionally trigger a search immediately or let the user edit it
    // await saveSearchTerm(term); // If you want to re-save it to bring to top
    // navigation.navigate('SearchResults', { query: term });
  };

  // Effect to focus the input when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      getRecentSearches(); // Load recent searches every time the screen is focused

      return () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
        setSearchText(""); // Clear search text when leaving the screen
      };
    }, []) // Empty dependency array means this runs once on mount and once on unmount
  );

  // Effect to update the navigation header options
  // This useCallback depends on `searchText` and `navigation`
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            style={{ marginLeft: 5 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={30} />
          </Pressable>
        ),
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              backgroundColor: "#E0E0E0",
              borderRadius: 20,
              paddingHorizontal: 30,
              marginHorizontal: 20,
              flex: 1, // Added flex to allow the TextInput to expand
            }}
          >
            <Ionicons name="search" size={20} />
            <TextInput
              placeholder="Search updates..."
              value={searchText}
              onChangeText={(value) => setSearchText(value)}
              returnKeyType="search"
              autoCapitalize="none"
              ref={inputRef}
              style={{ flex: 1, paddingLeft: 5 }} // Added flex: 1 and padding
              onSubmitEditing={handleSearch}
            />
            {searchText.length > 0 && ( // Check length for showing clear button
              <Pressable onPress={() => setSearchText("")}>
                <Ionicons name="close" size={20} />
              </Pressable>
            )}
          </View>
        ),
      });
    }, [searchText, navigation]) // Dependencies: Re-run when searchText or navigation object changes
  );

  // Removed this useEffect because getRecentSearches is now called in useFocusEffect

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Searches</Text>
      {recentSearches.length > 0 ? ( // Corrected check for empty array
        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item.key} // Ensure item.key is always present
          contentContainerStyle={styles.searchHistoryContainer}
          renderItem={({ item }) => (
            <Pressable
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchPress(item.text)}
            >
              <Text style={styles.recentSearchText}>{item.text}</Text>
              {/* Optional: Add a delete button for each item */}
              {/* <Pressable onPress={() => deleteSearchItem(item.key)}>
                <Ionicons name="close-circle-outline" size={20} color="gray" />
              </Pressable> */}
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.recentText}>Search for updates and news</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure container takes full height
    paddingHorizontal: 20,
    paddingTop: 10, // Add some top padding
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noResultsContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  recentText: {
    color: "#555",
  },
  searchHistoryContainer: {
    // You might want to adjust padding/margins here if needed
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes text and optional delete button apart
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  recentSearchText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SearchPage;
