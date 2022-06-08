import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react/cjs/react.development";
import connect, { sql } from "@databases/expo";
import Diagnosis from "./src/pages/Diagnosis";
import Home from "./src/pages/Home";

const Stack = createNativeStackNavigator();
const db = connect("dermascan");

export default function App() {
  db.tx(function* (tx) {
    yield tx.query(sql`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        disease TEXT NOT NULL,
        description TEXT NOT NULL,
        article TEXT NOT NULL,
        date INTEGER NOT NULL
      );
    `);
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DiagnosisPeriksa"
          component={Diagnosis}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DiagnosisHome"
          component={Diagnosis}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen name="Home" component={Home} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
