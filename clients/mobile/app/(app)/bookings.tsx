import { View, Text, StyleSheet } from 'react-native';

export default function Bookings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
});