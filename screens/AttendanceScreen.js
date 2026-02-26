import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Menu,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const AttendanceScreen = ({ navigation, route }) => {
  console.log('\n=== AttendanceScreen Component Mounted ===');
  const [user, setUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('student');
  const [showUserTypeMenu, setShowUserTypeMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  console.log('State initialized:', {
    user,
    selectedUserType,
    usersCount: users.length,
    hasSearched,
    loading,
  });

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time to HH:MM
  const formatTime = (timeString) => {
    if (!timeString) {
      console.log('[formatTime] Empty time string, returning N/A');
      return 'N/A';
    }
    const [hours, minutes] = timeString.split(':');
    const formatted = `${hours}:${minutes}`;
    return formatted;
  };

  // Calculate status based on login/logout duration
  const calculateStatus = (timeIn, timeOut) => {
    console.log('[calculateStatus] Called with:', { timeIn, timeOut });
    if (!timeIn) {
      console.log('[calculateStatus] No login time - Absent');
      return { status: 'Absent', color: '#f44336' };
    }
    if (!timeOut) {
      console.log('[calculateStatus] No logout time - Logged In');
      return { status: 'Logged In', color: '#ff9800' };
    }

    const [lhours, lminutes] = timeIn.split(':').map(Number);
    const [ohours, ominutes] = timeOut.split(':').map(Number);

    const loginMinutes = lhours * 60 + lminutes;
    const logoutMinutes = ohours * 60 + ominutes;
    const durationMinutes = logoutMinutes - loginMinutes;
    console.log('[calculateStatus] Duration:', durationMinutes, 'minutes');

    if (durationMinutes >= 480) {
      console.log('[calculateStatus] Result: Full Day');
      return { status: 'Full Day', color: '#4caf50' };
    }
    if (durationMinutes >= 240) {
      console.log('[calculateStatus] Result: Half Day');
      return { status: 'Half Day', color: '#8bc34a' };
    }
    if (durationMinutes > 0) {
      console.log('[calculateStatus] Result: Short Duration');
      return { status: 'Short Duration', color: '#ff9800' };
    }

    console.log('[calculateStatus] Result: Absent');
    return { status: 'Absent', color: '#f44336' };
  };

  // Handle date selection
  const handleStartDateChange = (newDate) => {
    console.log('[handleStartDateChange] New date:', newDate);
    const dateObj = new Date(newDate);
    setStartDate(dateObj);
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (newDate) => {
    console.log('[handleEndDateChange] New date:', newDate);
    const dateObj = new Date(newDate);
    setEndDate(dateObj);
    setShowEndDatePicker(false);
  };

  const handleUserTypeSelect = (userType) => {
    console.log('\n[handleUserTypeSelect] Type:', userType);
    setSelectedUserType(userType);
    setShowUserTypeMenu(false);
    console.log('[handleUserTypeSelect] Menu closed');
  };

  useEffect(() => {
    console.log('\n[useEffect] Route params changed');
    if (route.params?.userData) {
      console.log('[useEffect] User data found:', route.params.userData.username);
      setUser(route.params.userData);
      console.log('[useEffect] Setting user type:', route.params.userData.userType);

      if (route.params.userData.userType === 'student') {
        setSelectedUserType('student');
      } else if (route.params.userData.userType === 'teacher') {
        setSelectedUserType('teacher');
      } else if (route.params.userData.userType === 'admin') {
        setSelectedUserType('admin');
      }
    } else {
      console.log('[useEffect] No user data in route params');
    }
  }, [route.params]);

  // Check if user is authorized to view filters (teacher or admin)
  const canViewFilters = true; // Always allow viewing filters

  const fetchAttendance = async () => {
    console.log('\n\n========== FETCH ATTENDANCE START ==========');
    console.log('[fetchAttendance] UserType:', selectedUserType);
    console.log('[fetchAttendance] Date range:', formatDate(startDate), 'to', formatDate(endDate));
    setLoading(true);
    setHasSearched(true);

    try {
      console.log('[fetchAttendance] Making API request...');
      const params = {
        userType: selectedUserType,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      };
      console.log('[fetchAttendance] Request params:', params);
      
      const response = await axios.get('http://localhost:5000/api/attendance', { params });

      console.log('[fetchAttendance] Response status:', response.status);
      console.log('[fetchAttendance] Response data:', response.data);
      
      if (response.status === 200) {
        const attendanceArray = response.data.data || [];
        console.log('[fetchAttendance] Attendance records extracted:', attendanceArray.length, 'records');
        setUsers(attendanceArray);
        console.log('[fetchAttendance] Users state updated');
      } else {
        console.error('[fetchAttendance] API error status:', response.status);
        Alert.alert('Error', 'Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('\n[fetchAttendance] ERROR CAUGHT:', error.message);
      console.error('[fetchAttendance] Error details:', error);
      console.log('[fetchAttendance] Using mock data instead...');
      
      const mockData = [
        { userid: '1001', username: 'john_doe', fullname: 'John Doe', email: 'john@example.com', userType: 'student', date: formatDate(new Date()), timeIn: '09:00', timeOut: '16:30' },
        { userid: '1002', username: 'jane_smith', fullname: 'Jane Smith', email: 'jane@example.com', userType: 'student', date: formatDate(new Date()), timeIn: '09:15', timeOut: null },
        { userid: '1003', username: 'alex_johnson', fullname: 'Alex Johnson', email: 'alex@example.com', userType: 'student', date: formatDate(new Date()), timeIn: '09:00', timeOut: '13:00' },
        { userid: '1004', username: 'sarah_williams', fullname: 'Sarah Williams', email: 'sarah@example.com', userType: 'student', date: formatDate(new Date()), timeIn: null, timeOut: null },
      ];
      console.log('[fetchAttendance] Mock data loaded:', mockData.length, 'records');
      setUsers(mockData);
    }
    
    setLoading(false);
    console.log('========== FETCH ATTENDANCE END ==========\n');
  };

  const onRefresh = React.useCallback(() => {
    console.log('[onRefresh] Pull-to-refresh triggered');
    setRefreshing(true);
    fetchAttendance().then(() => {
      console.log('[onRefresh] Refresh completed');
      setRefreshing(false);
    });
  }, []);

  // Generate PDF Report
  const generatePDFReport = async () => {
    console.log('\n[generatePDFReport] Starting PDF generation');
    console.log('[generatePDFReport] User:', user?.username);
    console.log('[generatePDFReport] Total records:', users.length);
    
    try {
      if (!user || users.length === 0) {
        console.log('[generatePDFReport] Cannot generate: missing user or data');
        Alert.alert('Alert', 'No data to export. Please search first.');
        return;
      }

      console.log('[generatePDFReport] Generating table rows...');
      
      // Create HTML content for PDF
      const tableRows = users
        .map(
          (item, index) => {
            console.log(`[generatePDFReport] Processing row ${index}:`, item.fullname || item.username);
            const status = calculateStatus(item.loginTime, item.logoutTime);
            return `<tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.fullname || item.username}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.date || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${formatTime(item.loginTime)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${formatTime(item.logoutTime)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; color: ${status.color};">
                <strong>${status.status}</strong>
              </td>
            </tr>`;
          }
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2196F3; margin: 10px 0; font-size: 28px; }
              .header p { margin: 5px 0; color: #666; font-size: 14px; }
              .info-box { background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .info-box p { margin: 5px 0; font-size: 13px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #2196F3; color: white; padding: 12px; text-align: left; font-weight: bold; font-size: 13px; }
              td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .footer { margin-top: 30px; text-align: center; color: #999; font-size: 11px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Attendance Report</h1>
              <p><strong>User:</strong> ${user.fullname || user.username}</p>
              <p><strong>Report Type:</strong> ${selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)}</p>
            </div>

            <div class="info-box">
              <p><strong>Date Range:</strong> ${formatDate(startDate)} to ${formatDate(endDate)}</p>
              <p><strong>Total Records:</strong> ${users.length}</p>
              <p><strong>Generated on:</strong> ${formatDate(new Date())}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <div class="footer">
              <p>This is an automatically generated attendance report. Please verify with official records.</p>
              <p>Generated at: ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;

      console.log('[generatePDFReport] HTML content prepared');
      
      const fileName = `Attendance_${user.username}_${formatDate(new Date()).replace(/\//g, '-')}.pdf`;
      console.log('[generatePDFReport] PDF filename:', fileName);
      
      try {
        console.log('[generatePDFReport] Attempting to generate PDF using Print API...');
        
        // Check if Print is available
        if (!Print || typeof Print.printToFileAsync !== 'function') {
          console.warn('[generatePDFReport] Print.printToFileAsync not available, using fallback');
          throw new Error('Print API not available');
        }

        const pdfFile = await Print.printToFileAsync({
          html: html,
          base64: false,
        });

        console.log('[generatePDFReport] PDF generated at:', pdfFile.uri);

        // Determine save path
        const allFiles = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        console.log('[generatePDFReport] Documents directory accessible');

        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        console.log('[generatePDFReport] Saving to:', newPath);
        
        // Copy the PDF to documents
        await FileSystem.copyAsync({
          from: pdfFile.uri,
          to: newPath,
        });
        
        console.log('[generatePDFReport] PDF saved successfully');

        // Try to share the file
        const canShare = await Sharing.isAvailableAsync();
        console.log('[generatePDFReport] Sharing available:', canShare);
        
        if (canShare) {
          console.log('[generatePDFReport] Opening share dialog...');
          await Sharing.shareAsync(newPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Attendance Report',
            UTI: 'com.adobe.pdf',
          });
          console.log('[generatePDFReport] Share dialog completed');
        }

        Alert.alert('Success', `Attendance report generated!\n\nFile saved: ${fileName}`);
        console.log('[generatePDFReport] Success - PDF ready');

      } catch (printError) {
        console.error('[generatePDFReport] Print error:', printError.message);
        console.log('[generatePDFReport] Generating fallback HTML file...');
        
        // Fallback: Save as HTML file
        const htmlFileName = `Attendance_${user.username}_${formatDate(new Date()).replace(/\//g, '-')}.html`;
        const htmlPath = `${FileSystem.documentDirectory}${htmlFileName}`;
        
        console.log('[generatePDFReport] Saving HTML to:', htmlPath);
        await FileSystem.writeAsStringAsync(htmlPath, html, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        console.log('[generatePDFReport] HTML file saved');
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          console.log('[generatePDFReport] Sharing HTML file...');
          await Sharing.shareAsync(htmlPath, {
            mimeType: 'text/html',
            dialogTitle: 'Share Attendance Report',
          });
        }

        Alert.alert('Report Generated', `File saved as:\n${htmlFileName}\n\nYou can view it in your file manager or email it.`);
      }
      
    } catch (error) {
      console.error('[generatePDFReport] ERROR:', error.message);
      console.error('[generatePDFReport] Full error:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    }
  };

  const renderAttendanceRow = ({ item }) => {
    console.log('[renderAttendanceRow] Rendering item:', item.fullname || item.username);
    const statusInfo = calculateStatus(item.loginTime, item.logoutTime);
    console.log('[renderAttendanceRow] Status:', statusInfo.status);

    return (
      <Card style={styles.rowCard}>
        <Card.Content>
          <View style={styles.rowHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Icon name="account" size={28} color="#2196F3" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.fullname || item.username}</Text>
                <Text style={styles.userEmail}>{item.email || 'N/A'}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.color },
              ]}
            >
              <Text style={styles.statusText}>{statusInfo.status}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.rowContent}>
            <View style={styles.timeInfoContainer}>
              <View style={styles.timeBlock}>
                <Icon name="calendar" size={18} color="#666" />
                <Text style={styles.timeLabel}>Date</Text>
                <Text style={styles.timeValue}>{item.date}</Text>
              </View>

              <View style={styles.timeBlock}>
                <Icon name="login" size={18} color="#4caf50" />
                <Text style={styles.timeLabel}>Login</Text>
                <Text style={styles.timeValue}>{formatTime(item.timeIn)}</Text>
              </View>

              <View style={styles.timeBlock}>
                <Icon name="logout" size={18} color="#f44336" />
                <Text style={styles.timeLabel}>Logout</Text>
                <Text style={styles.timeValue}>{formatTime(item.timeOut)}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Attendance Management</Title>
              <Text style={styles.headerSubtitle}>Track and manage attendance details</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-check" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filters Card - Always visible */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Title style={styles.filterTitle}>Filters</Title>

          {/* User Type Dropdown */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>User Type</Text>
            <Menu
              visible={showUserTypeMenu}
              onDismiss={() => setShowUserTypeMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowUserTypeMenu(true)}
                  style={styles.dropdownButton}
                >
                  <Icon name="account-circle" size={20} color="#2196F3" />
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

          {/* Date Range Filters */}
          <View style={styles.dateRangeContainer}>
            {/* Start Date */}
            <View style={styles.dateFieldContainer}>
              <Text style={styles.filterLabel}>From Date</Text>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(!showStartDatePicker)}
                style={styles.dateButton}
              >
                <Icon name="calendar-start" size={18} color="#2196F3" />
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerTitle}>Select Start Date</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                      <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateInputRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(startDate);
                        newDate.setDate(newDate.getDate() - 1);
                        handleStartDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-left" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={styles.selectedDateDisplay}>{formatDate(startDate)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(startDate);
                        newDate.setDate(newDate.getDate() + 1);
                        handleStartDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-right" size={24} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* End Date */}
            <View style={styles.dateFieldContainer}>
              <Text style={styles.filterLabel}>To Date</Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(!showEndDatePicker)}
                style={styles.dateButton}
              >
                <Icon name="calendar-end" size={18} color="#2196F3" />
                <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerTitle}>Select End Date</Text>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                      <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateInputRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(endDate);
                        newDate.setDate(newDate.getDate() - 1);
                        handleEndDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-left" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={styles.selectedDateDisplay}>{formatDate(endDate)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(endDate);
                        newDate.setDate(newDate.getDate() + 1);
                        handleEndDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-right" size={24} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              onPress={fetchAttendance}
              style={styles.submitButton}
              loading={loading}
              icon="magnify"
            >
              Search
            </Button>
            <Button
              mode="outlined"
              onPress={generatePDFReport}
              style={styles.exportButton}
              icon="file-pdf-box"
              disabled={!hasSearched || users.length === 0}
            >
              Export PDF
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <Card style={styles.resultsCard}>
          <Card.Content>
            <View style={styles.resultsHeader}>
              <Title style={styles.resultsTitle}>Attendance Records</Title>
              <Chip
                style={styles.recordCount}
                icon="list-box"
              >
                {users.length} Records
              </Chip>
            </View>

            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                style={styles.loader}
              />
            ) : users.length > 0 ? (
              <FlatList
                data={users}
                renderItem={renderAttendanceRow}
                keyExtractor={(item, index) => item.userid?.toString() || index.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="inbox" size={48} color="#ccc" />
                <Text style={styles.noDataText}>No attendance records found</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

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
  filterCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    gap: 8,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  dateFieldContainer: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    gap: 8,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  datePickerContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e5fc',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  datePickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateNavButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  selectedDateDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  exportButton: {
    flex: 1,
    borderColor: '#2196F3',
  },
  resultsCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  recordCount: {
    backgroundColor: '#E3F2FD',
  },
  rowCard: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  rowContent: {
    marginTop: 8,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  loader: {
    marginVertical: 40,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  separator: {
    height: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default AttendanceScreen;
