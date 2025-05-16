import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
      console.log('✅ Login result:', data);

      // Decode and store token
      const decoded = jwtDecode(data.token);
      console.log('🔍 Decoded token:', JSON.stringify(decoded, null, 2));
      localStorage.setItem('authToken', data.token);
      console.log('💾 Token stored');

      // Redirect ALL users to shared Home Page
      navigation.replace('HomePage');

    } catch (err) {
      console.error('🚨 Fetch error:', err);
      alert('Login failed: Network error or server not running.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 12, borderRadius: 5 },
});
