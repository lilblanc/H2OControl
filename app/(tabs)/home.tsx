import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem vindo, (nome)</Text>
      </View>
      
      <View style={styles.content}>
        <Image source={require("@/assets/images/sem-aquario.png")} style={styles.image} />

        <Text style={styles.title}>
          <Text style={styles.boldText}>Ops.</Text> <Text style={styles.highlightText}>Não há nenhum aquário cadastrado</Text>
        </Text>

        <Text style={styles.description}>
          Comece adicionando o aquário que deseja monitorar
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/add-aquario") }>
          <LinearGradient colors={["#76C8B2", "#4D92A6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
            <Text style={styles.buttonText}>Adicionar aquário</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("@/assets/images/inicio-icone-ativado.png")} style={styles.navIcon} />
          <Text style={styles.navTextActive}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/estatisticas") }>
          <Image source={require("@/assets/images/estatisticas-icone-desativado.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Estatísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/perfil") }>
          <Image source={require("@/assets/images/perfil-icone-desativado.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 15,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: "Poppins_Bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#333",
  },
  boldText: {
    fontFamily: "Poppins_Bold",
    color: "#051D3F",
  },
  highlightText: {
    color: "#74C7B7",
    fontFamily: "Poppins_Bold",
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },
  button: {
    width: width * 0.8,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 40,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_Bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    fontFamily: "Poppins_Regular",
    color: "#A1AFC3",
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: "Poppins_Bold",
    color: "#051D3F",
  },
});
