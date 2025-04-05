import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // Escolha o tipo de animação
        presentation: "card", // Apresentação como um card animado
        gestureEnabled: true,
        headerShown:false 
      }}
    />

  );
}
