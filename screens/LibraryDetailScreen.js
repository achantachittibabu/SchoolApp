import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, TextInput, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const LibraryDetailScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [libraryData, setLibraryData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookname, setBookname] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    if (route.params?.libraryData) {
      const data = route.params.libraryData;
      setLibraryData(data);
      setBookname(data.bookname || '');
      setAuthor(data.author || '');
      setIsbn(data.isbn || '');
      setStatus(data.status || '');
      setQuantity(data.quantity || '');
    }
  }, [route.params]);

  const isAdmin = user && user.userType === 'admin';

  const handleEdit = () => setIsEditMode(true);
  const handleCancel = () => {
    setIsEditMode(false);
    if (libraryData) {
      setBookname(libraryData.bookname || '');
      setAuthor(libraryData.author || '');
      setIsbn(libraryData.isbn || '');
      setStatus(libraryData.status || '');
      setQuantity(libraryData.quantity || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = { libraryid: libraryData.libraryid, bookname, author, isbn, status, quantity };
      const response = await axios.put(`http://localhost:5000/api/library/${libraryData.libraryid}`, updatedData);
      if (response.status === 200) {
        Alert.alert('Success', 'Book updated');
        setLibraryData(updatedData);
        setIsEditMode(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setLoading(true);
        try {
          await axios.delete(`http://localhost:5000/api/library/${libraryData.libraryid}`);
          Alert.alert('Success', 'Deleted');
          navigation.goBack();
        } catch (error) {
          Alert.alert('Error', 'Failed');
        } finally {
          setLoading(false);
        }
      }},
    ]);
  };

  if (!libraryData) return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>No Data</Title>
          <Button onPress={() => navigation.goBack()}>Back</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title>Book Details</Title>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.actionButtonsContainer}>
            {isAdmin && !isEditMode && (
              <>
                <Button mode="contained" onPress={handleEdit} style={styles.editButton} icon="pencil">Edit</Button>
                <Button mode="contained" onPress={handleDelete} style={styles.deleteButton} icon="trash-can">Delete</Button>
              </>
            )}
            {isEditMode && (
              <>
                <Button mode="contained" onPress={handleSave} style={styles.saveButton} loading={loading} icon="check">Save</Button>
                <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton} icon="close">Cancel</Button>
              </>
            )}
          </View>
          <Divider style={styles.divider} />
          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Book Name</Text>
              <TextInput style={styles.input} value={bookname} onChangeText={setBookname} editable={isEditMode} mode="outlined" />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Author</Text>
              <TextInput style={styles.input} value={author} onChangeText={setAuthor} editable={isEditMode} mode="outlined" />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ISBN</Text>
              <TextInput style={styles.input} value={isbn} onChangeText={setIsbn} editable={isEditMode} mode="outlined" />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Status</Text>
              <TextInput style={styles.input} value={status} onChangeText={setStatus} editable={isEditMode} mode="outlined" />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} editable={isEditMode} mode="outlined" keyboardType="numeric" />
            </View>
            <View style={styles.modeIndicator}>
              <Icon name={isEditMode ? 'pencil-outline' : 'eye-outline'} size={16} color={isEditMode ? '#FF9800' : '#2196F3'} />
              <Text style={styles.modeText}>{isEditMode ? 'Edit Mode' : 'View Mode'}</Text>
            </View>
          </View>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton} icon="arrow-left">Back</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { marginBottom: 16 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { marginVertical: 16 },
  actionButtonsContainer: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  editButton: { backgroundColor: '#2196F3' },
  deleteButton: { backgroundColor: '#F44336' },
  saveButton: { backgroundColor: '#4CAF50', flex: 1, minWidth: 100 },
  cancelButton: { flex: 1, minWidth: 100 },
  formContainer: { marginVertical: 16 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: { backgroundColor: '#fff' },
  modeIndicator: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#F5F5F5', borderRadius: 6, marginVertical: 16, borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  modeText: { fontSize: 12, color: '#666', fontWeight: '500', marginLeft: 8 },
  backButton: { marginTop: 16 },
});

export default LibraryDetailScreen;
