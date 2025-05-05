import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/config";
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get("window");

type Aquario = {
  id: string;
  sensorID: string;
  nome: string;
  altura: number;
  comprimento: number;
  largura: number;
  temperaturaMaxima: number;
  temperaturaMinima: number;
};

type SensorData = {
  distancia: number;
  temperatura: number;
};

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [aquario, setAquario] = useState<Aquario | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const router = useRouter();
  const handleEdit = () => {
    router.push('//barra-navegacao/Tela_Monitoramento/EditarAquario'); // ou passe o ID do aquário se necessário
  };

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (user) {
        const usuarioRef = doc(firestore, "usuarios", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          setNomeUsuario(usuarioSnap.data().nome || "");

          const aquariosQuery = query(
            collection(firestore, "aquarios"),
            where("usuarioID", "==", user.uid)
          );
          const querySnapshot = await getDocs(aquariosQuery);

          if (!querySnapshot.empty) {
            const aquarioData = querySnapshot.docs[0].data();
            const aquarioID = querySnapshot.docs[0].id;

            const novoAquario: Aquario = {
              id: aquarioID,
              sensorID: aquarioData.sensorID,
              nome: aquarioData.nome,
              altura: aquarioData.altura,
              comprimento: aquarioData.comprimento,
              largura: aquarioData.largura,
              temperaturaMaxima: aquarioData.temperaturaMaxima,
              temperaturaMinima: aquarioData.temperaturaMinima,
            };

            setAquario(novoAquario);

            const sensorRef = doc(firestore, "sensores", aquarioData.sensorID);
            onSnapshot(sensorRef, (sensorSnap) => {
              if (sensorSnap.exists()) {
                setSensorData(sensorSnap.data() as SensorData);
              }
            });
          } else {
            setAquario(null);
          }
        }
      }

      setLoading(false);
    };

    carregarDados();
  }, []);

  const calcularNivelPorcentagem = () => {
    if (!aquario || !sensorData) return "0";
    const alturaReal = aquario.altura;
    const alturaAtual = sensorData.distancia;
    const nivel = 100 - Math.min(100, Math.max(0, (alturaAtual / alturaReal) * 100));
    return nivel.toFixed(0);
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#76C8B2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {nomeUsuario}</Text>
      </View>

      {!aquario ? (
        <View style={styles.content}>
          <Image source={require("@/assets/images/semAquario.png")} style={styles.image} />
          <Text style={styles.title}>
            <Text style={styles.boldText}>Ops.</Text>{" "}
            <Text style={styles.highlightText}>Não há nenhum aquário cadastrado</Text>
          </Text>
          <Text style={styles.description}>Comece adicionando o aquário que deseja monitorar</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/barra-navegacao/Tela_Monitoramento/ScannerQRCode")}
          >
            <LinearGradient
              colors={["#76C8B2", "#4D92A6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Adicionar aquário</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.aquarioNome}>{aquario.nome}</Text>
          <Text style={styles.aquarioSub}>Temperatura atual:</Text>
          <Text style={styles.dado}>{sensorData?.temperatura ?? "--"}°C</Text>
          <Text style={styles.aquarioSub}>Nível da água:</Text>
          <Text style={styles.dado}>{calcularNivelPorcentagem()}%</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleEdit}/>
        
      </View>


          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={() => router.push({ pathname: "/(tabs)/barra-navegacao/Tela_Monitoramento/editarAquario", params: { aquarioID: aquario.id, 
              nome: aquario.nome,
              altura: String(aquario.altura),
              largura: String(aquario.largura),
              comprimento: String(aquario.comprimento),
              temperaturaMaxima: String(aquario.temperaturaMaxima),
              temperaturaMinima: String(aquario.temperaturaMinima),} })}
          >
            <LinearGradient
              colors={["#76C8B2", "#4D92A6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Editar aquário</Text>
            </LinearGradient>
          </TouchableOpacity>


        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("@/assets/images/inicio-icone-ativado.png")} style={styles.navIcon} />
          <Text style={styles.navTextActive}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/barra-navegacao/Tela_estatisticas/estatisticas")}
        >
          <Image source={require("@/assets/images/estatisticas-icone-desativado.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Estatísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/barra-navegacao/Tela_perfil/perfil")}
        >
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
    backgroundColor: "#f8f9fb",
    paddingVertical: 15,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: "Poppins_Bold",
    color: "#000",
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
  buttonEdit: {
    width: width * 0.6,
    borderRadius: 30,
    overflow: "hidden",
    position: "absolute",
    bottom: 20,
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
  aquarioNome: {
    fontSize: 22,
    fontFamily: "Poppins_Bold",
    color: "#051D3F",
    marginBottom: 10,
  },
  aquarioSub: {
    fontSize: 16,
    fontFamily: "Poppins_Regular",
    color: "#777",
  },
  dado: {
    fontSize: 32,
    fontFamily: "Poppins_Bold",
    color: "#4D92A6",
    marginBottom: 20,
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