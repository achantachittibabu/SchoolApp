import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const TimeTableDetailScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [timeTableData, setTimeTableData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState('');
  const [subject, setSubject] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');

  useEffect(() => {
    if (route.params?.userData) {
      setUser(route.params.userData);
    }

    if (route.params?.timeTableData) {
      const data = route.params.timeTableData;
      setTimeTableData(data);
      setDay(data.day || '');
      setSubject(data.subject || '');
      setStarttime(data.starttime || '');
      setEndtime(data.endtime || '');
      setRoom(data.room || '');
      setTeacher(data.teacher || '');
    }
  }, [route.params]);

  const isAdmin = user && user.userType === 'admin';

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (timeTableData) {
      setDay(timeTableData.day || '');
      setSubject(timeTableData.subject || '');
      setStarttime(timeTableData.starttime || '');
      setEndtime(timeTableData.endtime || '');
      setRoom(timeTableData.room || '');
      setTeacher(timeTableData.teacher || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        timetableid: timeTableData.timetableid,
        day,
        subject,
        starttime,
        endtime,
        room,
        teacher,
      };

      const response = await axios.put(
        `http://localhost:5000/api/timetable/${timeTableData.timetableid}`,
        updatedData
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Time table updated successfully');
        setTimeTableData(updatedData);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('handleSave: Error:', error);
      Alert.alert('Error', 'Failed to update time table');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await axios.delete(
              `http://localhost:5000/api/timetable/${timeTableData.timetableid}`
            );
            Alert.alert('Success', 'Time table deleted successfully');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete time table');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (!timeTableData) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>No Data</Title>
            <Button onPress={() => navigation.goBack()}>Go Back</Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title>Time Table Details</Title>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.actionButtonsContainer}>
            {isAdmin && !isEditMode && (
              <>
                <Button mode="contained" onPress={handleEdit} style={styles.editButton} icon="pencil">
                  Edit
                </Button>
                <Button mode="contained" onPress={handleDelete} style={styles.deleteButton} icon="trash-can">
                  Delete
                </Button>
              </>
            )}

            {isEditMode && (
              <>
                <Button mode="contained" onPress={handleSave} style={styles.saveButton} loading={loading} icon="check">
                  Save
                </Button>
                <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton} icon="close">
                  Cancel
                </Button>
              </>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Day</Text>
              <TextInput
                style={styles.input}
                value={day}
                onChangeText={setDay}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                value={starttime}
                onChangeText={setStarttime}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                value={endtime}
                onChangeText={setEndtime}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Room</Text>
              <TextInput
                style={styles.input}
                value={room}
                onChangeText={setRoom}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Teacher</Text>
              <TextInput
                style={styles.input}
                value={teacher}
                onChangeText={setTeacher}
                editable={isEditMode}
                mode="outlined"
              />
            </View>

            <View style={styles.modeIndicator}>
              <Icon
                name={isEditMode ? 'pencil-outline' : 'eye-outline'}
                size={16}
                color={isEditMode ? '#FF9800' : '#2196F3'}
                style={styles.modeIcon}
              />
              <Text style={styles.modeText}>
                {isEditMode ? 'Edit Mode' : 'View Mode'}
              </Text>
            </View>
          </View>

          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton} icon="arrow-left">
            Back
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    minWidth: 100,
  },
  cancelButton: {
    flex: 1,
    minWidth: 100,
  },
  formContainer: {
    marginVertical: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  modeIcon: {
    marginRight: 8,
  },
  modeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 16,
  },
});

export default TimeTableDetailScreen;
