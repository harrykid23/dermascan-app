import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
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
      onPress={() => {
        if (data && data.artikel) {
          navigation.navigate("DiagnosisHome", {
            data: { ...data, artikel: data.artikel.split(",") },
          });
        }
      }}
      style={[styles.card, tw2`border-2 border-hijau`]}
    >
      <>
        <View style={[styles.cardLeftContent]}>
          <Text style={tw2`text-xs font-bold text-hijau`}>Kondisi Terbaru</Text>
          {data.nama ? (
            <>
              <Text style={[styles.textBold, tw2`text-lg`]}>{data.nama}</Text>

              <FormattedDate timestamp={data.timestamp} />
            </>
          ) : (
            <Text style={tw2`text-abu text-sm`}>
              Anda belum pernah periksa. Klik tombol kamera untuk memulai.
            </Text>
          )}
        </View>
        <View style={styles.cardRightContent}>
          <Image
            style={tw2`absolute right-2 bottom-1`}
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
    justifyContent: "space-between",
    padding: 10,
  },
  textBold: {
    fontWeight: "bold",
  },
  cardLeftContent: {
    display: "flex",
    flexDirection: "column",
    width: "55%",
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
