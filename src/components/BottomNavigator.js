import { useNavigationState } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Network from "expo-network";
import connect, { sql } from "@databases/expo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClockRotateLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import tw2 from "../../tw2";
// import { useEffect, useState } from "react/cjs/react.production.min";
import { useEffect, useState } from "react";

const predictPhoto = async (result) => {
  const network = await Network.getNetworkStateAsync();
  if (network.isInternetReachable) {
    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("image", { uri: localUri, name: filename, type });

    const res1 = await fetch(
      "https://dermascan-backend2.azurewebsites.net/predict",
      {
        method: "POST",
        body: formData,
        header: {
          "content-type": "multipart/form-data",
        },
      }
    );
    const res = await res1.json();
    if (res) {
      res.timestamp = new Date().getTime();

      const db = connect("dermascan");
      db.tx(function* (tx) {
        yield tx.query(sql`
          INSERT INTO history (disease, description, article, date)
          VALUES (${
            res.nama
          }, ${res.deskripsi}, ${res.artikel.join(",")}, ${res.timestamp});
        `);
        const res2 = yield tx.query(sql`
        SELECT id, disease as nama, description as deskripsi, article as artikel, date as timestamp FROM history ORDER BY date DESC LIMIT 1;
      `);
        res.id = res2[0].id;
      });
    }
    return res;
  } else {
    return {};
  }
};

const openGallery = async (navigation, setLoading) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({});

  if (!result.cancelled) {
    setLoading(true);
    const prediction = await predictPhoto(result);
    setLoading(false);

    if (prediction && prediction.id) {
      navigation.navigate("DiagnosisPeriksa", { data: prediction });
    } else {
      ToastAndroid.show(
        "Jaringan tidak stabil, silakan coba kembali",
        ToastAndroid.LONG
      );
    }
  }
};

const openCamera = async (navigation, setLoading) => {
  let permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    ToastAndroid.show("Mohon izinkan akses kamera", ToastAndroid.LONG);
  } else {
    let result = await ImagePicker.launchCameraAsync({});

    if (!result.cancelled) {
      setLoading(true);
      const prediction = await predictPhoto(result);
      setLoading(false);

      if (prediction && prediction.id) {
        navigation.navigate("DiagnosisPeriksa", { data: prediction });
      } else {
        ToastAndroid.show(
          "Jaringan tidak stabil, silakan coba kembali",
          ToastAndroid.LONG
        );
      }
    }
  }
};

export default function BottomNavigator({ navigation }) {
  const [navStateString, setNavStateString] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navState = useNavigationState((state) => state);
  useEffect(() => {
    if (navState) {
      const currentPageIndex = navState.index;
      const currentPageString = navState.routes[currentPageIndex].name;
      setNavStateString(currentPageString);
    }
  }, [navState]);

  const rules = {
    riwayat: ["Home", "DiagnosisHome"],
    periksa: ["DiagnosisPeriksa"],
  };
  return (
    <View
      style={{
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <View style={tw2`p-4 flex flex-row items-center justify-center`}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate("Home")}
          style={tw2`p-3 flex flex-col items-center justify-center`}
        >
          <>
            <View
              style={tw2`rounded-xl px-3 py-1 ${
                rules.riwayat.includes(navStateString) ? "bg-hijau" : ""
              }`}
            >
              <FontAwesomeIcon
                color={
                  rules.riwayat.includes(navStateString) ? "white" : "grey"
                }
                size={20}
                icon={faClockRotateLeft}
              />
            </View>

            <Text
              style={tw2`${
                rules.riwayat.includes(navStateString)
                  ? "text-black"
                  : "text-abu"
              }`}
            >
              Riwayat
            </Text>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => {
            setActive(true);
          }}
          style={tw2`p-3 flex flex-col items-center justify-center`}
        >
          <>
            <View
              style={tw2`rounded-xl px-3 py-1 ${
                rules.periksa.includes(navStateString) ? "bg-hijau" : ""
              }`}
            >
              <FontAwesomeIcon
                color={
                  rules.periksa.includes(navStateString) ? "white" : "grey"
                }
                size={20}
                icon={faCamera}
              />
            </View>
            <Text
              style={tw2`${
                rules.periksa.includes(navStateString)
                  ? "text-black"
                  : "text-abu"
              }`}
            >
              Periksa
            </Text>
          </>
        </TouchableHighlight>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={active}
        onRequestClose={() => {
          setActive(false);
        }}
      >
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={false}
          onPress={() => setActive(false)}
          style={tw2`w-full px-10 bg-black bg-opacity-50 h-full flex items-center justify-center`}
        >
          <View style={tw2`w-full flex-col bg-white rounded-lg`}>
            <TouchableHighlight
              onPress={() => {
                setActive(false);
                openCamera(navigation, setLoading);
              }}
              underlayColor="#DDDDDD"
              style={tw2`p-5 rounded-lg`}
            >
              <Text>Ambil gambar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                setActive(false);
                openGallery(navigation, setLoading);
              }}
              underlayColor="#DDDDDD"
              style={tw2`p-5 rounded-lg`}
            >
              <Text>Pilih dari galeri</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={loading}>
        <View
          style={tw2`w-full px-10 bg-biru-muda h-full flex items-center justify-center`}
        >
          <View style={tw2`w-full flex-col rounded-lg`}>
            <ActivityIndicator size={80} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
