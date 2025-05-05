import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";

const { width } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const isEmailValid = (email:string):boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    if (!isEmailValid(email)) {
      Alert.alert("Email inválido", "Insira um email válido para continuar.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setModalVisible(true);
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
      <Text style={styles.title}>
        Recuperar <Text style={styles.titleHighlight}>senha</Text>
      </Text>
      <Text style={styles.subtitle}>
        Insira o seu email abaixo para receber as{"\n"}
        <Text style={styles.subtitleBold}>
          instruções de recuperação de senha
        </Text>
      </Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#5B5F73" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#5ec2b1" />
            <Text style={styles.modalTitle}>Email enviado!</Text>
            <Text style={styles.modalMessage}>
              Enviamos um link de recuperação para o seu email.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.replace("/(tabs)/Tela_Login/login"); 
              }}
            >
              <Text style={styles.modalButtonText}>Voltar para o login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: "#f7f8fc",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_Bold",
    color: "#1d2a3a",
  },
  titleHighlight: {
    color: "#74C7B7",
  },
  subtitle: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontFamily: "Poppins_Regular",
  },
  subtitleBold: {
    fontFamily: "Poppins_Bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    width: width * 0.85,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_Regular",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 30,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_Bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Poppins_Bold",
    marginTop: 15,
    color: "#1d2a3a",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: "Poppins_Regular",
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#5ec2b1",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "Poppins_Bold",
    fontSize: 16,
  },
});
