// EditarPerfil.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore } from "../../../firebase/config.js";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const storage = getStorage();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = getAuth().currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(firestore, "usuarios", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setNome(data.nome || "");
//           setProfileImage(data.profileImage || null);
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       setProfileImage(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const storageRef = ref(storage, `images/${getAuth().currentUser.uid}`);
//     await uploadBytes(storageRef, blob);
//     return await getDownloadURL(storageRef);
//   };

//   const handleSave = async () => {
//     const user = getAuth().currentUser;
//     if (!user) {
//       Alert.alert("Erro", "Usuário não autenticado!");
//       return;
//     }

//     setIsUploading(true);
//     try {
//       let imageUrl = profileImage;
      
//       // Se a imagem foi alterada (não é uma URL já existente)
//       if (profileImage && profileImage.startsWith('file:')) {
//         imageUrl = await uploadImage(profileImage);
//       }

//       await updateDoc(doc(firestore, "usuarios", user.uid), {
//         nome,
//         profileImage: imageUrl,
//       });
      
//       Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
//     } catch (err) {
//       console.error("Erro ao atualizar:", err);
//       Alert.alert("Erro", "Não foi possível salvar as alterações.");
//     }
//     setIsUploading(false);
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Perfil</Text>
      
      {/* <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={
            profileImage 
              ? { uri: profileImage } 
              : require("../assets/placeholder.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Text style={styles.cameraText}>+</Text>
        </View>
      </TouchableOpacity> */}

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