import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';


export default function CourseEditorScreen({ route }) {
  const { assignedCourseId } = route.params;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFormVisible, setAddFormVisible] = useState({});
  const [newBlockText, setNewBlockText] = useState('');
  const [newBlockMedia, setNewBlockMedia] = useState('');
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [editBlockText, setEditBlockText] = useState('');
  const [editBlockMedia, setEditBlockMedia] = useState('');
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!assignedCourseId || !token) return;
    setLoading(true);

    fetch(`http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (sectionData) => {
        const enriched = await Promise.all(
          sectionData.map(async (section) => {
            const res = await fetch(`http://localhost:3000/api/sections/${section.id}/blocks`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const blocks = await res.json();
            return { ...section, blocks };
          })
        );
        setSections(enriched);
      })
      .catch((err) => {
        console.error('❌ Failed to load:', err);
        setSections([]);
      })
      .finally(() => setLoading(false));
  }, [assignedCourseId]);

  const deleteSection = async (sectionId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/sections/${sectionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
      } else {
        Alert.alert('Failed to delete section');
      }
    } catch (err) {
      console.error('❌ Error deleting section:', err);
    }
  };

  const createSection = async () => {
   if (!newSectionTitle.trim()) {
      Alert.alert('Missing input', 'Please enter section title');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
       body: JSON.stringify({
          title: newSectionTitle.trim(),
        }),
      });

      if (res.ok) {
        const newSection = await res.json();
        newSection.blocks = [];
        setSections((prev) => [...prev, newSection]);
        setShowSectionForm(false);
        setNewSectionTitle('');
      } else {
        Alert.alert('Failed to create section');
      }
    } catch (err) {
      console.error('❌ Section create error:', err);
    }
  };

const updateSection = async (sectionId) => {
  if (!editSectionTitle.trim() || !editSectionPosition) {
    Alert.alert('Missing input', 'Please enter title and position');
    return;
  }

  try {
    // Locally prepare new order
    const updatedList = [...sections]
      .map((s) =>
        s.id === sectionId
          ? { ...s, title: editSectionTitle.trim(), position: parseInt(editSectionPosition) }
          : s
      )
      .sort((a, b) => a.position - b.position)
      .map((s, index) => ({
        id: s.id,
        position: index + 1, // Recalculate clean positions
      }));

    // Call reorder API
    const reorderRes = await fetch(
      `http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections/reorder`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updatedList }),
      }
    );

    if (!reorderRes.ok) {
      Alert.alert('Failed to reorder sections');
      return;
    }

    // Then reload the updated list
    const refreshedRes = await fetch(`http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedSections = await refreshedRes.json();

    const enriched = await Promise.all(
      updatedSections.map(async (section) => {
        const res = await fetch(`http://localhost:3000/api/sections/${section.id}/blocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blocks = await res.json();
        return { ...section, blocks };
      })
    );

    setSections(enriched);
    setEditingSectionId(null);
    setEditSectionTitle('');
    setEditSectionPosition('');
  } catch (err) {
    console.error('❌ Reorder/update section error:', err);
    Alert.alert('Error', 'Failed to update and reorder sections');
  }
};




  const deleteBlock = async (blockId, sectionId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/blocks/${blockId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) } : s
          )
        );
      }
    } catch (err) {
      console.error('❌ Error deleting block:', err);
    }
  };

  const addBlock = async (sectionId) => {
    if (!newBlockText.trim()) {
      Alert.alert('Missing text', 'Please enter block text');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/sections/${sectionId}/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text_content: newBlockText.trim(),
          media_url: newBlockMedia.trim() || null,
        }),
      });

      if (res.ok) {
        const newBlock = await res.json();
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s
          )
        );
        setNewBlockText('');
        setNewBlockMedia('');
        setAddFormVisible((prev) => ({ ...prev, [sectionId]: false }));
      } else {
        Alert.alert('Failed to add block');
      }
    } catch (err) {
      console.error('❌ Add block error:', err);
    }
  };


const handleReorder = async (reordered) => {
  setSections(reordered);

  const body = reordered.map((item, index) => ({
    id: item.id,
    position: index + 1,
  }));

  try {
    const res = await fetch(`http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order: body }),
    });

    if (!res.ok) {
      Alert.alert('Failed to save new order');
    }
  } catch (err) {
    console.error('❌ handleReorder error:', err);
    Alert.alert('Error', 'Failed to reorder sections');
  }
};

const moveSectionUp = (index) => {
  if (index === 0) return;
  const reordered = [...sections];
  [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
  saveNewSectionOrder(reordered);
};

const moveSectionDown = (index) => {
  if (index === sections.length - 1) return;
  const reordered = [...sections];
  [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
  saveNewSectionOrder(reordered);
};

const saveNewSectionOrder = async (reordered) => {
  const payload = reordered.map((item, idx) => ({
    id: item.id,
    position: idx + 1,
  }));
  setSections(reordered.map((item, idx) => ({ ...item, position: idx + 1 })));

  try {
    const res = await fetch(
      `http://localhost:3000/api/assignedCourses/${assignedCourseId}/sections/reorder`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: payload }),
      }
    );
    if (!res.ok) {
      Alert.alert('Failed to reorder sections');
    }
  } catch (err) {
    console.error('❌ Error reordering:', err);
  }
};

const sortedSections = [...sections].sort((a, b) => a.position - b.position);

