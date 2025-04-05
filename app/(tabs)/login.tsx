import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "../firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";


export default function LoginScreen() {
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado:", userCredential.user.email);
      router.push("/home");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao logar:", error.message);
        Alert.alert(
          "Não foi possível entrar",
          "Verifique se o e-mail e a senha estão corretos e tente novamente."
        );
      } else {
        console.error("Erro desconhecido ao logar:", error);
        Alert.alert(
          "Erro inesperado",
          "Ocorreu um erro ao tentar entrar na sua conta. Por favor, tente novamente mais tarde."
        );
      }
    }    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seja bem-vindo!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconContainer}>
          <Ionicons name={secureText ? "eye-off" : "eye"} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Ou faça login com:</Text>

      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="logo-google" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="logo-facebook" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="logo-twitter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.registerText}>Não possui uma conta?</Text>
      <TouchableOpacity onPress={() => router.push("/cadastrar")}>
        <Text style={styles.registerLink}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 47,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins_Regular",
  },
  iconContainer: {
    padding: 10,
  },
  title: {
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
  forgotPassword: {
    alignSelf: "flex-end",
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
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
  orText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  icon: {
    backgroundColor: "#f0f0f0",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins_Regular",
  },
  registerLink: {
    fontFamily: "Poppins_Bold",
  },
});
