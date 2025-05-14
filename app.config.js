export default {
  expo: {
    name: "H2OControl",
    slug: "h2ocontrol",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.joao.h2ocontrol", // certifique-se de que este é o mesmo do Firebase
      googleServicesFile: "./google-services.json", // <- Essencial para notificações push
      adaptiveIcon: {
        foregroundImage: "./assets/images/icone-carregamento.png",
        backgroundColor: "#000000"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-notifications", // <- Necessário para push notifications
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "O aplicativo precisa de acesso à câmera para escanear QR codes."
        }
      ],
      "expo-font",
      "expo-asset",
      "expo-barcode-scanner"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "c22a2263-bf87-49f3-b914-3a8b0dc1b7cc"
      }
    },
    owner: "lilblanc"
  }
};
