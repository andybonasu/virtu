// screens/auth/LoginScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import useUserStore from '../../store/userStore';

const LoginScreen = ({ navigation }) => {
  const { setUser, setToken } = useUserStore();
  const [errorMsg, setErrorMsg] = React.useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(4).required('Required'),
  });

  const handleLogin = async (values) => {
    try {
      const response = await api.post('/auth/login', values);
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      // Redirect based on role
      if (user.role === 'trainer') {
        navigation.replace('TrainerHome');
      } else if (user.role === 'client') {
        navigation.replace('ClientHome');
      } else if (user.role === 'admin') {
        navigation.replace('AdminHome');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed';
      setErrorMsg(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtu Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="Email"
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
              error={touched.email && errors.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              style={styles.input}
              error={touched.password && errors.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Login
            </Button>
          </>
        )}
      </Formik>

      <Snackbar visible={!!errorMsg} onDismiss={() => setErrorMsg('')} duration={3000}>
        {errorMsg}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  error: { color: 'red', fontSize: 12, marginBottom: 10 },
});
