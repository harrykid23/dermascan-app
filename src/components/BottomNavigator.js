import { useNavigationState } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import connect, { sql } from "@databases/expo";
import { useEffect, useState } from "react/cjs/react.development";
import tw from "twrnc";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClockRotateLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import tw2 from "../../tw2";

const predictPhoto = async (result) => {
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
  res.timestamp = new Date().getTime();
  // console.log(res);

  // const res = {
  //   id: "1",
  //   nama: "Acne and Rosacea",
  //   deskripsi:
  //     "Jika Anda memiliki jerawat maupun Rosasea, pertama pastikan apakah yang anda alami merupakan jerawat atau Rosasea. Perbedaannya terletak pada letak kemerahannya, jerawat hanya memerah di bagian benjolan, sementara Rosasea tidah hanya di bagian benjolan. Kemudian Rosasea tidak selalu terdapat benjolan dan tidak memiliki komedo. Jika anda sudah mengetahui yang anda alami maka lakukan penanganan dengan olesi obat untuk mengurangi kemerahan untuk Rosasea, atau obat turunan vitamin A untuk jerawat. Selain itu, minum Antibiotik minum untuk Rosasea. Jika gejala yang anda rasakan semakin parah, ataupun anda mengalami gejala Rosasea pada mata, maka pastikan anda mengunjungi dokter.",
  //   artikel: [
  //     "https://hellosehat.com/penyakit-kulit/kulit-lainnya/perbedaan-rosacea-dan-jerawat/",
  //     "https://health.grid.id/read/352899419/penyakit-kulit-rosacea-ada-4-jenis-ini-perbedaannya-dengan-jerawat?page=all",
  //     "https://www.alodokter.com/rosacea",
  //   ],
  //   timestamp: new Date().getTime(),
  // };

  const db = connect("dermascan");
  db.tx(function* (tx) {
    yield tx.query(sql`
          INSERT INTO history (disease, description, article, date)
          VALUES (${
            res.nama
          }, ${res.deskripsi}, ${res.artikel.join(",")}, ${res.timestamp});
        `);
  });

  return res;
};

const openGallery = async (navigation) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({});

  if (!result.cancelled) {
    const prediction = await predictPhoto(result);
    // console.log(prediction);
    navigation.navigate("DiagnosisPeriksa", { data: prediction });
  }
};

const openCamera = async (navigation) => {
  let permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    ToastAndroid.show("Mohon izinkan akses kamera", ToastAndroid.LONG);
  } else {
    let result = await ImagePicker.launchCameraAsync({});

    if (!result.cancelled) {
      const prediction = await predictPhoto(result);
      // console.log(prediction);

      navigation.navigate("DiagnosisPeriksa", { data: prediction });
    }
  }
};

export default function BottomNavigator({ navigation }) {
  const [navStateString, setNavStateString] = useState("");
  const [active, setActive] = useState(false);
  const navState = useNavigationState((state) => state);
  useEffect(() => {
    if (navState) {
      const currentPageIndex = navState.index;
      const currentPageString = navState.routes[currentPageIndex].name;
      setNavStateString(currentPageString);
      // console.log(currentPageString);
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
      <View style={tw`p-4 flex flex-row items-center justify-center`}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate("Home")}
          style={tw`p-3 flex flex-col items-center justify-center`}
        >
          <>
            <View
              style={[
                tw`rounded-xl px-3 py-1`,
                tw2`${
                  rules.riwayat.includes(navStateString) ? "bg-hijau" : ""
                }`,
              ]}
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
          style={tw`p-3 flex flex-col items-center justify-center`}
        >
          <>
            <View
              style={[
                tw`rounded-xl px-3 py-1`,
                tw2`${
                  rules.periksa.includes(navStateString) ? "bg-hijau" : ""
                }`,
              ]}
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
          underlayColor={false}
          onPress={() => setActive(false)}
          style={tw2`w-full px-10 bg-black bg-opacity-50 h-full flex items-center justify-center`}
        >
          <View style={tw2`w-full flex-col bg-white rounded-lg`}>
            <TouchableHighlight
              onPress={() => {
                setActive(false);
                openCamera(navigation);
              }}
              underlayColor="#DDDDDD"
              style={tw2`p-5 rounded-lg`}
            >
              <Text>Ambil gambar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                setActive(false);
                openGallery(navigation);
              }}
              underlayColor="#DDDDDD"
              style={tw2`p-5 rounded-lg`}
            >
              <Text>Pilih dari galeri</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