return loading ? (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#6C5CE7" />
  </View>
) : (
  <View style={styles.container}>
    <Text style={styles.heading}>📘 Course Sections</Text>

  <ScrollView>
  {sortedSections.map((section, index) => (
      <View key={section.id} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          {/* Reorder Buttons */}
          <View style={styles.reorderActions}>
           <Pressable onPress={() => moveSectionUp(index)} disabled={editingSectionId !== null || index === 0}>
              <Text style={styles.reorderText}>↑</Text>
            </Pressable>
           <Pressable onPress={() => moveSectionDown(index)} disabled={editingSectionId !== null || index === sections.length - 1}>
              <Text style={styles.reorderText}>↓</Text>
            </Pressable>
          </View>

          {/* Title + Edit/Delete */}
          {editingSectionId === section.id ? (
            <>
              <TextInput
                style={styles.input}
                value={editSectionTitle}
                onChangeText={setEditSectionTitle}
                placeholder="Edit Title"
                placeholderTextColor="#888"
              />
              <Pressable style={styles.saveBtn} onPress={() => updateSection(section.id)}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
              <Pressable onPress={() => setEditingSectionId(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>• {section.title}</Text>
              <View style={styles.sectionActions}>
                <Pressable
                  onPress={() => {
                    setEditingSectionId(section.id);
                    setEditSectionTitle(section.title);
                  }}
                >
                  <Text style={styles.editText}>✏️</Text>
                </Pressable>
                <Pressable onPress={() => deleteSection(section.id)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* BLOCKS */}
        {section.blocks.map((block) => (
          <View key={block.id} style={styles.block}>
            {editingBlockId === block.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editBlockText}
                  onChangeText={setEditBlockText}
                  placeholder="Text content"
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={styles.input}
                  value={editBlockMedia}
                  onChangeText={setEditBlockMedia}
                  placeholder="Media URL (optional)"
                  placeholderTextColor="#888"
                />
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.saveBtn}
                    onPress={() => updateBlock(block.id, section.id)}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setEditingBlockId(null)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {block.text_content && (
                  <Text style={styles.blockType}>📝 {block.text_content}</Text>
                )}
                {block.media_url && (
                  <Text style={styles.blockMedia}>🎬 {block.media_url}</Text>
                )}
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.editBtn}
                    onPress={() => {
                      setEditingBlockId(block.id);
                      setEditBlockText(block.text_content || '');
                      setEditBlockMedia(block.media_url || '');
                    }}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteBlock(block.id, section.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        ))}

        {/* Add Block Form */}
        {addFormVisible[section.id] ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Text content"
              value={newBlockText}
              onChangeText={setNewBlockText}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Media URL (optional)"
              value={newBlockMedia}
              onChangeText={setNewBlockMedia}
              placeholderTextColor="#888"
            />
            <View style={styles.buttonRow}>
              <Pressable style={styles.saveBtn} onPress={() => addBlock(section.id)}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
              <Pressable
                style={styles.cancelBtn}
                onPress={() =>
                  setAddFormVisible((prev) => ({ ...prev, [section.id]: false }))
                }
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.addBtn}
            onPress={() =>
              setAddFormVisible((prev) => ({ ...prev, [section.id]: true }))
            }
          >
            <Text style={styles.addText}>➕ Add Block</Text>
          </Pressable>
        )}
      </View>
    ))}
</ScrollView>



    {sections.length < 7 && (
      <>
        {showSectionForm ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Section Title"
              value={newSectionTitle}
              onChangeText={setNewSectionTitle}
              placeholderTextColor="#888"
            />
            <View style={styles.buttonRow}>
              <Pressable style={styles.saveBtn} onPress={createSection}>
                <Text style={styles.saveText}>Create Section</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setShowSectionForm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable style={styles.addBtn} onPress={() => setShowSectionForm(true)}>
            <Text style={styles.addText}>➕ Add Section</Text>
          </Pressable>
        )}
      </>
    )}
  </View>
);


}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0B1F', padding: 20 },
  centered: { flex: 1, backgroundColor: '#0E0B1F', justifyContent: 'center', alignItems: 'center' },
  heading: {
    fontSize: 22, fontWeight: '700', color: '#6C5CE7', textAlign: 'center', marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#1A1533', padding: 16, borderRadius: 10, marginBottom: 16,
  },
  sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
  gap: 8,
},
  sectionTitle: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '600',
  },
  block: {
    backgroundColor: '#26203f', borderRadius: 6, padding: 10, marginTop: 8,
  },
  blockType: { color: '#E0E0E0', fontSize: 14 },
  blockMedia: { color: '#6C5CE7', fontSize: 13, marginTop: 6 },
  deleteButton: { padding: 8 },
  deleteText: { color: '#FF6B6B', fontWeight: '600' },
  form: { marginTop: 12, backgroundColor: '#1F1B34', padding: 10, borderRadius: 8 },
  input: {
    backgroundColor: '#2C2842', borderRadius: 6, padding: 10, color: '#FFF', marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#6C5CE7', padding: 8, borderRadius: 6,
  },
  saveText: { color: '#FFF', fontWeight: '600' },
  cancelBtn: { padding: 8 },
  cancelText: { color: '#FF6B6B' },
  addBtn: {
    marginTop: 10, backgroundColor: '#372C69', padding: 8, borderRadius: 6, alignItems: 'center',
  },
  addText: { color: '#BB86FC', fontWeight: '600' },
  editBtn: {
    padding: 8, backgroundColor: '#2c365d', borderRadius: 6, marginRight: 8,
  },
  editText: { color: '#FFD166', fontWeight: '600' },
  sectionActions: { flexDirection: 'row', alignItems: 'center',gap: 8,},
  reorderIcon: {fontSize: 20,color: '#888',marginRight: 10,},
  dragHandleContainer: {paddingRight: 10,paddingLeft: 4,justifyContent: 'center',alignItems: 'center',},
  reorderActions: {
  flexDirection: 'row',
  gap: 4,
  alignItems: 'center',
  marginRight: 10,
},
reorderText: {
  fontSize: 20,
  color: '#6C5CE7',
  paddingHorizontal: 6,
},
});
