import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Menu,
  Checkbox,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const UpdateAttendanceScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('student');
  const [selectedClass, setSelectedClass] = useState('1st class');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [showTeacherMenu, setShowTeacherMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [inTime, setInTime] = useState('09:00');
  const [outTime, setOutTime] = useState('17:00');
  const [showInTimePicker, setShowInTimePicker] = useState(false);
  const [showOutTimePicker, setShowOutTimePicker] = useState(false);

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classValue) => {
    setLoadingStudents(true);
    try {
      const mockStudents = {
        '1st class': [
          { id: '1', name: 'Aarav Kumar', studentNumber: 'STU001', class: '1st class' },
          { id: '2', name: 'Bhavna Singh', studentNumber: 'STU002', class: '1st class' },
          { id: '3', name: 'Chirag Patel', studentNumber: 'STU003', class: '1st class' },
          { id: '4', name: 'Diya Sharma', studentNumber: 'STU004', class: '1st class' },
        ],
        '2nd class': [
          { id: '5', name: 'Eshan Verma', studentNumber: 'STU005', class: '2nd class' },
          { id: '6', name: 'Fiona Roy', studentNumber: 'STU006', class: '2nd class' },
          { id: '7', name: 'Gaurav Nair', studentNumber: 'STU007', class: '2nd class' },
          { id: '8', name: 'Hina Khan', studentNumber: 'STU008', class: '2nd class' },
        ],
        '3rd class': [
          { id: '9', name: 'Ishaan Desai', studentNumber: 'STU009', class: '3rd class' },
          { id: '10', name: 'Jaya Menon', studentNumber: 'STU010', class: '3rd class' },
          { id: '11', name: 'Karan Gupta', studentNumber: 'STU011', class: '3rd class' },
          { id: '12', name: 'Lakshmi Iyer', studentNumber: 'STU012', class: '3rd class' },
        ],
      };

      const classStudents = mockStudents[classValue] || [];
      setStudents(classStudents);
      setSelectedStudents({});
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch teachers list
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const mockTeachers = [
        { id: '1', name: 'Mr. Rajesh Kumar' },
        { id: '2', name: 'Ms. Priya Sharma' },
        { id: '3', name: 'Dr. Amit Singh' },
        { id: '4', name: 'Ms. Neha Patel' },
        { id: '5', name: 'Mr. Vikram Verma' },
      ];

      setTeachers(mockTeachers);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Alert.alert('Error', 'Failed to load teachers');
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Load students/teachers when type or class changes
  useEffect(() => {
    if (selectedType === 'student' && showForm) {
      fetchStudentsByClass(selectedClass);
    } else if (selectedType === 'teacher' && showForm) {
      fetchTeachers();
    }
  }, [selectedClass, selectedType, showForm]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowTypeMenu(false);
    if (type === 'student') {
      setTeachers([]);
      setSelectedTeacher(null);
      fetchStudentsByClass(selectedClass);
    } else if (type === 'teacher') {
      setStudents([]);
      setSelectedStudents({});
      fetchTeachers();
    } else {
      setStudents([]);
      setSelectedStudents({});
      setTeachers([]);
      setSelectedTeacher(null);
    }
  };

  const handleClassSelect = (classValue) => {
    setSelectedClass(classValue);
    setShowClassMenu(false);
    if (selectedType === 'student') {
      fetchStudentsByClass(classValue);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleInTimeChange = (increment) => {
    const [hours, minutes] = inTime.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes;

    if (increment) {
      newMinutes += 15;
      if (newMinutes >= 60) {
        newHours += 1;
        newMinutes = 0;
      }
      if (newHours >= 24) newHours = 0;
    } else {
      newMinutes -= 15;
      if (newMinutes < 0) {
        newHours -= 1;
        newMinutes = 45;
      }
      if (newHours < 0) newHours = 23;
    }

    setInTime(
      `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
    );
  };

  const handleOutTimeChange = (increment) => {
    const [hours, minutes] = outTime.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes;

    if (increment) {
      newMinutes += 15;
      if (newMinutes >= 60) {
        newHours += 1;
        newMinutes = 0;
      }
      if (newHours >= 24) newHours = 0;
    } else {
      newMinutes -= 15;
      if (newMinutes < 0) {
        newHours -= 1;
        newMinutes = 45;
      }
      if (newHours < 0) newHours = 23;
    }

    setOutTime(
      `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
    );
  };

  const handleSubmit = async () => {
    try {
      const checkedStudents = Object.keys(selectedStudents).filter(
        (id) => selectedStudents[id]
      );

      if (selectedType === 'student' && checkedStudents.length === 0) {
        Alert.alert('Error', 'Please select at least one student');
        return;
      }

      if (selectedType === 'teacher' && !selectedTeacher) {
        Alert.alert('Error', 'Please select a teacher');
        return;
      }

      let messageDetails = '';
      if (selectedType === 'student') {
        messageDetails = `${checkedStudents.length} student(s)`;
      } else if (selectedType === 'teacher') {
        const teacher = teachers.find((t) => t.id === selectedTeacher);
        messageDetails = `${teacher?.name}`;
      } else {
        messageDetails = `for ${selectedType}`;
      }

      console.log('Updating attendance:', {
        type: selectedType,
        class: selectedClass,
        date: formatDate(selectedDate),
        selectedStudents: checkedStudents,
        selectedTeacher: selectedTeacher,
        inTime: inTime,
        outTime: outTime,
      });

      Alert.alert(
        'Success',
        `Attendance updated for ${messageDetails} on ${formatDate(selectedDate)}\nIn Time: ${inTime}\nOut Time: ${outTime}`
      );
      setShowForm(false);
      setSelectedStudents({});
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  const renderStudentRow = ({ item }) => (
    <TouchableOpacity
      style={styles.studentRow}
      onPress={() => toggleStudentSelection(item.id)}
    >
      <Checkbox
        status={selectedStudents[item.id] ? 'checked' : 'unchecked'}
        onPress={() => toggleStudentSelection(item.id)}
        color="#2196F3"
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentMeta}>
          {item.studentNumber} • {item.class}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Update Attendance</Title>
              <Text style={styles.headerSubtitle}>Update attendance records with times</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-edit" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Add Attendance Button */}
      {!showForm && (
        <Card style={styles.buttonCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => setShowForm(true)}
              style={styles.addButton}
              icon="pencil"
              labelStyle={styles.buttonLabel}
            >
              Update Attendance
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Form Card */}
      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Update Details</Title>

            {/* Type Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <Menu
                visible={showTypeMenu}
                onDismiss={() => setShowTypeMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowTypeMenu(true)}
                    style={styles.dropdownButton}
                  >
                    <Icon name="account-circle" size={20} color="#2196F3" />
                    <Text style={styles.dropdownText}>{selectedType}</Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => handleTypeSelect('student')}
                  title="Student"
                  leadingIcon="school"
                />
                <Menu.Item
                  onPress={() => handleTypeSelect('teacher')}
                  title="Teacher"
                  leadingIcon="briefcase"
                />
                <Menu.Item
                  onPress={() => handleTypeSelect('admin')}
                  title="Admin"
                  leadingIcon="shield-account"
                />
              </Menu>
            </View>

            {/* Class Dropdown - Only show for students */}
            {selectedType === 'student' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Class</Text>
                <Menu
                  visible={showClassMenu}
                  onDismiss={() => setShowClassMenu(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setShowClassMenu(true)}
                      style={styles.dropdownButton}
                    >
                      <Icon name="book" size={20} color="#2196F3" />
                      <Text style={styles.dropdownText}>{selectedClass}</Text>
                      <Icon name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => handleClassSelect('1st class')}
                    title="1st Class"
                    leadingIcon="numeric-1-box"
                  />
                  <Menu.Item
                    onPress={() => handleClassSelect('2nd class')}
                    title="2nd Class"
                    leadingIcon="numeric-2-box"
                  />
                  <Menu.Item
                    onPress={() => handleClassSelect('3rd class')}
                    title="3rd Class"
                    leadingIcon="numeric-3-box"
                  />
                </Menu>
              </View>
            )}

            {/* Teacher Name Dropdown - Only show for teachers */}
            {selectedType === 'teacher' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Teacher Name</Text>
                <Menu
                  visible={showTeacherMenu}
                  onDismiss={() => setShowTeacherMenu(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setShowTeacherMenu(true)}
                      style={styles.dropdownButton}
                    >
                      <Icon name="briefcase" size={20} color="#2196F3" />
                      <Text style={styles.dropdownText}>
                        {selectedTeacher
                          ? teachers.find((t) => t.id === selectedTeacher)?.name
                          : 'Select Teacher'}
                      </Text>
                      <Icon name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  }
                >
                  {loadingTeachers ? (
                    <View style={styles.menuLoadingContainer}>
                      <ActivityIndicator animating={true} size="small" />
                    </View>
                  ) : teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <Menu.Item
                        key={teacher.id}
                        onPress={() => {
                          setSelectedTeacher(teacher.id);
                          setShowTeacherMenu(false);
                        }}
                        title={teacher.name}
                        leadingIcon="account"
                      />
                    ))
                  ) : null}
                </Menu>
              </View>
            )}

            {/* Date Dropdown with custom date picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(!showDatePicker)}
                style={styles.dropdownButton}
              >
                <Icon name="calendar" size={20} color="#2196F3" />
                <Text style={styles.dropdownText}>{formatDate(selectedDate)}</Text>
                <Icon name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateInputRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 1);
                        handleDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-left" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={styles.selectedDateDisplay}>{formatDate(selectedDate)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 1);
                        handleDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-right" size={24} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* In Time Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>In Time</Text>
              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  onPress={() => handleInTimeChange(false)}
                  style={styles.timeNavButton}
                >
                  <Icon name="chevron-left" size={24} color="#2196F3" />
                </TouchableOpacity>
                <View style={styles.timeDisplay}>
                  <Icon name="clock-in" size={20} color="#2196F3" />
                  <Text style={styles.timeText}>{inTime}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleInTimeChange(true)}
                  style={styles.timeNavButton}
                >
                  <Icon name="chevron-right" size={24} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Out Time Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Out Time</Text>
              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  onPress={() => handleOutTimeChange(false)}
                  style={styles.timeNavButton}
                >
                  <Icon name="chevron-left" size={24} color="#2196F3" />
                </TouchableOpacity>
                <View style={styles.timeDisplay}>
                  <Icon name="clock-out" size={20} color="#2196F3" />
                  <Text style={styles.timeText}>{outTime}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleOutTimeChange(true)}
                  style={styles.timeNavButton}
                >
                  <Icon name="chevron-right" size={24} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Student Records Table - Only show for students */}
            {selectedType === 'student' && (
              <View style={styles.studentTableSection}>
                <View style={styles.studentTableHeader}>
                  <Text style={styles.studentTableTitle}>Student Records</Text>
                  <Text style={styles.studentCount}>
                    {Object.values(selectedStudents).filter(Boolean).length} selected
                  </Text>
                </View>

                {loadingStudents ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                  />
                ) : students.length > 0 ? (
                  <FlatList
                    data={students}
                    renderItem={renderStudentRow}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    style={styles.studentList}
                  />
                ) : (
                  <View style={styles.noStudentsContainer}>
                    <Icon name="inbox" size={40} color="#ccc" />
                    <Text style={styles.noStudentsText}>No students found in this class</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonGroup}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                icon="check"
              >
                Update
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowForm(false)}
                style={styles.cancelButton}
                icon="close"
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    padding: 12,
  },
  buttonCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  timeNavButton: {
    padding: 8,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  datePickerContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateNavButton: {
    padding: 8,
  },
  selectedDateDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  studentTableSection: {
    marginVertical: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentTableTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  studentCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studentList: {
    marginTop: 8,
    maxHeight: 400,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: 12,
    color: '#999',
  },
  loader: {
    marginVertical: 20,
  },
  menuLoadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noStudentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noStudentsText: {
    marginTop: 10,
    fontSize: 13,
    color: '#999',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#ff6b6b',
  },
  bottomPadding: {
    height: 20,
  },
});

export default UpdateAttendanceScreen;
