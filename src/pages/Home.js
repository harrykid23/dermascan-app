import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import connect, { sql } from "@databases/expo";
import BottomNavigator from "../components/BottomNavigator";
import Card from "../components/Card";
import CardMain from "../components/CardMain";
import tw2 from "../../tw2";
import { useEffect, useState } from "react/cjs/react.development";

const db = connect("dermascan");

export default function Home(props) {
  const [history, setHistory] = useState([]);
  const navState = useNavigationState((state) => state);
  useEffect(() => {
    if (navState) {
      db.tx(function* (tx) {
        const historyList = yield tx.query(sql`
          SELECT disease as nama, description as deskripsi, article as artikel, date as timestamp FROM history ORDER BY date DESC;
        `);
        setHistory(historyList || []);
      });
    }
  }, [navState]);

  return (
    <View style={[styles.container, tw2`bg-biru-muda`]}>
      <StatusBar style="auto" />
      <Text
        style={{
          fontWeight: "bold",
          color: "white",
          marginBottom: 40,
          fontSize: 20,
        }}
      >
        Riwayat
      </Text>
      <View style={tw`w-full flex flex-col items-center`}>
        <CardMain navigation={props.navigation} data={history[0] || {}} />
        <Text
          style={[tw`font-bold mt-3 mb-1`, { color: "#5787AF", width: "90%" }]}
        >
          Riwayat Kondisi
        </Text>
      </View>
      <ScrollView style={styles.contentWrapper1}>
        <View style={styles.contentWrapper2}>
          {history &&
            history.map((item, index) => (
              <Card key={index} navigation={props.navigation} data={item} />
            ))}

          {/* <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} />
          <Card navigation={props.navigation} /> */}
        </View>
      </ScrollView>
      <View style={{ height: 70, backgroundColor: "white", width: "100%" }}>
        <BottomNavigator navigation={props.navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  contentWrapper1: {
    width: "100%",
    flex: 1,
  },
  contentWrapper2: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
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
