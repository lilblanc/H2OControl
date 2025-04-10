// import React, { useEffect, useState } from "react";
// import { Text, View, StyleSheet, Alert } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import { useNavigation } from "@react-navigation/native";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// export default function QRCodeScannerScreen() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const navigation = useNavigation();
//   const db = getFirestore();

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = async ({ type, data }) => {
//     setScanned(true);

//     const sensorId = data.trim();
//     const sensorRef = doc(db, "sensors", sensorId);
//     const sensorSnap = await getDoc(sensorRef);

//     if (!sensorSnap.exists()) {
//       Alert.alert("QR Code inválido", "Este sensor não está registrado.");
//       setScanned(false);
//       return;
//     }

//     const sensorData = sensorSnap.data();
//     if (sensorData.associado) {
//       Alert.alert("Sensor já utilizado", "Este sensor já está vinculado a um aquário.");
//       setScanned(false);
//       return;
//     }

//     // Sensor válido e disponível, vamos para a tela de cadastro
//     navigation.navigate("CadastroAquario", { sensorId });
//   };

//   if (hasPermission === null) return <Text>Solicitando permissão da câmera...</Text>;
//   if (hasPermission === false) return <Text>Permissão negada. Habilite a câmera nas configurações.</Text>;

//   return (
//     <View style={{ flex: 1 }}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={{ flex: 1 }}
//       />
//       {scanned && (
//         <Text
//           style={styles.reescan}
//           onPress={() => setScanned(false)}
//         >
//           Tocar para escanear novamente
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   reescan: {
//     backgroundColor: "#000",
//     color: "#fff",
//     padding: 15,
//     textAlign: "center",
//     fontSize: 16
//   }
// });
