import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateBaseCourseScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const handleCreateCourse = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    if (!title.trim()) {
      Alert.alert('Error', 'Course title is required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Course created successfully!');
        navigation.goBack();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.error || 'Creation failed');
      }
    } catch (err) {
      console.error('Creation error:', err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📘 Create a New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Title"
        placeholderTextColor="#AAA"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description (optional)"
        placeholderTextColor="#AAA"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Pressable style={styles.button} onPress={handleCreateCourse}>
        <Text style={styles.buttonText}>Create Course</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B1F',
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    color: '#6C5CE7',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1A1533',
    borderColor: '#6C5CE7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: '#FFF',
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
