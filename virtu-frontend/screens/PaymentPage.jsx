import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';

export default function PaymentPage() {
  const [assignedCourse, setAssignedCourse] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const decoded = jwtDecode(token);
    const clientId = decoded.id;

    fetch(`http://localhost:3000/api/assignedCourses/client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAssignedCourse(data);
        return fetch(`http://localhost:3000/api/trainers/${data.trainer_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => res.json())
      .then(setTrainer)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    const res = await fetch(`http://localhost:3000/api/payments/initiate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: decoded.id,
        assigned_course_id: assignedCourse.id,
        amount: 499, // mock price
        method: 'upi',
      }),
    });

    if (res.ok) {
      navigation.replace('ClientCourseDetailPage'); // Placeholder
    } else {
      alert('Payment failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6C5CE7" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💳 Complete Your Purchase</Text>
      <Text style={styles.label}>Course: <Text style={styles.value}>{assignedCourse?.base_course_title}</Text></Text>
      <Text style={styles.label}>Trainer: <Text style={styles.value}>{trainer?.name}</Text></Text>
      <Text style={styles.price}>₹499</Text>

      <Pressable style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0B1F', justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  label: { fontSize: 16, color: '#CCCCCC', marginBottom: 6 },
  value: { color: '#6C5CE7', fontWeight: '600' },
  price: { fontSize: 28, color: '#00CEC9', marginVertical: 30 },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
