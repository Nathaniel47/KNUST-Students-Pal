import { View, Text, StyleSheet } from "react-native";
import QuestionSvg from "../assets/svg/question.svg";
import RemainderSvg from "../assets/svg/remainder2.svg";
import ScheduleSvg from "../assets/svg/schedule.svg";

const GreenText = ({ children }) => {
  return <Text style={styles.greenText}>{children}</Text>;
};

const QuestionPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Ask Any</Text>
      <GreenText>Campus Info</GreenText>
      <QuestionSvg width="250" height="300" />

      <Text style={styles.text}>
        Get instant answers about campus life, updates, scholarships, and more.
        Your personal student assistant is here to help!
      </Text>
    </View>
  );
};
const SchedulePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Schedule your</Text>
      <GreenText>Task And Assignments</GreenText>
      <ScheduleSvg width="250" height="300" />

      <Text style={styles.text}>
        Plan your day effortlessly! Organize your tasks, set priorities, and
        stay on top of your schedule with ease.
      </Text>
    </View>
  );
};

const RemainderPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Set Personal</Text>
      <GreenText>Reminders</GreenText>
      <RemainderSvg width="250" height="300" />

      <Text style={styles.text}>
        Never miss a deadline! Get timely reminders for assignments, events, and
        important tasks to keep you on track.
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  titleText: {
    fontSize: 35,
    textTransform: "capitalize",
  },

  greenText: {
    color: "#00BF63",
    fontSize: 30,
    marginBottom: 30,
    textTransform: "capitalize",
  },
  svg: {
    marginBottom: 20,
  },
});

export { QuestionPage, SchedulePage, RemainderPage };
