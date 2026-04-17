import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Card, Title, Text, Button, Divider, IconButton, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ExamsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [examsData, setExamsData] = useState([]);
  const [selectedDateExams, setSelectedDateExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  // Fetch all exams for the current month
  const fetchExams = async (date = currentDate) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      console.log(`Fetching exams for ${month}/${year}`);
      
      const response = await axios.get('http://localhost:5000/api/exams', {
        params: {
          userid: user?.userid,
          year,
          month,
        },
      });
      setExamsData(response.data.data || []);
      console.log('Exams fetched:', response.data.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      Alert.alert('Error', 'Failed to fetch exams');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchExams();
  }, [user]);

  // Get exams for specific date
  const getExamsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return examsData.filter(exam => exam.date === dateStr);
  };

  // Get calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDatePress = (day) => {
    const selectedDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDay);
    const exams = getExamsForDate(selectedDay);
    setSelectedDateExams(exams);
  };

  const handleAddExam = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }
    navigation.navigate('ExamDetail', {
      userData: user,
      examDate: selectedDate,
      isNew: true,
    });
  };

  // Render calendar grid
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const hasExams = examsData.some(exam => exam.date === dateStr);
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            hasExams && styles.dayWithExams,
            isSelected && styles.daySelected,
          ]}
          onPress={() => handleDatePress(day)}
        >
          <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
            {day}
          </Text>
          {hasExams && <View style={styles.examIndicator} />}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleRefresh = () => {
    fetchExams();
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
    setLoading(true);
    try {
      console.log('Deleting exam:', examId);
      await axios.delete(`http://localhost:5000/api/exams/${examId}`);
      
      console.log('Exam deleted successfully');
      Alert.alert('Success', 'Exam deleted successfully!');
      
      // Remove exam from local state
      setExamsData(examsData.filter(exam => exam.examid !== examId));
      
      // Refresh selected date exams if any
      if (selectedDate) {
        const updatedSelectedDateExams = selectedDateExams.filter(exam => exam.examid !== examId);
        setSelectedDateExams(updatedSelectedDateExams);
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Month Navigation */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={handlePreviousMonth}
          style={styles.navButton}
        />
        <Title style={styles.monthTitle}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Title>
        <IconButton
          icon="chevron-right"
          size={28}
          onPress={handleNextMonth}
          style={styles.navButton}
        />
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView style={styles.scrollView}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F44336" />
          </View>
        )}
        
        <View style={styles.calendarGrid}>
          {renderCalendarDays()}
        </View>

        {/* Selected Date Exams */}
        {selectedDate && (
          <Card style={styles.selectedDateCard}>
            <Card.Content>
              <View style={styles.selectedDateHeader}>
                <Title style={styles.selectedDateTitle}>
                  {selectedDate.toLocaleDateString('default', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Title>
                <Button
                  mode="outlined"
                  onPress={handleAddExam}
                  style={styles.addButton}
                  icon="plus"
                >
                  Add Exam
                </Button>
              </View>

              <Divider style={styles.divider} />

              {selectedDateExams.length > 0 ? (
                <FlatList
                  data={selectedDateExams}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.examCard}
                      onPress={() =>
                        navigation.navigate('ExamDetail', {
                          userData: user,
                          examData: item,
                          isNew: false,
                        })
                      }
                    >
                      <View style={styles.examCardContent}>
                        <View style={styles.examInfo}>
                          <Text style={styles.examSubject}>{item.subject}</Text>
                          <View style={styles.examMeta}>
                            <Icon name="clock" size={14} color="#666" />
                            <Text style={styles.examTime}>{item.time}</Text>
                          </View>
                          {item.room && (
                            <View style={styles.examMeta}>
                              <Icon name="door" size={14} color="#666" />
                              <Text style={styles.examRoom}>Room {item.room}</Text>
                            </View>
                          )}
                        </View>
                        <Icon name="chevron-right" size={24} color="#F44336" />
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.examid?.toString() || Math.random().toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noExamsContainer}>
                  <Icon name="calendar-blank" size={40} color="#ccc" />
                  <Text style={styles.noExamsText}>No exams on this date</Text>
                  <Button
                    mode="contained"
                    onPress={handleAddExam}
                    style={styles.addExamButton}
                  >
                    Add First Exam
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Monthly Exams Table */}
        {examsData.length > 0 && (
          <Card style={styles.monthlyExamsCard}>
            <Card.Content>
              <Title style={styles.tableTitle}>All Exams - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Title>
              <Divider style={styles.divider} />
              
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Class</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Subject</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Time</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Room</Text>
              </View>

              {/* Table Rows */}
              <FlatList
                data={examsData}
                renderItem={({ item, index }) => (
                  <View
                    style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
                  >
                    <TouchableOpacity
                      style={styles.tableRowContent}
                      onPress={() =>
                        navigation.navigate('ExamDetail', {
                          userData: user,
                          examData: item,
                          isNew: false,
                        })
                      }
                    >
                      <Text style={[styles.tableCell, { flex: 2 }]}>{item.date}</Text>
                      <Text style={[styles.tableCell, { flex: 2 }]}>{item.class}</Text>
                      <Text style={[styles.tableCell, { flex: 2.5 }]}>{item.subject}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.time}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.room || '-'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteExam(item.examid)}
                    >
                      <Icon name="trash-can" size={18} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.examid?.toString() || Math.random().toString()}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleRefresh}
            loading={loading}
            style={styles.refreshButton}
          >
            Refresh
          </Button>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  navButton: {
    margin: 0,
  },
  monthTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekdayContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekdayCell: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 2,
  },
  dayWithExams: {
    backgroundColor: '#FFE0E0',
    borderColor: '#F44336',
    borderWidth: 2,
  },
  daySelected: {
    backgroundColor: '#F44336',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
    margin: 2,
  },
  examIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F44336',
    position: 'absolute',
    bottom: 4,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateCard: {
    margin: 16,
    marginTop: 8,
    elevation: 3,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  addButton: {
    borderColor: '#F44336',
  },
  divider: {
    marginVertical: 12,
  },
  examCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    padding: 12,
  },
  examCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examInfo: {
    flex: 1,
  },
  examSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  examMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  examTime: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  examRoom: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  noExamsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noExamsText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  addExamButton: {
    marginTop: 8,
    backgroundColor: '#F44336',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#F44336',
  },
  monthlyExamsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowAlternate: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  tableRowContent: {
    flex: 1,
    flexDirection: 'row',
  },
  deleteButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

export default ExamsScreen;
