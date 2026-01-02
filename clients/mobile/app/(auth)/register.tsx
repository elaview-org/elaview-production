import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: Wire up .NET auth later
    // For now, navigate to role selection
    router.replace('/(auth)/role-select');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#0088FF', 'transparent']}
        style={styles.gradientBlur}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header */}
      <Text style={styles.logo}>ELAVIEW</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Create an account so you can explore all the{'\n'}existing jobs
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Already have an account</Text>
          </TouchableOpacity>
        </Link>

        {/* Social Login */}
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientBlur: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width * 1.5,
    height: height * 0.35,
    opacity: 0.4,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
    marginTop: 60,
    marginLeft: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0088FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  orText: {
    color: '#0088FF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  socialIcon: {
    fontSize: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});