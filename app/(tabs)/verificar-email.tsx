import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, applyActionCode } from "firebase/auth";
import { useRouter } from "expo-router";

export default function VerificarEmailScreen() {
  const [codigo, setCodigo] = useState("");
  const auth = getAuth();
  const router = useRouter();

  const handleVerificarCodigo = async () => {
    try {
      await applyActionCode(auth, codigo);
      Alert.alert("Sucesso", "E-mail verificado com sucesso!");

      router.push("/login");
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      Alert.alert("Erro", "Código de verificação inválido ou expirado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de Verificação"
        value={codigo}
        onChangeText={setCodigo}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerificarCodigo}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 47,
    },
title:{
    fontSize: 24,
    marginBottom: 30,
    fontFamily: "Poppins_Bold",
    },
input: {
    width: "100%",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "Poppins_Regular",
    },
button: {
    backgroundColor: "#222",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    },
buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_Bold",
    },   
});
