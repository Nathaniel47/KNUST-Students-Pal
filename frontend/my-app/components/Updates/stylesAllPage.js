//   const [id, setId] = useState(null);
  //   const [modalVisible, setModalVisible] = useState(false);
  //   const [refreshing, setRefreshing] = useState(false);
  //   const [imageModalVisible, setImageModalVisible] = useState(false);
  //   const handleOnRefresh = () => {
  //     setRefreshing(true);
  //     setTimeout(() => {
  //       setRefreshing(false);
  //     }, 4000);
  //   };
  //   return (
  //     <View style={styles.container}>
  //       <LinearGradient
  //         colors={[
  //           "rgba(0, 191, 99, 0.08)",
  //           "rgba(0, 191, 99, 0.1)",
  //           "rgba(0, 191, 99, 0.2)",
  //         ]}
  //         start={{ x: 0, y: 0 }}
  //         end={{ x: 0, y: 1 }}
  //         style={{ flex: 1 }}
  //       >
  //         <FlatList
  //           keyExtractor={(item) => item.id}
  //           data={updates}
  //           onRefresh={handleOnRefresh}
  //           refreshing={refreshing}
  //           renderItem={({ item, index }) => (
  //             <Pressable
  //               style={({ pressed }) => ({
  //                 backgroundColor: pressed ? "#f9f9f9" : "#f0f0f0",
  //                 marginVertical: 10,
  //                 overflow: "hidden",
  //                 paddingVertical: 5,
  //                 margin: 20,
  //                 borderRadius: 20,
  //               })}
  //               onPress={() => {
  //                 setId(item.id);
  //                 setModalVisible(true);
  //               }}
  //             >
  //               <View style={styles.itemHeader}>
  //                 <TouchableHighlight
  //                   onPress={() => {
  //                     console.log("pressed");
  //                   }}
  //                 >
  //                   <View style={styles.itemSource}>
  //                     <Ionicons
  //                       name="person-circle-outline"
  //                       size={24}
  //                       style={styles.sourceIcon}
  //                     />
  //                     <Text style={styles.sourceText}>{item.source}</Text>
  //                   </View>
  //                 </TouchableHighlight>
  //                 <TouchableHighlight
  //                   style={[
  //                     styles.tagButton,
  //                     {
  //                       borderBottomColor:
  //                         item.tag === "News"
  //                           ? "red"
  //                           : item.tag === "Events"
  //                           ? "purple"
  //                           : item.tag === "Announcements"
  //                           ? "orange"
  //                           : null,
  //                     },
  //                   ]}
  //                 >
  //                   <Text style={styles.tagText}>{item.tag}</Text>
  //                 </TouchableHighlight>
  //               </View>
  //               <Text style={styles.itemTitle}>{item.title}</Text>
  //               <Image source={item.image} style={styles.itemImage} />
  //               <Text style={styles.itemDescription}>{item.description}</Text>
  //             </Pressable>
  //           )}
  //         />
  //       </LinearGradient>
  //       <Modal
  //         visible={modalVisible}
  //         onDismiss={() => {
  //           setModalVisible(false);
  //         }}
  //         animationType="slide"
  //       >
  //         <View style={styles.modalContainer}>
  //           <View
  //             style={{
  //               position: "absolute",
  //               width: "100%",
  //               top: 0,
  //               left: 0,
  //               right: 0,
  //               zIndex: 10,
  //             }}
  //           >
  //             <LinearGradient
  //               colors={["#222", "#555", "#777", "transparent"]}
  //               start={{ x: 0, y: 0 }}
  //               end={{ x: 0, y: 1 }}
  //               style={{
  //                 opacity: 0.8,
  //                 padding: 10,
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //               }}
  //             >
  //               <Pressable
  //                 style={{
  //                   backgroundColor: "#444",
  //                   borderRadius: 20,
  //                   padding: 5,
  //                 }}
  //                 onPress={() => {
  //                   setModalVisible(false);
  //                 }}
  //               >
  //                 <Ionicons name="chevron-back" size={28} color={"#fff"} />
  //               </Pressable>
  //               <View style={{ flexDirection: "row", gap: 10 }}>
  //                 <Pressable
  //                   style={{
  //                     backgroundColor: "#444",
  //                     borderRadius: 20,
  //                     padding: 5,
  //                   }}
  //                   onPress={() => {
  //                     setImageModalVisible(true);
  //                   }}
  //                 >
  //                   <Ionicons name="image" size={28} color={"#fff"} />
  //                 </Pressable>
  //                 <Pressable
  //                   style={{
  //                     backgroundColor: "#444",
  //                     borderRadius: 20,
  //                     padding: 5,
  //                   }}
  //                 >
  //                   <Ionicons name="ellipsis-vertical" size={28} color={"#fff"} />
  //                 </Pressable>
  //               </View>
  //             </LinearGradient>
  //           </View>
  //           <ScrollView>
  //             {updates
  //               .filter((item) => item.id === id)
  //               .map((feed) => (
  //                 <View key={feed.id} style={styles.feedContainer}>
  //                   <View style={styles.feedImageContainer}>
  //                     <Image source={feed.image} style={styles.feedImage} />
  //                     <View
  //                       style={[
  //                         styles.roundedImageContainer,
  //                         {
  //                           borderColor:
  //                             feed.tag === "News"
  //                               ? "red"
  //                               : feed.tag === "Events"
  //                               ? "purple"
  //                               : feed.tag === "Announcements"
  //                               ? "orange"
  //                               : "blue",
  //                         },
  //                       ]}
  //                     >
  //                       <Image source={feed.image} style={styles.roundedImage} />
  //                     </View>
  //                   </View>
  //                   <View style={styles.feedHeaderContainer}>
  //                     <View style={styles.feedSourceContainer}>
  //                       <Text style={styles.feedSourceText}>{feed.source}</Text>
  //                       <Ionicons
  //                         name="person-circle-outline"
  //                         size={24}
  //                         style={styles.feedSourceIcon}
  //                       />
  //                     </View>
  //                     <Pressable style={styles.feedTagButton}>
  //                       <Text>{feed.tag}</Text>
  //                     </Pressable>
  //                   </View>
  //                   <Text style={styles.feedTitle}>{feed.title}</Text>
  //                   <View style={styles.feedDateContainer}>
  //                     <View style={styles.feedDate}>
  //                       <Ionicons name="time-outline" size={18} />
  //                       <Text>At January 12, 2025</Text>
  //                     </View>
  //                     <View style={styles.feedTime}>
  //                       <Ionicons name="timer-outline" size={18} />
  //                       <Text>11:55:01PM</Text>
  //                     </View>
  //                     <View style={styles.feedSourceLink}>
  //                       <TouchableOpacity>
  //                         <Text style={styles.feedSourceLinkText}>
  //                           @knust.gh.com
  //                         </Text>
  //                       </TouchableOpacity>
  //                     </View>
  //                   </View>
  //                   <View style={styles.feedDescriptionContainer}>
  //                     <Text style={styles.feedDescriptionTitle}>
  //                       {feed.title}
  //                     </Text>
  //                     <Text style={styles.feedDescriptionLabel}>Description</Text>
  //                     <Text>
  //                       Lorem ipsum dolor sit amet consectetur adipisicing elit.
  //                       Ad non ipsam quibusdam fugiat molestiae impedit nihil
  //                       voluptatum, omnis esse quis dolores, ut sint cum dolor,
  //                       enim vero? Fuga quis fugiat, quos soluta ad voluptatem
  //                       ducimus laboriosam nam perspiciatis, quo illo?
  //                     </Text>
  //                     <Image
  //                       source={require("../../assets/img.jpeg")}
  //                       style={styles.feedDescriptionImg}
  //                     />
  //                     <Text>
  //                       Lorem ipsum dolor sit amet consectetur adipisicing elit.
  //                       Optio voluptatibus provident deleniti incidunt porro
  //                       voluptatum molestias commodi quidem facilis eos.
  //                     </Text>
  //                   </View>
  //                   <Modal
  //                     visible={imageModalVisible}
  //                     onDismiss={() => {
  //                       setImageModalVisible(false);
  //                     }}
  //                     backdropColor={"rgba(0,0,0,0.6)"}
  //                     animationType="slide"
  //                   >
  //                     <View
  //                       style={{
  //                         justifyContent: "center",
  //                         alignItems: "center",
  //                         flex: 1,
  //                       }}
  //                     >
  //                       <Pressable
  //                         style={{
  //                           position: "absolute",
  //                           top: 30,
  //                           left: 30,
  //                           backgroundColor: "#333",
  //                           zIndex: 10,
  //                           borderRadius: 30,
  //                           padding: 5,
  //                         }}
  //                         onPress={() => {
  //                           setImageModalVisible(false);
  //                         }}
  //                       >
  //                         <Ionicons name="close" color={"#fff"} size={40} />
  //                       </Pressable>
  //                       <Image
  //                         source={feed.image}
  //                         resizeMode="contain"
  //                         resizeMethod="auto"
  //                         style={{ width: "80%" }}
  //                       />
  //                     </View>
  //                   </Modal>
  //                 </View>
  //               ))}
  //           </ScrollView>
  //         </View>
  //       </Modal>
  //     </View>
  //   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  itemSource: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tagButton: {
    borderBottomWidth: 3,
  },
  tagText: {
    fontWeight: "bold",
  },
  itemTitle: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },

  itemImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  itemDescription: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
  },

  feedImageContainer: {
    maxHeight: 250,
  },

  feedImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },

  roundedImageContainer: {
    position: "relative",
    bottom: 95,
    margin: 10,
    alignSelf: "flex-start",
    borderColor: "blue",
    borderWidth: 4,
    borderRadius: 50,
    overflow: "hidden",
  },

  roundedImage: {
    width: 100,
    height: 100,
  },
  feedHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  feedSourceContainer: {
    marginTop: 30,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  feedTagButton: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    alignSelf: "flex-start",
  },
  feedSourceText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  feedTitle: {
    fontSize: 18,
    paddingLeft: 20,
  },
  feedDateContainer: {
    paddingLeft: 30,
    padding: 10,
  },
  feedDate: {
    flexDirection: "row",
    gap: 5,
    padding: 5,
  },
  feedTime: {
    flexDirection: "row",
    gap: 5,
    padding: 5,
  },
  feedSourceLink: {
    padding: 5,
  },
  feedSourceLinkText: {
    color: "blue",
  },

  feedDescriptionContainer: {
    padding: 20,
    // backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  feedDescriptionImg: {
    width: "100%",
  },
  feedDescriptionLabel: {
    paddingVertical: 10,
    fontSize: 16,
  },
  feedDescriptionTitle: {
    fontSize: 25,
  },
});

export default AllPage;
