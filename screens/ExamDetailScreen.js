import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput as PaperInput,
  Divider,
  IconButton,
  FAB,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ExamDetailScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [examDate, setExamDate] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [examData, setExamData] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    class: '',
    date: examDate ? examDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    subject: '',
    time: '',
    room: '',
    duration: '',
    description: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Dropdown options
  const classOptions = [
    { label: 'Class 1', value: '1' },
    { label: 'Class 2', value: '2' },
    { label: 'Class 3', value: '3' },
    { label: 'Class 4', value: '4' },
    { label: 'Class 5', value: '5' },
    { label: 'Class 6', value: '6' },
    { label: 'Class 7', value: '7' },
    { label: 'Class 8', value: '8' },
    { label: 'Class 9', value: '9' },
    { label: 'Class 10', value: '10' },
  ];

  const subjectOptions = [
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Maths', value: 'Maths' },
    { label: 'Science', value: 'Science' },
    { label: 'Social', value: 'Social' },
  ];

  const timeOptions = [
    { label: '9:00 AM', value: '9:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '3:00 PM', value: '15:00' },
  ];

  const durationOptions = [
    { label: '30 minutes', value: '30' },
    { label: '60 minutes', value: '60' },
  ];

  // Custom Dropdown Component
  const CustomDropdown = ({ label, value, options, onSelect, fieldName }) => {
    const isOpen = dropdownOpen === fieldName;
    const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

    return (
      <View>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownOpen(isOpen ? null : fieldName)}
        >
          <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              scrollEnabled={options.length > 5}
              nestedScrollEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    value === item.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setDropdownOpen(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      value === item.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    if (route.params?.examDate) setExamDate(route.params.examDate);
    if (route.params?.examData) {
      setExamData(route.params.examData);
      setIsNew(false);
      setFormData({
        class: route.params.examData.class || '',
        date: route.params.examData.date || (examDate ? examDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        subject: route.params.examData.subject || '',
        time: route.params.examData.time || '',
        room: route.params.examData.room || '',
        duration: route.params.examData.duration || '',
        description: route.params.examData.description || '',
      });
    } else {
      setIsNew(true);
      setExamDate(route.params?.examDate);
    }
    
    if (route.params?.examDate) {
      fetchExamsForDate(route.params.examDate);
    }
  }, [route.params]);

  // Fetch exams for specific date
  const fetchExamsForDate = async (date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      console.log(`Fetching exams for date: ${dateStr}`);
      
      const response = await axios.get('http://localhost:5000/api/exams/date', {
        params: {
          userid: user?.userid,
          date: dateStr,
        },
      });
      setExams(response.data.data || []);
      console.log('Exams fetched:', response.data.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      Alert.alert('Error', 'Failed to fetch exams');
    }
    setLoading(false);
  };

  // Create new exam
  const handleCreateExam = async () => {
    try {
      if (!formData.subject.trim()) {
        Alert.alert('Validation', 'Please enter subject name');
        return;
      }

      if (!formData.time.trim()) {
        Alert.alert('Validation', 'Please enter exam time');
        return;
      }

      setLoading(true);
      const dateStr = examDate.toISOString().split('T')[0];
      
      console.log('Creating exam:', { ...formData, date: dateStr });
      
      const response = await axios.post('http://localhost:5000/api/exams', {
        userid: user?.userid,
        class: formData.class,
        date: formData.date || dateStr,
        subject: formData.subject,
        time: formData.time,
        room: formData.room || '',
        duration: formData.duration || '',
        description: formData.description || '',
      });

      console.log('Exam created successfully:', response.data);
      Alert.alert('Success', 'Exam added successfully!');
      
      // Refresh exams list
      await fetchExamsForDate(examDate);
      
      // Reset form
      setFormData({
        class: '',
        date: examDate ? examDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        subject: '',
        time: '',
        room: '',
        duration: '',
        description: '',
      });
      setShowForm(false);
      setIsNew(true);
    } catch (error) {
      console.error('Error creating exam:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  // Update exam
  const handleUpdateExam = async () => {
    try {
      if (!formData.subject.trim()) {
        Alert.alert('Validation', 'Please enter subject name');
        return;
      }

      setLoading(true);
      console.log('Updating exam:', examData.examid, formData);
      
      const response = await axios.put(
        `http://localhost:5000/api/exams/${examData.examid}`,
        {
          class: formData.class,
          date: formData.date,
          subject: formData.subject,
          time: formData.time,
          room: formData.room || '',
          duration: formData.duration || '',
          description: formData.description || '',
        }
      );

      console.log('Exam updated successfully:', response.data);
      Alert.alert('Success', 'Exam updated successfully!');
      
      // Refresh exams list
      await fetchExamsForDate(examDate);
      
      setShowForm(false);
    } catch (error) {
      console.error('Error updating exam:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  // Delete exam
  const handleDeleteExam = (examId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this exam?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => confirmDelete(examId),
        style: 'destructive',
      },
    ]);
  };

  const confirmDelete = async (examId) => {
    try {
      setLoading(true);
      console.log('Deleting exam:', examId);
      
      const response = await axios.delete(`http://localhost:5000/api/exams/${examId}`);
      
      console.log('Exam deleted successfully');
      Alert.alert('Success', 'Exam deleted successfully!');
      
      // Refresh exams list
      await fetchExamsForDate(examDate);
    } catch (error) {
      console.error('Error deleting exam:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = (exam) => {
    setExamData(exam);
    setIsNew(false);
    setFormData({
      class: exam.class || '',
      date: exam.date || new Date().toISOString().split('T')[0],
      subject: exam.subject || '',
      time: exam.time || '',
      room: exam.room || '',
      duration: exam.duration || '',
      description: exam.description || '',
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setIsNew(true);
    setExamData(null);
    setFormData({
      class: '',
      date: examDate ? examDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      subject: '',
      time: '',
      room: '',
      duration: '',
      description: '',
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsNew(true);
    setExamData(null);
    setFormData({
      class: '',
      date: examDate ? examDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      subject: '',
      time: '',
      room: '',
      duration: '',
      description: '',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor="#fff"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>
            {examDate?.toLocaleDateString('default', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Title>
          <Text style={styles.headerSubtitle}>Exam Details</Text>
        </View>
        <IconButton
          icon="plus"
          size={28}
          iconColor="#fff"
          onPress={handleAddNew}
          style={styles.addButton}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {loading && !showForm && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F44336" />
          </View>
        )}

        {/* Exams List */}
        {exams.length > 0 ? (
          <View style={styles.examsList}>
            <Text style={styles.sectionTitle}>Exams for this Date</Text>
            {exams.map((exam, index) => (
              <Card
                key={exam.examid?.toString() || index}
                style={styles.examCard}
              >
                <Card.Content>
                  <View style={styles.examHeader}>
                    <View style={styles.examTitleSection}>
                      <Text style={styles.examTitle}>{exam.subject}</Text>
                      <View style={styles.examBadges}>
                        {exam.time && (
                          <View style={styles.badge}>
                            <Icon name="clock" size={12} color="#F44336" />
                            <Text style={styles.badgeText}>{exam.time}</Text>
                          </View>
                        )}
                        {exam.room && (
                          <View style={styles.badge}>
                            <Icon name="door" size={12} color="#F44336" />
                            <Text style={styles.badgeText}>Room {exam.room}</Text>
                          </View>
                        )}
                        {exam.duration && (
                          <View style={styles.badge}>
                            <Icon name="timer" size={12} color="#F44336" />
                            <Text style={styles.badgeText}>{exam.duration} min</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        iconColor="#FFC107"
                        onPress={() => handleEditExam(exam)}
                      />
                      <IconButton
                        icon="trash-can"
                        size={20}
                        iconColor="#F44336"
                        onPress={() => handleDeleteExam(exam.examid)}
                      />
                    </View>
                  </View>
                  {exam.description && (
                    <>
                      <Divider style={styles.divider} />
                      <Text style={styles.description}>{exam.description}</Text>
                    </>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="calendar-blank" size={48} color="#ccc" />
            <Text style={styles.noDataText}>No exams scheduled for this date</Text>
            <Button
              mode="contained"
              onPress={handleAddNew}
              style={styles.addFirstButton}
              icon="plus"
            >
              Add First Exam
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={handleCloseForm}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={28}
              onPress={handleCloseForm}
            />
            <Title style={styles.modalTitle}>
              {isNew ? 'Add Exam' : 'Edit Exam'}
            </Title>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.formLabel}>Class *</Text>
            <CustomDropdown
              label="Select Class"
              value={formData.class}
              options={classOptions}
              onSelect={(value) => setFormData({ ...formData, class: value })}
              fieldName="class"
            />

            <Text style={styles.formLabel}>Date (Disabled - Current Date)</Text>
            <PaperInput
              style={styles.input}
              placeholder="Date"
              value={formData.date}
              editable={false}
            />

            <Text style={styles.formLabel}>Subject *</Text>
            <CustomDropdown
              label="Select Subject"
              value={formData.subject}
              options={subjectOptions}
              onSelect={(value) => setFormData({ ...formData, subject: value })}
              fieldName="subject"
            />

            <Text style={styles.formLabel}>Time *</Text>
            <CustomDropdown
              label="Select Time"
              value={formData.time}
              options={timeOptions}
              onSelect={(value) => setFormData({ ...formData, time: value })}
              fieldName="time"
            />

            <Text style={styles.formLabel}>Room Number</Text>
            <PaperInput
              style={styles.input}
              placeholder="101, 102, etc."
              value={formData.room}
              onChangeText={(text) =>
                setFormData({ ...formData, room: text })
              }
              editable={!loading}
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Duration (minutes)</Text>
            <CustomDropdown
              label="Select Duration"
              value={formData.duration}
              options={durationOptions}
              onSelect={(value) => setFormData({ ...formData, duration: value })}
              fieldName="duration"
            />

            <Text style={styles.formLabel}>Description</Text>
            <PaperInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional details..."
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              editable={!loading}
              multiline
              numberOfLines={4}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={isNew ? handleCreateExam : handleUpdateExam}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
            >
              {isNew ? 'Add Exam' : 'Update Exam'}
            </Button>

            <Button
              mode="outlined"
              onPress={handleCloseForm}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 16,
    paddingHorizontal: 8,
    elevation: 4,
  },
  backButton: {
    margin: 0,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  addButton: {
    margin: 0,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  examCard: {
    marginBottom: 12,
    elevation: 2,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  examTitleSection: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  examBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  addFirstButton: {
    marginTop: 16,
    backgroundColor: '#F44336',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 16,
    paddingHorizontal: 8,
    elevation: 4,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginVertical: 12,
  },
  input: {
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    marginVertical: 16,
    backgroundColor: '#F44336',
  },
  cancelButton: {
    marginBottom: 32,
    borderColor: '#F44336',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 12,
    maxHeight: 200,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFE0E0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#F44336',
    fontWeight: '600',
  },
});

export default ExamDetailScreen;
