import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      await sendEmailVerification(user);

      Alert.alert(
        "Verificação enviada",
        "Um e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada. Após verificar, retorne ao aplicativo e tente realizar o login."
      );

      router.replace("/Tela_Login/login");
      
      await setDoc(doc(firestore, "usuarios", user.uid), {
        nome: nome,
      });
    }catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#555"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#555"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={styles.policyText}>
        Ao se cadastrar, você concorda com{" "}
        <Text style={styles.policyBold}>Termos de Uso e Política de Privacidade</Text>
      </Text>
      
    
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>Já é usuário?</Text>
      <TouchableOpacity onPress={() => router.replace("/Tela_Login/login")}>
        <Text style={styles.loginLink}>Faça Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    color: "#393939",
    marginBottom: 75,
  },
  input: {
    width: width * 0.85,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 20,
    fontFamily: "Poppins_Regular",
  },
  policyText: {
    fontSize: 16,
    color: "#393939",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Poppins_Regular",
  },
  policyBold: {
    fontFamily: "Poppins_Bold",
  },
  registerButton: {
    backgroundColor: "#393939",
    paddingVertical: 15,
    width: width * 0.85,
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_Bold",
  },
  loginText: {
    fontSize: 16,
    color: "#393939",
    fontFamily: "Poppins_Regular",
  },
  loginLink: {
    fontSize: 16,
    fontFamily: "Poppins_Bold",
    color: "#393939",
  },
});
