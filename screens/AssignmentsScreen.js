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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AssignmentsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) {
      setUser(route.params.userData);
    }
  }, [route.params]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/assignments');
      if (response.status === 200) {
        const dataArray = response.data.data || [];
        setAssignmentsData(dataArray);
      }
    } catch (error) {
      console.error('fetchAssignments: Error:', error);
      setAssignmentsData([
        {
          assignmentid: '1',
          subject: 'Mathematics',
          title: 'Chapter 5 Exercises',
          duedate: '2024-02-20',
          status: 'Pending',
        },
        {
          assignmentid: '2',
          subject: 'English',
          title: 'Essay Writing',
          duedate: '2024-02-25',
          status: 'Submitted',
        },
        {
          assignmentid: '3',
          subject: 'Science',
          title: 'Lab Report',
          duedate: '2024-03-01',
          status: 'Pending',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const handleViewAssignment = (item) => {
    navigation.navigate('AssignmentDetail', {
      userData: user,
      assignmentData: item,
    });
  };

  const renderAssignmentRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.subject || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.title || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={[styles.cellText, { color: item.status === 'Submitted' ? '#4CAF50' : '#FF9800' }]}>
          {item.status || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity
          onPress={() => handleViewAssignment(item)}
          style={styles.viewButton}
        >
          <Icon name="eye" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Assignments</Title>
          <Divider style={styles.divider} />

          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Subject</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Title</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.headerText}>Status</Text>
                </View>
                <View style={styles.tableCellAction}>
                  <Text style={styles.headerText}>Action</Text>
                </View>
              </View>

              {assignmentsData.length > 0 ? (
                <FlatList
                  data={assignmentsData}
                  renderItem={renderAssignmentRow}
                  keyExtractor={(item) => item.assignmentid?.toString() || Math.random().toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No assignments found</Text>
                </View>
              )}
            </>
          )}

          <Button
            mode="contained"
            onPress={fetchAssignments}
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
  divider: {
    marginVertical: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FF9800',
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
    color: '#E65100',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  viewButton: {
    padding: 8,
    backgroundColor: '#FFF3E0',
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
    backgroundColor: '#FF9800',
  },
});

export default AssignmentsScreen;
