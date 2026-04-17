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

const GradeEditScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [marks, setMarks] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [studentname, setStudentname] = useState('');
  const [studentid, setStudentid] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    console.log('useEffect: Route params received:', route.params);
    if (route.params?.userData) {
      setUser(route.params.userData);
    }
    
    if (route.params?.gradeData) {
      const data = route.params.gradeData;
      console.log('useEffect: Setting grade data:', data);
      setGradeData(data);
      
      // Populate form fields
      setStudentname(data.studentname || '');
      setStudentid(data.studentid || '');
      setSubject(data.subject || '');
      setMarks(data.marks ? data.marks.toString() : '');
      setSemester(data.semester || '');
      setGrade(data.grade || '');
    }
  }, [route.params]);

  const isAdmin = user && user.userType === 'admin';

  const handleEdit = () => {
    console.log('handleEdit called, switching to edit mode');
    setIsEditMode(true);
  };

  const handleCancel = () => {
    console.log('handleCancel called, discarding changes');
    setIsEditMode(false);
    // Reset fields to original data
    if (gradeData) {
      setStudentname(gradeData.studentname || '');
      setStudentid(gradeData.studentid || '');
      setSubject(gradeData.subject || '');
      setMarks(gradeData.marks ? gradeData.marks.toString() : '');
      setSemester(gradeData.semester || '');
      setGrade(gradeData.grade || '');
    }
  };

  const handleSave = async () => {
    console.log('handleSave called');
    
    // Validation
    if (!marks || isNaN(marks) || parseFloat(marks) < 0 || parseFloat(marks) > 100) {
      Alert.alert('Validation Error', 'Marks must be a number between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        gradeid: gradeData.gradeid,
        studentname,
        studentid,
        subject,
        marks: parseFloat(marks),
        semester,
        grade,
      };

      console.log('handleSave: Sending update request:', updatedData);
      
      const response = await axios.put(
        `http://localhost:5000/api/grades/${gradeData.gradeid}`,
        updatedData
      );

      if (response.status === 200) {
        console.log('handleSave: Update successful:', response.data);
        Alert.alert('Success', 'Grade updated successfully');
        setGradeData(updatedData);
        setIsEditMode(false);
      } else {
        Alert.alert('Error', 'Failed to update grade');
      }
    } catch (error) {
      console.error('handleSave: Error updating grade:', error);
      Alert.alert('Error', 'An error occurred while updating the grade');
    } finally {
      setLoading(false);
    }
  };

  if (!gradeData) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>No Grade Data</Title>
            <Text>Unable to load grade information.</Text>
            <Button
              mode="contained"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              Go Back
            </Button>
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
            <Title>Grade Details</Title>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {isAdmin && !isEditMode && (
              <Button
                mode="contained"
                onPress={handleEdit}
                style={styles.editButton}
                icon="pencil"
              >
                Edit
              </Button>
            )}
            
            {isEditMode && (
              <>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveButton}
                  loading={loading}
                  icon="check"
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.cancelButton}
                  icon="close"
                >
                  Cancel
                </Button>
              </>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Student Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Student Name</Text>
              <TextInput
                style={styles.input}
                value={studentname}
                onChangeText={setStudentname}
                editable={isEditMode}
                mode="outlined"
                outlined={true}
              />
            </View>

            {/* Student ID */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                value={studentid}
                onChangeText={setStudentid}
                editable={isEditMode}
                mode="outlined"
                outlined={true}
              />
            </View>

            {/* Subject */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                editable={isEditMode}
                mode="outlined"
                outlined={true}
              />
            </View>

            {/* Grade */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Grade</Text>
              <TextInput
                style={styles.input}
                value={grade}
                onChangeText={setGrade}
                editable={isEditMode}
                mode="outlined"
                outlined={true}
              />
            </View>

            {/* Marks */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Marks (out of 100)</Text>
              <TextInput
                style={styles.input}
                value={marks}
                onChangeText={setMarks}
                editable={isEditMode}
                mode="outlined"
                keyboardType="decimal-pad"
                outlined={true}
              />
            </View>

            {/* Semester */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Semester</Text>
              <TextInput
                style={styles.input}
                value={semester}
                onChangeText={setSemester}
                editable={isEditMode}
                mode="outlined"
                outlined={true}
              />
            </View>

            {/* Mode Indicator */}
            <View style={styles.modeIndicator}>
              <Icon
                name={isEditMode ? 'pencil-outline' : 'eye-outline'}
                size={16}
                color={isEditMode ? '#FF9800' : '#2196F3'}
                style={styles.modeIcon}
              />
              <Text style={styles.modeText}>
                {isEditMode ? 'Edit Mode - All fields are editable' : 'View Mode - Read only'}
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            icon="arrow-left"
          >
            Back to Grades
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
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: '#2196F3',
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

export default GradeEditScreen;
