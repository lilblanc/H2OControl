import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");


export default function WelcomeScreen() {
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={["#034264", "#459BB6","#B7E6F6"]} locations={[0, 0.41, 0.64]}  style={styles.container}>
      <Text style={styles.title}>H2OControl</Text>

      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/Tela_Cadastro/cadastrar")}>
        <Text style={styles.buttonText}>CADASTRE-SE</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>Já é usuário?</Text>

      <TouchableOpacity onPress={() => router.replace("/Tela_Login/login")}>
        <Text style={styles.loginLink}>Faça Login</Text>
      </TouchableOpacity>
    </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    textShadowColor: "rgba(0, 0, 0, 0.25)", 
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 4, 
    fontSize: 48,
    fontFamily: "Poppins_Bold",
    color: "#D0FFB7",
    marginBottom: 79,
  },
  logo: {
    width: 402,
    height: 320,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4581A5",
    paddingVertical: 15,
    width: width * 0.8,
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins_Bold",
  },
  loginText: {
    textShadowColor: "rgba(0, 0, 0, 0.25)", 
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 4, 
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins_Regular",
    marginTop: 20,
  },
  loginLink: {
    textShadowColor: "rgba(0, 0, 0, 0.25)", 
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 4, 
    fontSize: 16,
    fontFamily: "Poppins_Bold",
    color: "#000",
    marginTop: 5,
  },
});
