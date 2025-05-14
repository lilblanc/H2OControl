import React, { useEffect, useState } from "react";
import {View,Text,TouchableOpacity,Image,StyleSheet,Dimensions,ActivityIndicator, Platform} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/config";
import { Thermometer, Waves } from 'lucide-react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


const { width } = Dimensions.get("window");

type Aquario = {
  id: string;
  sensorID: string;
  nome: string;
  altura: number;
  comprimento: number;
  largura: number;
  tempMaxima: number;
  tempMinima: number;
};

type SensorData = {
  distancia: number;
  temperatura: number;
};



async function salvarTokenNotificacao(token: string) {
  const user = getAuth().currentUser;

  if (!user) {
    console.log('Usuário não autenticado');
    return;
  }

  try {
    await setDoc(
      doc(firestore, 'usuarios', user.uid),
      { pushToken: token },
      { merge: true }
    );
    console.log('Token salvo com sucesso no Firestore!');
  } catch (error) {
    console.error('Erro ao salvar o token no Firestore:', error);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permissão para notificações não foi concedida!');
      return;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();
    token = pushToken.data;
  } else {
    alert('Deve ser usado em um dispositivo físico!');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}


export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [aquario, setAquario] = useState<Aquario | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  const getNivelColor = (nivel: number): string => {
    if (nivel < 40) return "#FF4C4C";     
    if (nivel < 60) return "#FFD700";     
    return "#43BEB6";                     
  };
  

  const auth = getAuth();
  const router = useRouter();


  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
      }
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
              tempMaxima: aquarioData.tempMaxima,
              tempMinima: aquarioData.tempMinima,
            };

            setAquario(novoAquario);
            
            const sensorRef = doc(firestore, "sensores", aquarioData.sensorID);
            onSnapshot(sensorRef, (sensorSnap) => {
              if (sensorSnap.exists()) {
              const dados = setSensorData(sensorSnap.data() as SensorData);
              }
            });
          } else {
            setAquario(null);
          }
        }
      }

      setLoading(false);

      async function setupPushToken() {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await salvarTokenNotificacao(token);
        }
      }
    
      setupPushToken();
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
        <ActivityIndicator size="large" color="#43BEB6" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#00455A', '#004256', '#004E5E', '#005C69', '#006B71', '#007177']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {nomeUsuario}</Text>
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
            onPress={() => router.push("/(tabs)/(auth)/Tela_Monitoramento/ScannerQRCode")}
          >
            <LinearGradient
              colors={["#43BEB6", "#3ABEB7", "#2AB9B5", "#1FB7B6", "#0BADB2", "#08A9B2"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Adicionar aquário</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.aquarioNome}>{aquario.nome}</Text>

              <View style={styles.dadoContainer}>
                <View style={styles.iconeLinha}>
                  <Thermometer size={32} color="#43BEB6" style={{ marginRight: 10 }} />
                  <Text style={styles.aquarioSub}>Temperatura atual:</Text>
                </View>
                <Text style={styles.dado}>{sensorData?.temperatura ?? "--"}°C</Text>
              </View>

              <View style={styles.dadoContainer}>
                <View style={styles.iconeLinha}>
                  <Waves size={32} color="#43BEB6" style={{ marginRight: 10 }} />
                  <Text style={styles.aquarioSub}>Nível da água:</Text>
                </View>
                <AnimatedCircularProgress
                  size={120}
                  width={15}
                  fill={parseFloat(calcularNivelPorcentagem())}
                  tintColor={getNivelColor(parseFloat(calcularNivelPorcentagem()))}
                  backgroundColor="#E0F0F3"
                  lineCap="round"
                >

                  {() => (
                    <Text style={styles.dado}>
                      {calcularNivelPorcentagem()}%
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(auth)/Tela_Monitoramento/editarAquario",
                  params: {
                    aquarioID: aquario.id,
                    nome: aquario.nome,
                    altura: String(aquario.altura),
                    largura: String(aquario.largura),
                    comprimento: String(aquario.comprimento),
                    tempMaxima: String(aquario.tempMaxima),
                    tempMinima: String(aquario.tempMinima),
                  },
                })
              }
            >
              <LinearGradient
                colors={["#43BEB6", "#3ABEB7", "#2AB9B5", "#1FB7B6", "#0BADB2", "#08A9B2"]}
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

        {/* <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/(auth)/Tela_estatisticas/estatisticas")}
        >
          <Image source={require("@/assets/images/estatisticas-icone-desativado.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Estatísticas</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/(auth)/Tela_perfil/perfil")}
        >
          <Image source={require("@/assets/images/perfil-icone-desativado.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: "Poppins_Bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: width/3,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  aquarioNome: {
    fontSize: 20,
    fontFamily: "Poppins_Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  dadoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconeLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aquarioSub: {
    fontSize: 16,
    fontFamily: "Poppins_Regular",
    color: "#fff",
  },
  dado: {
    fontSize: 32,
    fontFamily: "Poppins_Bold",
    color: "#fff",
  },
  buttonEdit: {
    position: "absolute",
    bottom: 30,
    width: "80%",
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
  boldText: {
    fontFamily: "Poppins_Bold",
    color: "#fff",
  },
  highlightText: {
    color: "#43BEB6",
    fontFamily: "Poppins_Bold",
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins_Regular",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    borderRadius: 30,
    overflow: "hidden",
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
    alignSelf: "center",
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