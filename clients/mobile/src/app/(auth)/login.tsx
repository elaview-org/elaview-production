import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SocialIconBar } from "@/components/features/SocialIconBar";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    // Clear previous errors
    setError("");

    // Validate input
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await login(email.trim(), password);

      // After successful login, navigate to role selection
      // The user will choose whether to use advertiser or owner features
      router.replace("/(auth)/role-select");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#0088FF", "transparent"]}
        style={styles.gradientBlur}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header */}
      <Text style={styles.logo}>ELAVIEW</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login here</Text>
        <Text style={styles.subtitle}>
          Welcome back you've{"\n"}been missed!
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

        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Create new account</Text>
          </TouchableOpacity>
        </Link>

        {/* Social Login */}
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.socialContainer}>
          <SocialIconBar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradientBlur: {
    position: "absolute",
    top: -100,
    left: -50,
    width: width * 1.5,
    height: height * 0.35,
    opacity: 0.4,
  },
  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 1,
    marginTop: 60,
    marginLeft: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#0088FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#0088FF",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  orText: {
    color: "#0088FF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  socialContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  socialIcon: {
    fontSize: 20,
    color: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
});
