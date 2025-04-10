import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Dimensions} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Adicionar aquário</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Insira os dados do seu aquário:</Text>

        {/* Medidas */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="Altura"
            placeholderTextColor="#999"
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Comprimento"
            placeholderTextColor="#999"
            value={comprimento}
            onChangeText={setComprimento}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Largura"
            placeholderTextColor="#999"
            value={largura}
            onChangeText={setLargura}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.inputHint}>Medidas em cm</Text>

        {/* Nome */}
        <TextInput
          style={styles.input}
          placeholder="Nome do aquário"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        {/* Data de limpeza */}
        <Text style={styles.label}>Data da última limpeza</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text style={{ color: selectedDate ? '#000' : '#999', fontFamily: 'Poppins_Regular' }}>
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
          maximumDate={new Date()} // Impede a seleção de datas futuras
        />
        <Text style={styles.inputHint}>
          Insira a data da última limpeza para lembretes periódicos
        </Text>

        {/* Temperatura mínima */}
        <Text style={styles.label}>Temperatura mínima</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="0-100° C"
            placeholderTextColor="#999"
            value={temperaturaMinima}
            onChangeText={setTemperaturaMinima}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.tempHint}>
          Você será alertado caso a temperatura diminua além desse valor
        </Text>

        {/* Temperatura máxima */}
        <Text style={styles.label}>Temperatura máxima</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputSmall}
            placeholder="0-100° C"
            placeholderTextColor="#999"
            value={temperaturaMaxima}
            onChangeText={setTemperaturaMaxima}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.tempHint}>
          A ventoinha será ativada caso a temperatura exceda esse valor
        </Text>

        {/* Botão */}
        <TouchableOpacity style={styles.button}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 51,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    position: "relative",
  },
  headerText: {
    fontFamily: "Poppins_Bold",
    fontSize: 16,
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
    color: "#051D3F",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  inputSmall: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: "Poppins_Regular",
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
    marginTop: 25,
  },
  inputHint: {
    fontSize: 11,
    fontFamily: "Poppins_Regular",
    color: "#999",
    marginTop: 5,
    marginBottom: 15,
    textAlign: "left",
  },
  label: {
    fontFamily: "Poppins_Regular",
    fontSize: 13,
    marginTop: 25,
    color: "#000",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderHint: {
    fontSize: 11,
    fontFamily: "Poppins_Regular",
    color: "#999",
    marginTop: 5,
    marginBottom: 15,
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
});