import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ClientListScreen() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch('http://localhost:3000/api/trainer/clients', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          console.warn('⚠️ Unexpected client list shape');
          setClients([]);
        }
      })
      .catch((err) => console.error('Client list fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.client.name}</Text>
      <Text style={styles.email}>{item.client.email}</Text>
      <Text style={styles.course}>📘 {item.course_title}</Text>
      <Text style={item.is_paid ? styles.paid : styles.unpaid}>
        {item.is_paid ? '✅ Paid' : '❌ Not Paid'}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('CourseEditor', {
              assignedCourseId: item.assigned_course_id,
              baseCourseId: item.base_course_id,
              clientId: item.client.id,
            })
          }
        >
          <Text style={styles.actionText}>View Course</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Message</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👥 Your Clients</Text>
      {loading ? (
        <ActivityIndicator color="#6C5CE7" size="large" />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.client.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B1F',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1A1533',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  course: {
    fontSize: 16,
    marginTop: 6,
    color: '#E0E0E0',
  },
  paid: {
    color: '#00E676',
    fontWeight: '600',
    marginTop: 4,
  },
  unpaid: {
    color: '#FFAB00',
    fontWeight: '600',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
