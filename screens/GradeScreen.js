import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GradeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('student');
  const [selectedGrade, setSelectedGrade] = useState('9');
  const [showUserTypeMenu, setShowUserTypeMenu] = useState(false);
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Grade options for each user type
  const gradesByUserType = {
    student: ['9', '10', '11', '12'],
    teacher: ['9', '10', '11', '12'],
    admin: ['All Grades'],
  };

  useEffect(() => {
    // Get user data from navigation params
    console.log('useEffect: Route params received:', route.params);
    if (route.params?.userData) {
      console.log('useEffect: Setting user data:', route.params.userData);
      setUser(route.params.userData);
      
      // Set initial user type based on logged-in user's type
      if (route.params.userData.userType === 'student') {
        setSelectedUserType('student');
        setSelectedGrade('9');
      } else if (route.params.userData.userType === 'teacher') {
        setSelectedUserType('teacher');
        setSelectedGrade('9');
      } else if (route.params.userData.userType === 'admin') {
        setSelectedUserType('admin');
        setSelectedGrade('All Grades');
      }

      // Use grades data if available
      if (route.params?.gradesData) {
        console.log('useEffect: Setting grades data:', route.params.gradesData);
        if (Array.isArray(route.params.gradesData)) {
          setGradesData(route.params.gradesData);
        }
      }
    }
  }, [route.params]);

  // Check if user is authorized to view filters (teacher or admin)
  const canViewFilters = user && (user.userType === 'teacher' || user.userType === 'admin');
  
  // For students, they can only view their own record
  const isStudent = user && user.userType === 'student';

  const handleUserTypeSelect = (userType) => {
    console.log('handleUserTypeSelect called with:', userType);
    setSelectedUserType(userType);
    setShowUserTypeMenu(false);
    // Reset grade when user type changes
    const grades = gradesByUserType[userType];
    setSelectedGrade(grades[0]);
  };

  const fetchGrades = async () => {
    console.log('fetchGrades called with userType:', selectedUserType, 'grade:', selectedGrade);
    setLoading(true);
    try {
      console.log('fetchGrades: Making API request to localhost:5000/api/grades');
      const response = await axios.get('http://localhost:5000/api/grades', {
        params: {
          userType: selectedUserType
        },
      });

      if (response.status === 200) {
        console.log('fetchGrades: API response received:', response.data);
        // Extract the data array from the response object
        const gradesArray = response.data.data || [];
        console.log('fetchGrades: Extracted grades array:', gradesArray);
        setGradesData(gradesArray);
      } else {
        console.error('fetchGrades: Failed with status:', response.status);
        Alert.alert('Error', 'Failed to fetch grades');
      }
    } catch (error) {
      console.error('fetchGrades: Error fetching grades:', error);
      // Mock data for demonstration
      console.log('fetchGrades: Using mock data');
      setGradesData([
        {
          gradeid: '1001',
          studentname: 'John Doe',
          studentid: 'S001',
          subject: 'Mathematics',
          marks: 85,
          grade: '9',
          semester: 'Spring 2024',
        },
        {
          gradeid: '1002',
          studentname: 'Jane Smith',
          studentid: 'S002',
          subject: 'English',
          marks: 92,
          grade: '9',
          semester: 'Spring 2024',
        },
        {
          gradeid: '1003',
          studentname: 'Alex Johnson',
          studentid: 'S003',
          subject: 'Science',
          marks: 78,
          grade: '9',
          semester: 'Spring 2024',
        },
        {
          gradeid: '1004',
          studentname: 'Sarah Williams',
          studentid: 'S004',
          subject: 'Social Studies',
          marks: 88,
          grade: '9',
          semester: 'Spring 2024',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('useEffect (fetchGrades trigger): canViewFilters:', canViewFilters, 'gradesData.length:', gradesData?.length);
    if (canViewFilters && gradesData.length === 0) {
      console.log('useEffect: Calling fetchGrades');
      fetchGrades();
    }
  }, [selectedUserType, selectedGrade, canViewFilters]);

  const handleViewGrade = (gradeItem) => {
    console.log('handleViewGrade called with:', gradeItem);
    navigation.navigate('GradeEdit', {
      userData: user,
      gradeData: gradeItem,
    });
  };

  const renderGradeRow = ({ item }) => {
    console.log('renderGradeRow: Rendering item:', item);
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.studentname || 'N/A'}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.subject || 'N/A'}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.marks || 'N/A'}</Text>
        </View>
        <View style={styles.tableCellAction}>
          <TouchableOpacity
            onPress={() => handleViewGrade(item)}
            style={styles.viewButton}
          >
            <Icon name="eye" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {isStudent ? (
            <Title>My Grades</Title>
          ) : (
            <Title>Grade Management</Title>
          )}
          
          {/* Show filters only for teachers and admins */}
          {canViewFilters && (
            <View style={styles.filtersContainer}>
              {/* User Type Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>User Type</Text>
                <Menu
                  visible={showUserTypeMenu}
                  onDismiss={() => setShowUserTypeMenu(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setShowUserTypeMenu(true)}
                      style={styles.dropdownButton}
                    >
                      <Text style={styles.dropdownText}>{selectedUserType}</Text>
                      <Icon name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => handleUserTypeSelect('student')}
                    title="Student"
                    leadingIcon="school"
                  />
                  <Menu.Item
                    onPress={() => handleUserTypeSelect('teacher')}
                    title="Teacher"
                    leadingIcon="briefcase"
                  />
                  <Menu.Item
                    onPress={() => handleUserTypeSelect('admin')}
                    title="Admin"
                    leadingIcon="shield-account"
                  />
                </Menu>
              </View>

              {/* Grade Dropdown (Dependent on User Type) */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Grade</Text>
                <Menu
                  visible={showGradeMenu}
                  onDismiss={() => setShowGradeMenu(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setShowGradeMenu(true)}
                      style={styles.dropdownButton}
                    >
                      <Text style={styles.dropdownText}>{selectedGrade}</Text>
                      <Icon name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  }
                >
                  {gradesByUserType[selectedUserType].map((grade) => (
                    <Menu.Item
                      key={grade}
                      onPress={() => {
                        setSelectedGrade(grade);
                        setShowGradeMenu(false);
                      }}
                      title={grade}
                    />
                  ))}
                </Menu>
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Grades Table */}
          <Title style={styles.tableTitle}>
            {isStudent ? 'Your Grades' : 'Grades List'}
          </Title>
          
          {loading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.loader}
            />
          ) : (
            <>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Student</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Subject</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Marks</Text>
                </View>
                <View style={styles.tableCellAction}>
                  <Text style={styles.headerText}>Action</Text>
                </View>
              </View>

              {/* Table Rows */}
              {gradesData.length > 0 ? (
                <FlatList
                  data={gradesData}
                  renderItem={renderGradeRow}
                  keyExtractor={(item, index) => {
                    const key = item.gradeid || item.studentid || index.toString();
                    console.log('keyExtractor: item:', item, 'generated key:', key);
                    return key.toString();
                  }}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No grades found</Text>
                </View>
              )}
            </>
          )}

          {/* Refresh Button */}
          <Button
            mode="contained"
            onPress={fetchGrades}
            style={styles.refreshButton}
            loading={loading}
          >
            Refresh
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
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 12,
  },
  dropdownContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#666',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    marginVertical: 16,
  },
  tableTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  tableCellAction: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#2E7D32',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  viewButton: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
});

export default GradeScreen;
