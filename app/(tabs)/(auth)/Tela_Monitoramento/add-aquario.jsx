import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Dimensions} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from '../../../firebase/config'; 
import { Alert } from "react-native";
const { width } = Dimensions.get("window");

export default function AdicionarAquario() {
  const router = useRouter();
  const [altura, setAltura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [nome, setNome] = useState("");
  const [dataLimpeza, setDataLimpeza] = useState("");
  const [temperaturaMinima, setTemperaturaMinima] = useState(0);
  const [temperaturaMaxima, setTemperaturaMaxima] = useState(100);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { sensorID } = useLocalSearchParams();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  let [fontsLoaded] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleAdicionarAquario = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
  
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
  
    if (!nome || !altura || !largura || !comprimento || !selectedDate) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }
  
    try {
      const novoAquario = {
        nome,
        altura: Number(altura),
        largura: Number(largura),
        comprimento: Number(comprimento),
        tempMinima: Number(temperaturaMinima),
        tempMaxima: Number(temperaturaMaxima),
        ultimaLimpeza: selectedDate,
        usuarioID: user.uid,
        sensorID: sensorID,
      };
  
      await addDoc(collection(firestore, "aquarios"), novoAquario);
  
      Alert.alert("Sucesso", "Aquário adicionado com sucesso!");
      router.replace("/(tabs)/(auth)/Tela_Inicial/home");
    } catch (error) {
      console.error("Erro ao salvar aquário:", error);
      Alert.alert("Erro", "Não foi possível adicionar o aquário.");
    }
  };


  const handleCancelarCadastro = () => {
    Alert.alert(
      "Cancelar cadastro",
      "Deseja mesmo cancelar? Os dados não serão salvos.",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const sensorRef = doc(firestore, "sensores", sensorID);
              await updateDoc(sensorRef, {
                usuario: null,
              });
              router.replace("/(tabs)/(auth)/Tela_Inicial/home");
            } catch (error) {
              console.error("Erro ao desvincular usuário do sensor:", error);
              Alert.alert("Erro", "Não foi possível cancelar corretamente.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <LinearGradient colors={['#00455A', '#004256', '#004E5E', '#005C69', '#006B71', '#007177']} style={styles.container}>
    
      <View style={styles.header}>
        <Text style={styles.headerText}>Adicionar aquário</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancelarCadastro}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

      </View>
      {sensorID && (
        <Text style={[styles.sectionTitle, { color: "#4D92A6" }]}>
          {/* Sensor vinculado com sucesso! */}
        </Text>
      )}


      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Insira os dados do seu aquário:</Text>


        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="Altura"
            placeholderTextColor="#fff"
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Comprimento"
            placeholderTextColor="#fff"
            value={comprimento}
            onChangeText={setComprimento}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Largura"
            placeholderTextColor="#fff"
            value={largura}
            onChangeText={setLargura}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.inputHint}>Medidas em cm</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do aquário"
          placeholderTextColor="#fff"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Data da última limpeza</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.inputSmall}>
          <Text style={{ color: selectedDate ? '#fff' : '#fff', fontFamily: 'Poppins_Regular', fontSize: 11 }}>
            {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecione a data'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          value={dataLimpeza}
          locale="pt-BR"
          maximumDate={new Date()} 
        />
        <Text style={styles.inputHint}>
          Insira a data da última limpeza para lembretes periódicos
        </Text>

        <Text style={styles.label}>Temperatura mínima</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="0-100° C"
            placeholderTextColor="#fff"
            value={temperaturaMinima}
            onChangeText={setTemperaturaMinima}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.tempHint}>
          Você será alertado caso a temperatura diminua além desse valor
        </Text>

        <Text style={styles.label}>Temperatura máxima</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="0-100° C"
            placeholderTextColor="#fff"
            value={temperaturaMaxima}
            onChangeText={setTemperaturaMaxima}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.tempHint}>
          A ventoinha será ativada caso a temperatura exceda esse valor
        </Text>

     
        <TouchableOpacity style={styles.button} onPress={(handleAdicionarAquario)}   >
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 51,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    position: "relative",
  },
  headerText: {
    fontFamily: "Poppins_Bold",
    fontSize: 20,
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 18,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    flex: 1,
    justifyContent: "space-evenly",
  },
  sectionTitle: {
    fontFamily: "Poppins_Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    color: "#fff",
    fontFamily: "Poppins_Regular",
  },
  inputSmall: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: "Poppins_Regular",
    color: "#fff",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: "Poppins_Regular",
    fontSize: 13,
    color: "#fff",
    marginTop: 10,
  },
  inputHint: {
    fontSize: 11,
    fontFamily: "Poppins_Regular",
    color: "#fff",
    marginTop: 5,
    marginBottom: 15,
    textAlign: "left",
  },
  label: {
    fontFamily: "Poppins_Regular",
    fontSize: 13,
    marginTop: 25,
    color: "#fff",
  },
  button: {
    marginTop: 30,
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_Bold",
  },
  tempHint:{
    color: "#fff",
    fontFamily: "Poppins_Regular",
    fontSize: 11,
  },
});
