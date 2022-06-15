import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faCircle } from "@fortawesome/free-solid-svg-icons";
import connect, { sql } from "@databases/expo";
import * as WebBrowser from "expo-web-browser";
import BottomNavigator from "../components/BottomNavigator";
import tw2 from "../../tw2";

const FormattedDate = ({ timestamp }) => {
  const dateObj = new Date(timestamp);
  const dateString = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  return <Text style={tw2`text-abu`}>{dateString}</Text>;
};

const db = connect("dermascan");

const showDeleteAlert = (id, navigate) =>
  Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus riwayat ini?", [
    {
      text: "Cancel",
    },
    {
      text: "OK",
      onPress: function () {
        db.tx(function* (tx) {
          const res = yield tx.query(sql`
                DELETE FROM history WHERE id=${id};
              `);
          if (res) {
            navigate("Home");
          }
        });
      },
    },
  ]);

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
          style={[{ padding: 20 }, tw2`flex w-full flex-row justify-between`]}
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
        <View style={[styles.card, tw2`border-2 border-hijau`]}>
          <View style={tw2`flex flex-row w-full justify-between`}>
            <Text style={tw2`text-sm text-hijau`}>Hasil</Text>
            <FormattedDate timestamp={data.timestamp} />
          </View>
          <Text style={tw2`text-2xl font-bold mt-1`}>{data.nama}</Text>
          <Text style={tw2`text-sm text-hijau mt-8`}>Deskripsi</Text>
          <Text style={tw2`mt-1`}>{data.deskripsi}</Text>
          <Text style={tw2`text-sm text-hijau mt-8`}>Artikel Terkait</Text>
          {data.artikel ? (
            data.artikel.map((item, index) => (
              <TouchableHighlight
                key={index}
                underlayColor={false}
                onPress={() => {
                  WebBrowser.openBrowserAsync(item);
                }}
                style={tw2`mt-1`}
              >
                <View style={tw2`flex flex-row items-center`}>
                  <FontAwesomeIcon
                    icon={faCircle}
                    style={tw2`mx-1`}
                    size={10}
                  />
                  <Text style={tw2`text-biru mx-1`}>Artikel {index + 1}</Text>
                </View>
              </TouchableHighlight>
            ))
          ) : (
            <></>
          )}
        </View>
        <View
          style={[
            tw2`flex flex-row items-center justify-center mb-3`,
            { width: "90%" },
          ]}
        >
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={false}
            onPress={() => {
              showDeleteAlert(data.id, props.navigation.navigate);
            }}
            style={tw2`font-bold rounded-xl px-2 py-1 bg-red-500 border-2 border-red-700 self-start`}
          >
            <Text style={tw2`text-white text-xs`}>Hapus riwayat ini</Text>
          </TouchableHighlight>
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
