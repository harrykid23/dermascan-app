import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import tw from "twrnc";
import tw2 from "../../tw2";

const FormattedDate = ({ timestamp }) => {
  const dateObj = new Date(timestamp);
  const dateString = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  return <Text style={tw2`text-abu`}>{dateString}</Text>;
};

export default function CardMain({ navigation, data }) {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => navigation.navigate("DiagnosisHome", { data: data })}
      style={[styles.card, tw`border-2`, tw2`border-hijau`]}
    >
      <>
        <View style={[styles.cardLeftContent]}>
          <Text style={[tw`text-xs font-bold`, tw2`text-hijau`]}>
            Kondisi Terbaru
          </Text>
          <Text style={[styles.textBold, tw`text-lg`]}>{data.nama}</Text>
          <FormattedDate timestamp={data.timestamp} />
        </View>
        <View style={styles.cardRightContent}>
          <Image
            style={tw`absolute right-2 bottom-1`}
            source={require("../assets/health-image.png")}
          />
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
    width: "70%",
  },
  cardRightContent: {
    display: "flex",
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
});
