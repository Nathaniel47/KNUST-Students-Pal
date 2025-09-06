import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useNavigation

const CareerHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempTimeFilter, setTempTimeFilter] = useState('all');
  const [tempProgramFilter, setTempProgramFilter] = useState('all');
  const [tempTypeFilter, setTempTypeFilter] = useState('all');

  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  const [showShareSheet, setShowShareSheet] = useState(false);
  const [selectedOpportunityForShare, setSelectedOpportunityForShare] = useState(null);

  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();

      // Ensure a parent exists before trying to set options on it
      if (parent) {
        // Set options when CareerHub is focused
        parent.setOptions({
          headerTitle: 'CareerHub',
          headerTitleStyle: { padding: 10 },
          headerRight: () => (
            <View
              style={{
                marginRight: 20,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
              }}>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24}></Ionicons>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={24}></Ionicons>
              </TouchableOpacity>
            </View>
          ),
        });
      }

      // Cleanup function: runs when CareerHub screen loses focus
      return () => {
        if (parent) {
          // Reset header options on the parent navigator
          parent.setOptions({
            headerTitle: 'Updates', // Clear the title
            headerTitleStyle: {padding:10}, // Reset style if needed
            headerRight: () => ( // Set back to your default headerRight for other tabs
              <View
                style={{
                  marginRight: 20,
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Search');
                  }}
                  // style={{
                  //   flexDirection: 'row',
                  //   gap: 10,
                  //   alignItems: 'center',
                  //   borderWidth: 1,
                  //   borderRadius: 20,
                  //   paddingHorizontal: 20,
                  //   alignSelf: 'center',
                  //   width: 230,
                  //   marginTop: 2,
                  //   backgroundColor: '#fff',
                  //   paddingVertical: 10,
                  //   height: 40,
                  // }}
                  
                  >
                  <Ionicons name="search-outline" size={24} />
                  {/* <Text>Search updates....</Text> */}
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={24}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="person-circle-outline" size={24}></Ionicons>
                </TouchableOpacity>
              </View>
            ),
          });
        }
      };
    }, [navigation]) // Dependency array should include navigation
  );

  // ... rest of your component code (opportunities, filters, etc.)
  // (No changes needed below this point for the header issue)

  const opportunities = [
    {
      id: 1,
      title: 'Software Engineering Internship',
      company: 'Tech Corp',
      type: 'internship',
      location: 'San Francisco, CA',
      program: 'Computer Science',
      duration: '3 months',
      posted: '2 days ago',
      description: 'Join our development team and work on cutting-edge web applications. Gain hands-on experience with React, Node.js, and cloud services. Collaborate with experienced engineers on real-world projects, participate in code reviews, and contribute to significant features. This is a fantastic opportunity to kickstart your career in software development and build a strong foundation in modern web technologies. You will be mentored by senior engineers and work in an agile environment.',
      applyLink: 'https://example.com/apply/software-eng',
      tags: ['React', 'JavaScript', 'Node.js', 'AWS', 'Git', 'Frontend', 'Backend']
    },
    {
      id: 2,
      title: 'Data Science Bootcamp',
      company: 'DataLearn Academy',
      type: 'learning',
      location: 'Online',
      program: 'Data Science',
      duration: '12 weeks',
      posted: '1 week ago',
      description: 'Comprehensive program covering Python, Machine Learning, and Analytics. Learn to build predictive models, analyze large datasets, and visualize insights. This intensive bootcamp is designed for aspiring data scientists and analysts looking to enter the field or enhance their skills. The curriculum includes practical projects, expert-led sessions, and career support.',
      applyLink: 'https://example.com/apply/data-science-bootcamp',
      tags: ['Python', 'ML', 'Statistics', 'Pandas', 'Scikit-learn', 'SQL', 'Data Visualization']
    },
    {
      id: 3,
      title: 'Marketing Assistant Position',
      company: 'Creative Agency',
      type: 'job',
      location: 'New York, NY',
      program: 'Marketing',
      duration: 'Full-time',
      posted: '3 days ago',
      description: 'Entry-level position perfect for recent graduates in marketing. Assist with campaign creation, social media management, and content development. You will work closely with our marketing team to execute strategies and track performance. Strong communication and creative skills are a plus. This role offers hands-on experience in a dynamic agency setting.',
      applyLink: 'https://example.com/apply/marketing-assistant',
      tags: ['Digital Marketing', 'Content Creation', 'Social Media', 'SEO', 'Campaign Management', 'Analytics']
    },
    {
      id: 4,
      title: 'UX Design Workshop Series',
      company: 'Design Institute',
      type: 'learning',
      location: 'Los Angeles, CA',
      program: 'Design',
      duration: '6 sessions',
      posted: '5 days ago',
      description: 'Hands-on workshops covering user research, prototyping, and design thinking. Learn to create intuitive and user-friendly interfaces. This series is perfect for anyone interested in understanding the principles of good design and applying them to digital products. You will build a portfolio through practical exercises and receive feedback from industry professionals.',
      applyLink: 'https://example.com/apply/ux-workshop',
      tags: ['Figma', 'User Research', 'Prototyping', 'Design Thinking', 'UI/UX', 'Wireframing']
    },
    {
      id: 5,
      title: 'Business Development Internship',
      company: 'StartupXYZ',
      type: 'internship',
      location: 'Austin, TX',
      program: 'Business Administration',
      duration: '4 months',
      posted: '1 day ago',
      description: 'Work directly with founders to identify new market opportunities. Conduct market research, analyze potential partnerships, and assist in strategic planning. This role offers a unique chance to experience the fast-paced environment of a tech startup and contribute to its growth. You will gain valuable insights into startup operations and business strategy.',
      applyLink: 'https://example.com/apply/biz-dev-internship',
      tags: ['Strategy', 'Market Research', 'Analytics', 'Sales', 'Negotiation', 'Partnerships']
    },
    {
      id: 6,
      title: 'Financial Analyst Training Program',
      company: 'Global Bank',
      type: 'job',
      location: 'Chicago, IL',
      program: 'Finance',
      duration: '2 years',
      posted: '1 week ago',
      description: 'Comprehensive training program for recent finance graduates. Develop expertise in financial modeling, risk analysis, and investment strategies. You will rotate through various departments, gaining broad exposure to the banking industry. This program is designed to fast-track your career in finance with extensive mentorship and real-world projects.',
      applyLink: 'https://example.com/apply/financial-analyst',
      tags: ['Excel', 'Financial Modeling', 'Risk Analysis', 'Investment Banking', 'Accounting', 'Corporate Finance']
    }
  ];

  const timeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 3 Days', value: 'recent' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ];

  const programOptions = [
    { label: 'All Programs', value: 'all' },
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Business Administration', value: 'Business Administration' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Design', value: 'Design' },
    { label: 'Data Science', value: 'Data Science' }
  ];

  const typeOptions = [
    { label: 'All Types', value: 'all', icon: 'trending-up' },
    { label: 'Internship', value: 'internship', icon: 'school' },
    { label: 'Full-time Job', value: 'job', icon: 'briefcase' },
    { label: 'Learning Program', value: 'learning', icon: 'book' }
  ];

  const filteredOpportunities = opportunities.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTime = timeFilter === 'all' ||
      (timeFilter === 'recent' && ['1 day ago', '2 days ago', '3 days ago'].includes(item.posted)) ||
      (timeFilter === 'week' && (item.posted.includes('day') || item.posted.includes('week')) && !item.posted.includes('month')) ||
      (timeFilter === 'month' && (item.posted.includes('day') || item.posted.includes('week') || item.posted.includes('month')));


    const matchesProgram = programFilter === 'all' || item.program === programFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesTime && matchesProgram && matchesType;
  });

  const handleBookmark = (id) => {
    setBookmarkedItems(prevBookmarks => {
      const newBookmarks = new Set(prevBookmarks);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

  const handleShare = (item) => {
    setSelectedOpportunityForShare(item);
    setShowShareSheet(true);
  };

  const handleApply = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const getTypeIcon = (type) => {
    const foundType = typeOptions.find(option => option.value === type);
    return foundType ? foundType.icon : 'trending-up';
  };

  const getTypeName = (type) => {
    const foundType = typeOptions.find(option => option.value === type);
    return foundType ? foundType.label : 'Filters';
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setTimeFilter('all');
    setProgramFilter('all');
    setTypeFilter('all');
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    setTempTimeFilter(timeFilter);
    setTempProgramFilter(programFilter);
    setTempTypeFilter(typeFilter);
    setShowFilterModal(true);
  };

  const applyModalFilters = () => {
    setShowFilterModal(false);
    setIsLoadingFeed(true);

    setTimeout(() => {
      setTimeFilter(tempTimeFilter);
      setProgramFilter(tempProgramFilter);
      setTypeFilter(tempTypeFilter);
      setIsLoadingFeed(false);
    }, 1000);
  };

  const cancelModalFilters = () => {
    setShowFilterModal(false);
  };

  // --- Share Sheet Functions ---
  const copyLinkToClipboard = async () => {
    if (selectedOpportunityForShare) {
      const link = selectedOpportunityForShare.applyLink;
      await Clipboard.setStringAsync(link);
      Alert.alert('Link Copied!', 'The application link has been copied to your clipboard.', [
        { text: 'OK', onPress: () => setShowShareSheet(false) }
      ]);
    }
  };

  const shareViaNativeSheet = async () => {
    if (selectedOpportunityForShare) {
      const shareMessage = `Check out this opportunity: ${selectedOpportunityForShare.title} at ${selectedOpportunityForShare.company}. Apply here: ${selectedOpportunityForShare.applyLink}`;
      try {
        await Sharing.shareAsync(shareMessage, { dialogTitle: 'Share Opportunity' });
        setShowShareSheet(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to share opportunity. Please try again.');
        console.error('Sharing error:', error);
      }
    }
  };

  const shareViaApp = (appName, urlScheme) => {
    if (!selectedOpportunityForShare) return;

    const shareMessage = `Check out this opportunity: ${selectedOpportunityForShare.title} at ${selectedOpportunityForShare.company}. Apply here: ${selectedOpportunityForShare.applyLink}`;
    let url;

    switch (appName) {
      case 'WhatsApp':
        url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'Telegram':
        url = `tg://msg?text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'Instagram':
        Alert.alert('Instagram Sharing', 'Instagram typically requires sharing images or videos. You can copy the link and paste it into Instagram messages.', [
          { text: 'Copy Link', onPress: copyLinkToClipboard },
          { text: 'Cancel', style: 'cancel' }
        ]);
        return;
      default:
        Alert.alert('Unsupported', `Direct sharing to ${appName} is not configured.`);
        return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('App Not Found', `Please install ${appName} to share directly.`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => Alert.alert('Error', `Could not open ${appName}: ${err.message}`))
      .finally(() => setShowShareSheet(false));
  };
  // --- End Share Sheet Functions ---

  // Function to open the full-screen details page
  const openDetailsPage = (item) => {
    setSelectedOpportunity(item);
    setShowDetailsPage(true);
  };

  // Function to close the full-screen details page
  const closeDetailsPage = () => {
    setShowDetailsPage(false);
    setSelectedOpportunity(null); // Clear selected opportunity when closing
  };

  const FilterDropdown = ({ options, value, onChange, placeholder, showIcon = false }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{placeholder}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.dropdownOption,
              value === option.value && styles.dropdownOptionSelected
            ]}
            onPress={() => onChange(option.value)}
          >
            {showIcon && option.icon && (
              <Ionicons
                name={option.icon}
                size={16}
                color={value === option.value ? 'white' : '#374151'}
                style={{ marginRight: 6 }}
              />
            )}
            <Text style={[
              styles.dropdownOptionText,
              value === option.value && styles.dropdownOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const OpportunityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openDetailsPage(item)} // Open details PAGE on card press
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getTypeIcon(item.type)}
              size={24}
              color="#2563eb"
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCompany}>{item.company}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
              <Text style={styles.metaText}>Posted {item.posted}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              bookmarkedItems.has(item.id) && styles.actionButtonBookmarked
            ]}
            onPress={() => handleBookmark(item.id)}
          >
            <Ionicons
              name={bookmarkedItems.has(item.id) ? "bookmark" : "bookmark-outline"}
              size={20}
              color={bookmarkedItems.has(item.id) ? "#eab308" : "#6b7280"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <Ionicons name="share-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={3}>{item.description}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.programTag}>
          <Text style={styles.programTagText}>{item.program}</Text>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.applyLink)}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="open-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Sticky Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, opportunities, locations, programs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
        >
          <Text style={styles.filterButtonText}>
            {typeFilter !== 'all' ? getTypeName(typeFilter) : 'Filters'}
          </Text>
          <Ionicons name="filter" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollableContent}>
        {/* Header - now inside ScrollView */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Discover internships, jobs, skill development & learning opportunities</Text>
        </View>

        {/* This View applies padding to the scrollable content */}
        <View style={styles.innerContentPadding}>
          {/* Results Count */}
          <Text style={styles.resultsCount}>
            Showing {filteredOpportunities.length} opportunities
          </Text>

          {/* Opportunities Feed or Loading Indicator */}
          {isLoadingFeed ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Applying filters...</Text>
            </View>
          ) : filteredOpportunities.length > 0 ? (
            <FlatList
              data={filteredOpportunities}
              renderItem={({ item }) => <OpportunityCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false} // FlatList itself won't scroll, the parent ScrollView will
              showsVerticalScrollIndicator={false}
            />
          ) : (
            // Empty State
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="search" size={32} color="#9ca3af" />
              </View>
              <Text style={styles.emptyStateTitle}>No opportunities found</Text>
              <Text style={styles.emptyStateText}>Try adjusting your search criteria or filters</Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear all filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Advanced Filters Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={cancelModalFilters}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersPanel}>
            <Text style={styles.modalTitle}>Filter Opportunities</Text>
            <FilterDropdown
              options={timeOptions}
              value={tempTimeFilter}
              onChange={setTempTimeFilter}
              placeholder="Time Posted"
            />
            <FilterDropdown
              options={programOptions}
              value={tempProgramFilter}
              onChange={setTempProgramFilter}
              placeholder="Program of Study"
            />
            <FilterDropdown
              options={typeOptions}
              value={tempTypeFilter}
              onChange={setTempTypeFilter}
              placeholder="Type of Opportunity"
              showIcon={true}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelModalFilters}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyModalButton]}
                onPress={applyModalFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showShareSheet}
        onRequestClose={() => setShowShareSheet(false)}
      >
        <View style={styles.shareSheetOverlay}>
          <View style={styles.shareSheetContainer}>
            <Text style={styles.shareSheetTitle}>Share Opportunity</Text>

            {selectedOpportunityForShare && (
              <View style={styles.opportunityShareDetails}>
                <Text style={styles.opportunityShareTitle}>{selectedOpportunityForShare.title}</Text>
                <Text style={styles.opportunityShareCompany}>{selectedOpportunityForShare.company}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.shareOptionButton} onPress={copyLinkToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#374151" />
              <Text style={styles.shareOptionText}>Copy Link</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' || Platform.OS === 'android' ? (
              <TouchableOpacity style={styles.shareOptionButton} onPress={shareViaNativeSheet}>
                <Ionicons name="share-social-outline" size={24} color="#374151" />
                <Text style={styles.shareOptionText}>Share via...</Text>
              </TouchableOpacity>
            ) : null}

            <Text style={styles.shareOptionsLabel}>Share directly on:</Text>
            <View style={styles.socialShareOptions}>
              <TouchableOpacity style={styles.socialShareButton} onPress={() => shareViaApp('WhatsApp', 'whatsapp://')}>
                <Ionicons name="logo-whatsapp" size={30} color="#25D366" />
                <Text style={styles.socialShareText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialShareButton} onPress={() => shareViaApp('Telegram', 'tg://')}>
                <Ionicons name="send" size={30} color="#0088CC" />
                <Text style={styles.socialShareText}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialShareButton} onPress={() => shareViaApp('Instagram', 'instagram://')}>
                <Ionicons name="logo-instagram" size={30} color="#E1306C" />
                <Text style={styles.socialShareText}>Instagram</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.shareSheetCancelButton} onPress={() => setShowShareSheet(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Full-screen Opportunity Details Page Modal */}
      <Modal
        animationType="slide"
        transparent={false} // Make it opaque to cover the whole screen
        visible={showDetailsPage} // Use the new state variable
        onRequestClose={closeDetailsPage} // Use the new close function
      >
        {selectedOpportunity && (
          <SafeAreaView style={styles.fullScreenModalContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            {/* Custom Header for the Details Page */}
            <View style={styles.fullScreenModalHeader}>
              <TouchableOpacity onPress={closeDetailsPage} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.fullScreenModalTitle} numberOfLines={1}>
                {selectedOpportunity.title}
              </Text>
              {/* Placeholder for potential right-side action (e.g., share) */}
              <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.fullScreenModalContent}>
              <View style={styles.detailsHeaderSection}>
                <View style={styles.detailsIconContainer}>
                  <Ionicons
                    name={getTypeIcon(selectedOpportunity.type)}
                    size={36}
                    color="#2563eb"
                  />
                </View>
                <View style={styles.detailsHeaderTextContent}>
                  <Text style={styles.fullScreenModalCompany}>{selectedOpportunity.company}</Text>
                  <View style={styles.detailsModalMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={16} color="#6b7280" />
                      <Text style={styles.metaText}>{selectedOpportunity.location}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text style={styles.metaText}>{selectedOpportunity.duration}</Text>
                    </View>
                    <Text style={styles.metaText}>Posted {selectedOpportunity.posted}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.detailsSectionTitle}>Job Description</Text>
              <Text style={styles.detailsDescription}>{selectedOpportunity.description}</Text>

              <Text style={styles.detailsSectionTitle}>Skills & Technologies</Text>
              <View style={styles.tagsContainer}>
                {selectedOpportunity.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.detailsSectionTitle}>Program</Text>
              <View style={styles.programTag}>
                <Text style={styles.programTagText}>{selectedOpportunity.program}</Text>
              </View>
            </ScrollView>

            {/* Sticky Apply Button at the Bottom */}
            <View style={styles.applyButtonStickyContainer}>
              <TouchableOpacity
                style={styles.fullScreenApplyButton}
                onPress={() => {
                  handleApply(selectedOpportunity.applyLink);
                  // Optionally keep the details page open, or close it after applying
                  // closeDetailsPage();
                }}
              >
                <Text style={styles.fullScreenApplyButtonText}>Apply Now</Text>
                <Ionicons name="open-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  scrollableContent: {
    flex: 1,
  },
  innerContentPadding: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 12,
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  filterButtonText: {
    color: '#6b7280',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filtersPanel: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dropdownOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownOptionTextSelected: {
    color: 'white',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  applyModalButton: {
    backgroundColor: '#2563eb',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 10
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  actionButtonBookmarked: {
    backgroundColor: '#fef3c7',
  },
  cardDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16, // Reduced for details page, but kept for main feed card
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  programTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    backgroundColor: '#f3f4f6',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFiltersText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  // --- Share Sheet Styles ---
  shareSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  shareSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  shareSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
    textAlign: 'center',
  },
  opportunityShareDetails: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  opportunityShareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  opportunityShareCompany: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  shareOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  shareOptionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
  },
  shareOptionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 20,
    marginBottom: 10,
  },
  socialShareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialShareButton: {
    alignItems: 'center',
    padding: 10,
  },
  socialShareText: {
    fontSize: 12,
    marginTop: 5,
    color: '#374151',
  },
  shareSheetCancelButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  // --- End Share Sheet Styles ---

  // --- Full-screen Opportunity Details Page Styles ---
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb', // Background for the "page"
  },
  fullScreenModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60, // Standard header height
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Adjust to bring icon closer to edge
  },
  fullScreenModalTitle: {
    flex: 1, // Allows title to take up available space
    fontSize: 19,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 10, // Spacing from back button
  },
  fullScreenModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100, // Space for the sticky apply button
  },
  detailsHeaderSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailsIconContainer: {
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsHeaderTextContent: {
    flex: 1,
  },
  fullScreenModalCompany: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailsModalMeta: { // Reused from previous modal, consider renaming for clarity if only used here
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
  },
  detailsSectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    marginTop: 20,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 10,
  },
  applyButtonStickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8, // Higher elevation for sticky button
    paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Adjust for iPhone X bottom safe area
  },
  fullScreenApplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 10,
  },
  fullScreenApplyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  // Reusing existing tag styles
});

export default CareerHub;