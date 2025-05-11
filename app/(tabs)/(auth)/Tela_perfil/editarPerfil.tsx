import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { auth, firestore } from "../../../firebase/config"; //  deve ser exportado de config
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    const fetchNome = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "usuarios", user.uid));
          if (userDoc.exists()) {
            setNome(userDoc.data().nome);
          } else if (user.displayName) {
            setNome(user.displayName);
          }
        } catch (error) {
          console.error("Erro ao buscar nome:", error);
        }
      }
    };

    fetchNome();
  }, []);

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    try {
      setIsUploading(true);
      const user = auth.currentUser;

      if (user) {
        // Atualiza o nome no Authentication
        await updateProfile(user, { displayName: nome });

        // Atualiza o nome na coleção "usuarios"
        const userRef = doc(firestore, "usuarios", user.uid);
        await updateDoc(userRef, { nome });

        Alert.alert("Sucesso", "Nome atualizado com sucesso!");
        router.replace("/(tabs)/(auth)/Tela_perfil/perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar o nome:", error);
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#00455A", "#004256", "#004E5E", "#005C69", "#006B71", "#007177"]}
      style={styles.container}
    >
      <Text style={styles.header}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
        placeholderTextColor="#fff"
      />

      <TouchableOpacity
        style={[styles.button, isUploading && styles.disabledButton]}
        onPress={handleSave}
        disabled={isUploading}
      >
        <Text style={styles.buttonText}>
          {isUploading ? "Salvando..." : "Salvar alterações"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#76C8B2",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
