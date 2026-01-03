// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useAuth, useUser } from '@clerk/clerk-expo';

// export default function Profile() {
//   const { signOut } = useAuth();
//   const { user } = useUser();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
//       <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>
//       <TouchableOpacity style={styles.button} onPress={() => signOut()}>
//         <Text style={styles.buttonText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
//   email: { fontSize: 16, color: '#666', marginBottom: 32 },
//   button: { backgroundColor: '#ff4444', padding: 16, borderRadius: 8, alignItems: 'center' },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
// });