import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

export default function HomePage() {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [assignedCourse, setAssignedCourse] = useState(null);
  const [assignmentChecked, setAssignmentChecked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const decoded = jwtDecode(token);
    setRole(decoded.role);
    setUserId(decoded.id);

    if (decoded.role === 'client') {
      fetch(`http://localhost:3000/api/assignedCourses/client/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setAssignedCourse(data);
          } else {
            setAssignedCourse(null);
          }
        })
        .catch(() => setAssignedCourse(null))
        .finally(() => setAssignmentChecked(true));
    } else {
      setAssignmentChecked(true);
    }
  }, []);

  const renderClientMessage = () => {
    if (!assignedCourse) {
      return (
        <Text style={styles.warning}>
          ⚠️ No course assigned. Please use the course link shared by your trainer or contact support.
        </Text>
      );
    } else if (!assignedCourse.is_paid) {
      return (
        <Text style={styles.warning}>
          ⚠️ Course assigned but not paid. Please follow your trainer’s course link on the website to complete payment.
        </Text>
      );
    } else {
      return (
        <Text style={styles.status}>
          ✅ Access granted to: <Text style={styles.accent}>{assignedCourse.base_course_title}</Text>
        </Text>
      );
    }
  };

  const renderTrainerDashboard = () => (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('CreateBaseCourse')}>
        <Text style={styles.buttonText}>📘 Create Base Course</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('ClientList')}>
        <Text style={styles.buttonText}>👥 Manage Client Courses</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('PublicCourseSubmission')}>
        <Text style={styles.buttonText}>🌐 Submit Public Course</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>🏠 Welcome to Virtu</Text>

      {role && (
        <Text style={styles.role}>
          You are logged in as: <Text style={styles.accent}>{role}</Text>
        </Text>
      )}

      {role === 'client' && assignmentChecked && renderClientMessage()}
      {role === 'trainer' && assignmentChecked && renderTrainerDashboard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B1F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 12,
  },
  role: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: '#00E676',
    textAlign: 'center',
    marginTop: 10,
  },
  warning: {
    fontSize: 16,
    color: '#FFAB00',
    textAlign: 'center',
    marginTop: 10,
  },
  accent: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
