import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UserNotRegisteredError() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <Text style={styles.title}>Acceso restringido</Text>
        <Text style={styles.message}>
          No estás registrado para usar esta aplicación. Contacta con el
          administrador para solicitar acceso.
        </Text>
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Si crees que es un error:</Text>
          <Text style={styles.tip}>• Comprueba que has iniciado sesión con la cuenta correcta</Text>
          <Text style={styles.tip}>• Contacta con el administrador para obtener acceso</Text>
          <Text style={styles.tip}>• Prueba a cerrar sesión y volver a entrar</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffedd5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
  },
  tips: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
  },
  tipsTitle: { fontSize: 14, color: "#475569", marginBottom: 8 },
  tip: { fontSize: 13, color: "#64748b", marginBottom: 4 },
});
