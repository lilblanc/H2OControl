import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { getAuth } from 'firebase/auth';
import {useRouter} from 'expo-router';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    const sensorID = data;

    try {
      const sensorRef = doc(firestore, 'sensores', sensorID);
      const sensorSnap = await getDoc(sensorRef);

      if (!sensorSnap.exists()) {
        Alert.alert('Erro', 'Sensor não encontrado.');
        return;
      }

      const sensorData = sensorSnap.data();
      if (sensorData.usuario) {
        Alert.alert('Aviso', 'Este sensor já está vinculado a outro usuário.');
        return;
      }

      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      // Vincula o sensor ao usuário
      await updateDoc(sensorRef, {
        usuario: user.uid,
        status: true, // ou "vinculado: true"
      });

      Alert.alert('Sucesso', 'Sensor vinculado com sucesso!');

      // Aqui você pode redirecionar para a tela de cadastro do aquário
      router.push({
        pathname: "/(tabs)/barra-navegacao/Tela_Monitoramento/add-aquario",
        params: { sensorID: sensorID },
      });
            

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao validar o sensor.');
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Escanear novamente'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
