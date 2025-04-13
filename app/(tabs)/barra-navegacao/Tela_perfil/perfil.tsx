import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/config.js";
import { useRouter } from "expo-router";
import { FontAwesome, Feather, MaterialIcons, Entypo } from "@expo/vector-icons";

export default function PerfilScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, "usuarios", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNome(data.nome);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configurações de Perfil</Text>

      {/* Seção Conta */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="user-circle-o" size={20} style={styles.icon} />
          <Text style={styles.sectionTitle}>CONTA</Text>
        </View>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => router.replace("../Tela_perfil/editarPerfil")}
        >
          <Text style={styles.option}>Editar perfil</Text>
          <Entypo name="chevron-right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => router.replace("/(tabs)/Tela_Login/recuperar_senha")}
        >
          <Text style={styles.option}>Mudar senha</Text>
          <Entypo name="chevron-right" size={20} />
        </TouchableOpacity>
      </View>

      {/* Seção Notificações */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="bell" size={20} style={styles.icon} />
          <Text style={styles.sectionTitle}>NOTIFICAÇÕES</Text>
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.option}>Permitir notificações?</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Seção Mais */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="dashboard" size={20} style={styles.icon} />
          <Text style={styles.sectionTitle}>MAIS</Text>
        </View>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.option}>Termos de uso</Text>
          <Entypo name="chevron-right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.option}>Sobre</Text>
          <Entypo name="chevron-right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.option}>Ajuda</Text>
          <Entypo name="chevron-right" size={20} />
        </TouchableOpacity>
      </View>

      {/* BottomNav - NÃO ALTERADO */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/barra-navegacao/Tela_Inicial/home")}
        >
          <Image
            source={require("@/assets/images/inicio-icone-desativado.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/barra-navegacao/Tela_estatisticas/estatisticas")}
        >
          <Image
            source={require("@/assets/images/estatisticas-icone-desativado.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Estatísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("@/assets/images/perfil-icone-ativado.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, position: "relative" },
  header: {
    fontSize: 18,
    fontFamily: "Poppins_Bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    color: "#000",
    
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontFamily: "Poppins_Bold",
    fontSize: 14,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  option: {
    fontFamily: "Poppins_Regular",
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 35,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "99%",
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
