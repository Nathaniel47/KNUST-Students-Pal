import { View, StyleSheet } from "react-native";

const Pagination = ({ selected }) => {
  const items = [0, 1, 2];
  return (
    <View style={style.container}>
      {items.map((item) => {
        return (
          <View
            key={item}
            style={[
              style.box,
              { backgroundColor: selected === item ? "#00BF63" : "#c7c3c3" },
            ]}
          ></View>
        );
      })}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    width: "100%",
  },
  box: {
    height: 10,
    width: 10,
    borderRadius: "100%",
    margin: 5,
  },
});

export { Pagination };
