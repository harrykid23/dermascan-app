import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import tw2 from "../../tw2";

const FormattedDate = ({ timestamp }) => {
  const dateObj = new Date(timestamp);
  const dateString = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  return <Text style={tw2`text-abu`}>{dateString}</Text>;
};

export default function Card({ navigation, data }) {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => navigation.navigate("DiagnosisHome", { data: data })}
      style={styles.card}
    >
      <>
        <View style={styles.cardLeftContent}>
          <Text style={[styles.textBold, tw`text-lg`]}>{data.nama}</Text>
          <FormattedDate timestamp={data.timestamp} />
        </View>
        <View style={styles.cardRightContent}>
          <FontAwesomeIcon style={tw2`text-hijau`} icon={faAngleRight} />
        </View>
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  textBold: {
    fontWeight: "bold",
  },
  cardLeftContent: {
    display: "flex",
    flexDirection: "column",
    width: "85%",
  },
  cardRightContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
});
