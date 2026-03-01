import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Text,
  Appbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ProfileScreen useEffect: Route params received:', route.params);
    if (route.params?.userData) {
      setUser(route.params.userData);
      // Set profile data from userData
      setProfileData({
        firstName: route.params.userData.firstName || 'N/A',
        lastName: route.params.userData.lastName || 'N/A',
        profilePic: route.params.userData.profilePic || null,
        dateOfBirth: route.params.userData.dateOfBirth || 'N/A',
        aadharCard: route.params.userData.aadharCard || 'N/A',
        contactNumber: route.params.userData.contactNumber || 'N/A',
        dateOfJoin: route.params.userData.dateOfJoin || 'N/A',
        grade: route.params.userData.grade || 'N/A',
        class: route.params.userData.class || 'N/A',
        classTeacher: route.params.userData.classTeacher || 'N/A',
        fatherName: route.params.userData.fatherName || 'N/A',
        motherName: route.params.userData.motherName || 'N/A',
        fatherAadhar: route.params.userData.fatherAadhar || 'N/A',
        motherAadhar: route.params.userData.motherAadhar || 'N/A',
        fatherOccupation: route.params.userData.fatherOccupation || 'N/A',
        presentHouseNo: route.params.userData.presentHouseNo || 'N/A',
        presentStreet: route.params.userData.presentStreet || 'N/A',
        presentArea: route.params.userData.presentArea || 'N/A',
        presentLandmark: route.params.userData.presentLandmark || 'N/A',
        presentDistrict: route.params.userData.presentDistrict || 'N/A',
        presentState: route.params.userData.presentState || 'N/A',
        presentPincode: route.params.userData.presentPincode || 'N/A',
        presentPhone: route.params.userData.presentPhone || 'N/A',
        permanentHouseNo: route.params.userData.permanentHouseNo || 'N/A',
        permanentStreet: route.params.userData.permanentStreet || 'N/A',
        permanentArea: route.params.userData.permanentArea || 'N/A',
        permanentLandmark: route.params.userData.permanentLandmark || 'N/A',
        permanentDistrict: route.params.userData.permanentDistrict || 'N/A',
        permanentState: route.params.userData.permanentState || 'N/A',
        permanentPincode: route.params.userData.permanentPincode || 'N/A',
        permanentPhone: route.params.userData.permanentPhone || 'N/A',
        isProfileApproved: route.params.userData.isProfileApproved || false,
        userType: route.params.userData.userType || 'Student',
      });
    }
  }, [route.params]);

  const handleEditProfile = () => {
    console.log('handleEditProfile: Navigating to ProfileDetails');
    navigation.navigate('ProfileDetails', {
      userData: user,
      profileData: profileData,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Icon name={icon} size={20} color="#6200EE" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="My Profile" />
        <Appbar.Action icon="pencil" onPress={handleEditProfile} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Profile Header Section */}
        <View style={styles.headerSection}>
          {profileData?.profilePic ? (
            <Avatar.Image
              size={100}
              source={{ uri: profileData.profilePic }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={100}
              label={profileData?.firstName
                ?.charAt(0)
                .concat(profileData?.lastName?.charAt(0) || '')
                .toUpperCase() || 'U'}
              style={styles.avatar}
            />
          )}
          <Title style={styles.userName}>
            {profileData?.firstName} {profileData?.lastName}
          </Title>
          <Text style={styles.userType}>{profileData?.userType || 'Student'}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Personal Information Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Personal Information</Title>
            <InfoRow icon="account" label="First Name" value={profileData?.firstName || 'N/A'} />
            <InfoRow icon="account" label="Last Name" value={profileData?.lastName || 'N/A'} />
            <InfoRow icon="calendar" label="Date of Birth" value={profileData?.dateOfBirth || 'N/A'} />
            <InfoRow icon="card-account-details" label="Aadhar Card" value={profileData?.aadharCard || 'N/A'} />
            <InfoRow icon="phone" label="Contact Number" value={profileData?.contactNumber || 'N/A'} />
            <InfoRow icon="calendar-plus" label="Date of Join" value={profileData?.dateOfJoin || 'N/A'} />
            <InfoRow icon="bookmark" label="Grade" value={profileData?.grade || 'N/A'} />
            <InfoRow icon="book" label="Class" value={profileData?.class || 'N/A'} />
            <InfoRow icon="human-greeting-variant" label="Class Teacher" value={profileData?.classTeacher || 'N/A'} />
          </Card.Content>
        </Card>

        {/* Parent Information Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Parent Information</Title>
            <InfoRow icon="account" label="Father Name" value={profileData?.fatherName || 'N/A'} />
            <InfoRow icon="account" label="Mother Name" value={profileData?.motherName || 'N/A'} />
            <InfoRow icon="card-account-details" label="Father Aadhar" value={profileData?.fatherAadhar || 'N/A'} />
            <InfoRow icon="card-account-details" label="Mother Aadhar" value={profileData?.motherAadhar || 'N/A'} />
            <InfoRow icon="briefcase" label="Father Occupation" value={profileData?.fatherOccupation || 'N/A'} />
          </Card.Content>
        </Card>

        {/* Present Address Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Present Address</Title>
            <InfoRow icon="home" label="House No." value={profileData?.presentHouseNo || 'N/A'} />
            <InfoRow icon="road" label="Street Name" value={profileData?.presentStreet || 'N/A'} />
            <InfoRow icon="map-marker" label="Area Name" value={profileData?.presentArea || 'N/A'} />
            <InfoRow icon="landmark" label="Land Mark" value={profileData?.presentLandmark || 'N/A'} />
            <InfoRow icon="map" label="District" value={profileData?.presentDistrict || 'N/A'} />
            <InfoRow icon="map" label="State" value={profileData?.presentState || 'N/A'} />
            <InfoRow icon="mailbox" label="Pincode" value={profileData?.presentPincode || 'N/A'} />
            <InfoRow icon="phone" label="Phone Number" value={profileData?.presentPhone || 'N/A'} />
          </Card.Content>
        </Card>

        {/* Permanent Address Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Permanent Address</Title>
            <InfoRow icon="home" label="House No." value={profileData?.permanentHouseNo || 'N/A'} />
            <InfoRow icon="road" label="Street Name" value={profileData?.permanentStreet || 'N/A'} />
            <InfoRow icon="map-marker" label="Area Name" value={profileData?.permanentArea || 'N/A'} />
            <InfoRow icon="landmark" label="Land Mark" value={profileData?.permanentLandmark || 'N/A'} />
            <InfoRow icon="map" label="District" value={profileData?.permanentDistrict || 'N/A'} />
            <InfoRow icon="map" label="State" value={profileData?.permanentState || 'N/A'} />
            <InfoRow icon="mailbox" label="Pincode" value={profileData?.permanentPincode || 'N/A'} />
            <InfoRow icon="phone" label="Phone Number" value={profileData?.permanentPhone || 'N/A'} />
          </Card.Content>
        </Card>

        {/* Approval Status Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Approval Status</Title>
            <View style={styles.approvalContainer}>
              <Icon 
                name={profileData?.isProfileApproved ? 'check-circle' : 'alert-circle'} 
                size={32} 
                color={profileData?.isProfileApproved ? '#4CAF50' : '#FFC107'} 
              />
              <Text style={[
                styles.approvalText,
                { color: profileData?.isProfileApproved ? '#4CAF50' : '#FFC107' }
              ]}>
                {profileData?.isProfileApproved ? 'Profile Approved' : 'Pending Approval'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Edit Button */}
        <View style={styles.buttonContainer}>
          <Button
            icon="pencil"
            mode="contained"
            onPress={handleEditProfile}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Edit Profile
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
    backgroundColor: '#6200EE',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  avatar: {
    backgroundColor: '#6200EE',
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#6200EE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  approvalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  approvalText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonContainer: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  button: {
    paddingVertical: 8,
    backgroundColor: '#6200EE',
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default ProfileScreen;
