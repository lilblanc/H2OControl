import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from "../../../firebase/config";

export default function EstatisticasScreen() {
  const [temperaturas, setTemperaturas] = useState<number[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const sensorID = 'sensor1'; // ID do sensor que você deseja consultar
        const leiturasRef = collection(firestore, "sensores", sensorID, 'leituras');
        const q = query(leiturasRef, orderBy('timeStamp', 'desc'), limit(20));
        const snapshot = await getDocs(q);

        const temps: number[] = [];
        const times: string[] = [];

        snapshot.forEach(doc => {
          const data = doc.data();
          console.log('Documento:', doc.id, data); // 👈 Debug opcional

          // Validação segura
          if (
            typeof data.temperatura === 'number' &&
            isFinite(data.temperatura) &&
            data.timeStamp
          ) {
            temps.unshift(data.temperatura);
            const dataFormatada = new Date(
              data.timeStamp.toDate?.() ?? data.timeStamp
            ).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });
            times.unshift(dataFormatada);
          }
        });

        setTemperaturas(temps);
        setHorarios(times);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar leituras:', error);
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const dadosFiltrados = temperaturas
  .map((temp, i) => ({ temp, hora: horarios[i] }))
  .filter(d => typeof d.temp === 'number' && isFinite(d.temp));

  const temperaturasFiltradas = dadosFiltrados.map(d => d.temp);
  const horariosFiltrados = dadosFiltrados.map(d => d.hora);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Variação da Temperatura</Text>
      <LineChart
        data={{
          labels: horariosFiltrados,
          datasets: [{ data: temperaturasFiltradas }]          
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#e0f7fa',
          backgroundGradientTo: '#80deea',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#00796b' }
        }}
        bezier
        style={{ borderRadius: 16, marginVertical: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10
  }
});
