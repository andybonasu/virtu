import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Backend error:', errorData);
        alert(`Login failed: ${errorData.message || res.statusText}`);
        return;
      }

      const data = await res.json();
      const decoded = jwtDecode(data.token);
      localStorage.setItem('authToken', data.token);
      navigation.replace('HomePage');
    } catch (err) {
      console.error('🚨 Fetch error:', err);
      alert('Login failed: Network error or server not running.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Virtu</Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#AAA"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#AAA"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B1F', // deep background
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#6C5CE7', // vibrant purple
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#1A1533', // ✅ DARK always
    color: '#E0E0E0', // light text
    borderColor: '#6C5CE7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
