import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import BottomNavigator from "../components/BottomNavigator";
import tw2 from "../../tw2";

const FormattedDate = ({ timestamp }) => {
  const dateObj = new Date(timestamp);
  const dateString = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  return <Text style={tw2`text-abu`}>{dateString}</Text>;
};

export default function Diagnosis(props) {
  const data = props.route.params.data;
  return (
    <View
      style={[
        { paddingTop: 40, flex: 1 },
        tw2`items-center justify-start bg-biru-muda`,
      ]}
    >
      <StatusBar style="auto" />
      <ScrollView
        style={tw2`w-full flex-1`}
        contentContainerStyle={tw2`justify-center items-center`}
      >
        <View
          style={[{ padding: 20 }, tw`flex w-full flex-row justify-between`]}
        >
          <TouchableHighlight
            underlayColor={false}
            onPress={() => props.navigation.navigate("Home")}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              style={tw2`text-hijau font-bold`}
            />
          </TouchableHighlight>

          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              marginBottom: 20,
              fontSize: 20,
            }}
          >
            Diagnosis
          </Text>
          <Text></Text>
        </View>
        <View style={[styles.card, tw`border-2`, tw2`border-hijau`]}>
          <View style={tw`flex flex-row w-full justify-between`}>
            <Text style={tw2`text-sm text-hijau`}>Hasil</Text>
            <FormattedDate timestamp={data.timestamp} />
          </View>
          <Text style={tw`text-2xl font-bold mt-1`}>{data.nama}</Text>
          <Text style={tw2`text-sm text-hijau mt-8`}>Deskripsi</Text>
          <Text style={tw2`mt-1`}>{data.deskripsi}</Text>
          {/* <Text style={tw2`text-sm text-hijau mt-8`}>Artikel Terkait</Text>
          <Text style={tw2`mt-1`}>Artikel 1</Text>
          <Text style={tw2`mt-1`}>Artikel 2</Text>
          <Text style={tw2`mt-1`}>Artikel 3</Text> */}
        </View>
      </ScrollView>
      <View style={{ height: 70, backgroundColor: "white", width: "100%" }}>
        <BottomNavigator navigation={props.navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
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
