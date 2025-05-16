import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [assignedCourse, setAssignedCourse] = useState(null);
  const [assignmentChecked, setAssignmentChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const decoded = jwtDecode(token);
    console.log('🔍 Decoded token:', decoded);

    setRole(decoded.role);
    setUserId(decoded.id);

    if (decoded.role === 'client') {
      fetch(`http://localhost:3000/api/assignedCourses/client/${decoded.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          console.log('🛰️ AssignedCourse API status:', res.status);

          if (res.ok) {
            const data = await res.json();
            console.log('📦 Assigned course data:', JSON.stringify(data, null, 2));
            setAssignedCourse(data);
          } else {
            console.warn('⚠️ No assigned course or unauthorized.');
            setAssignedCourse(null);
          }
        })
        .catch((err) => {
          console.error('🛑 Fetch error:', err);
        })
        .finally(() => setAssignmentChecked(true));
    } else {
      setAssignmentChecked(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Welcome to Virtu</Text>
      {role && <Text style={styles.subText}>You are logged in as: {role}</Text>}

      {role === 'client' && assignmentChecked && (
        assignedCourse ? (
        <Text style={styles.subText}>
        ✅ You are assigned to course ID: {assignedCourse.base_course_title}
        </Text>
        ) : (
          <Text style={styles.subText}>
            ⚠️ No course assigned. Please go through your trainer’s course link or contact support.
          </Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subText: { fontSize: 18, marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
});
