// EditarPerfil.js
import React, { useState} from "react";
import { View, Text,TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";


export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [isUploading, setIsUploading] = useState(false);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Perfil</Text>
      
      
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
        placeholderTextColor="#666"
      />

      <TouchableOpacity 
        style={[styles.button, isUploading && styles.disabledButton]} 
        // onPress={handleSave}
        disabled={isUploading}
      >
        <Text style={styles.buttonText}>
          {isUploading ? "Salvando..." : "Salvar alterações"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 20, 
    alignItems: "center" 
  },
  header: { 
    fontSize: 22, 
    fontFamily: "Poppins_Bold", 
    marginVertical: 20 
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 75,
    backgroundColor: '#f0f0f0'
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#1CA7EC",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraText: {
    color: 'white',
    fontSize: 20,
    marginTop: -2
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 15,
    padding: 15,
    fontSize: 16,
    fontFamily: "Poppins_Regular",
  },
  button: {
    width: '100%',
    backgroundColor: "#1CA7EC",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontFamily: "Poppins_SemiBold" 
  },
});