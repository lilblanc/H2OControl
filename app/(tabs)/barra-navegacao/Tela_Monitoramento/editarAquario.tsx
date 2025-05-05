import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/config";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

export default function EditarAquario() {
  const router = useRouter();
  const { aquarioID, nome, altura,largura,comprimento,tempMaxima,tempMinima} = useLocalSearchParams();

  const [novoNome, setNovoNome] = useState(nome as string);
  const [novaAltura, setNovaAltura] = useState(altura as string);
  const [novaLargura, setNovaLargura] = useState(largura as string);
  const [novoComprimento, setNovoComprimento] = useState(comprimento as string);
  const [novaTempMaxima, setNovaTempMaxima] = useState(tempMaxima as string);
  const [novaTempMinima, setNovaTempMinima] = useState(tempMinima as string);
  const [loading, setLoading] = useState(false);
 



  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  const handleSalvar = async () => {
 
    setLoading(true);
    try {
      const aquarioRef = doc(firestore, "aquarios", aquarioID as string);
      await updateDoc(aquarioRef, {
        nome: novoNome,
        altura: Number(novaAltura),
        largura: Number(novaLargura),
        comprimento: Number(novoComprimento),
        tempMaxima: Number(novaTempMaxima),
        tempMinima: Number(novaTempMinima),
      });

      Alert.alert("Sucesso", "Aquário atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o aquário.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#76C8B2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Aquário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do aquário"
        value={novoNome}
        onChangeText={setNovoNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Altura (cm)"
        keyboardType="numeric"
        value={novaAltura}
        onChangeText={setNovaAltura}
      />
      <TextInput
        style={styles.input}
        placeholder="Largura (cm)"
        keyboardType="numeric"
        value={novaLargura}
        onChangeText={setNovaLargura}
        />
        <TextInput
        style= {styles.input}
        placeholder="Comprimento (cm)"
        keyboardType="numeric"
        value={novoComprimento}
        onChangeText={setNovoComprimento}
        />
        <TextInput
        style= {styles.input}
        placeholder="Temperatura máxima (°C)"
        keyboardType="numeric"
        value={novaTempMaxima}
        onChangeText={setNovaTempMaxima}
        />

        <TextInput
        style= {styles.input}
        placeholder="Temperatura mínima (°C)"
        keyboardType="numeric"
        value={novaTempMinima}
        onChangeText={setNovaTempMinima}
        />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <LinearGradient
          colors={["#76C8B2", "#4D92A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar alterações"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    marginBottom: 20,
    color: "#051D3F",
  },
  input: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: "Poppins_Regular",
    marginBottom: 15,
    fontSize: 16,
    elevation: 3,
  },
  button: {
    width: width * 0.8,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 10,
  },
  gradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_Bold",
  },
});
