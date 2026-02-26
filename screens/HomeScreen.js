import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  IconButton,
  Text,
  Menu,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    // Get user data from navigation params or AsyncStorage
    console.log('HomeScreen useEffect: Route params received:', route.params);
    if (route.params?.userData) {
      console.log('HomeScreen useEffect: Setting user data:', route.params.userData);
      setUser(route.params.userData);
    } else {
      console.log('HomeScreen useEffect: No userData found in route params');
    }
  }, [route.params]);

  const handleLogout = () => {
    console.log('handleLogout: Logout alert displayed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('handleLogout: User cancelled logout'),
        },
        {
          text: 'Logout',
          onPress: () => {
            console.log('handleLogout: User confirmed logout, navigating to Login screen');
            // Clear user data from AsyncStorage if needed
            // await AsyncStorage.removeItem('token');
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Attendance',
      icon: 'calendar-check',
      color: '#4CAF50',
      screen: 'Attendance',
    },
    {
      id: 2,
      title: 'Time Table',
      icon: 'calendar-clock',
      color: '#2196F3',
      screen: 'TimeTable',
    },
    {
      id: 3,
      title: 'Assignments',
      icon: 'book-open-page-variant',
      color: '#FF9800',
      screen: 'Assignments',
    },
    {
      id: 4,
      title: 'Grades',
      icon: 'chart-line',
      color: '#252425',
      screen: 'Grade',
    },
    {
      id: 5,
      title: 'Exams',
      icon: 'file-document-edit',
      color: '#F44336',
      screen: 'Exams',
    },
    {
      id: 6,
      title: 'Library',
      icon: 'library',
      color: '#009688',
      screen: 'Library',
    },
    {
      id: 7,
      title: 'Events',
      icon: 'calendar-star',
      color: '#E91E63',
      screen: 'Events',
    },
    {
      id: 8,
      title: 'Notifications',
      icon: 'bell',
      color: '#FF5722',
      screen: 'Notifications',
    },
    {
      id: 9,
      title: 'Fee Payment',
      icon: 'currency-usd',
      color: '#607D8B',
      screen: 'FeePayment',
    },
    {
      id: 10,
      title: 'Transport',
      icon: 'bus-school',
      color: '#FFC107',
      screen: 'Transport',
    },
    {
      id: 11,
      title: 'Messages',
      icon: 'message-text',
      color: '#00BCD4',
      screen: 'Messages',
    },
    {
      id: 12,
      title: 'Menu Items',
      icon: 'file-document',
      color: '#5E35B1',
      screen: 'MenuItems',
    },
    {
      id: 13,
      title: 'Settings',
      icon: 'cog',
      color: '#795548',
      screen: 'Settings',
    },
  ];

  const handleMenuPress = async (item) => {
    console.log('handleMenuPress: Item pressed:', item.title, 'Screen:', item.screen);
    
    // Handle different screens
    switch(item.screen) {
      case 'Attendance':
        try {
          let attendanceData;
          console.log('handleMenuPress: Fetching attendance data for usertype:', user?.usertype);

          if (user?.usertype === 'student') {
            const response = await axios.get('http://localhost:5000/api/attendance', {
              usertype: 'student',
              username: user.username,
            });
            attendanceData = response.data;
          } else if (user?.usertype === 'teacher') {
            const response = await axios.get('http://localhost:5000/api/attendance', {
              usertype: 'teacher',
            });
            attendanceData = response.data;
          } else if (user?.usertype === 'admin') {
            const response = await axios.get('http://localhost:5000/api/attendance/', {
              usertype: 'admin',
            });
            attendanceData = response.data;
          }

          navigation.navigate(item.screen, { userData: user, attendanceData });
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          Alert.alert('Error', 'Failed to fetch attendance data');
          navigation.navigate(item.screen, { userData: user });
        }
        break;

      case 'Grade':
        try {
          let gradesData;
          console.log('handleMenuPress: Fetching grades data for usertype:', user?.usertype);

          if (user?.usertype === 'student') {
            const response = await axios.get('http://localhost:5000/api/grades', {
              usertype: 'student',
              username: user.username,
            });
            gradesData = response.data;
          } else if (user?.usertype === 'teacher') {
            const response = await axios.get('http://localhost:5000/api/grades', {
              usertype: 'teacher',
            });
            gradesData = response.data;
          } else if (user?.usertype === 'admin') {
            const response = await axios.get('http://localhost:5000/api/grades/', {
              usertype: 'admin',
            });
            gradesData = response.data;
          }

          navigation.navigate(item.screen, { userData: user, gradesData });
        } catch (error) {
          console.error('Error fetching grades data:', error);
          Alert.alert('Error', 'Failed to fetch grades data');
          navigation.navigate(item.screen, { userData: user });
        }
        break;

      case 'TimeTable':
      case 'Assignments':
      case 'Exams':
      case 'Library':
      case 'FeePayment':
      case 'Transport':
      case 'Messages':
      case 'MenuItems':
        navigation.navigate(item.screen, { userData: user });
        break;

      case 'Settings':
        navigation.navigate(item.screen, { userData: user });
        break;

      default:
        console.log('handleMenuPress: Showing alert for:', item.title);
        Alert.alert(item.title, `Navigate to ${item.title} screen`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Avatar.Image 
            size={70}
            source={{
              uri: user?.profilePic || 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Title style={styles.userName}>
              {user?.username || 'Guest'}
            </Title>
            <Paragraph style={styles.userType}>
              {user?.usertype.toUpperCase() || 'STUDENT'}
            </Paragraph>
            
          </View>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              iconColor="#fff"
              size={28}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Profile', { userData: user });
            }}
            title="View Profile"
            leadingIcon="account"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ProfileDetails', { userData: user });
            }}
            title="Edit Profile"
            leadingIcon="account-edit"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
            title="Logout"
            leadingIcon="logout"
            titleStyle={{ color: '#F44336' }}
          />
        </Menu>
      </View>

      {/* School Menu Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Quick Stats</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>95%</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8.5</Text>
                <Text style={styles.statLabel}>GPA</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Assignments</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Notifications */}
        <Card style={styles.notificationCard}>
          <Card.Content>
            <Title>Recent Notifications</Title>
            <View style={styles.notification}>
              <Icon name="bell" size={20} color="#FF9800" />
              <Text style={styles.notificationText}>
                Math exam scheduled for next Monday
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.notification}>
              <Icon name="bell" size={20} color="#4CAF50" />
              <Text style={styles.notificationText}>
                New assignment posted in Science
              </Text>
            </View>
          </Card.Content>
        </Card>
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
    backgroundColor: '#6200ee',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#fff',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userType: {
    color: '#e0e0e0',
    fontSize: 12,
    marginBottom: 2,
  },
  userEmail: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  statsCard: {
    margin: 15,
    marginTop: 5,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  notificationCard: {
    margin: 15,
    marginTop: 5,
    elevation: 2,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  notificationText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  divider: {
    marginVertical: 5,
  },
});

export default HomeScreen;