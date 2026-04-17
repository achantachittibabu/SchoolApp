import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Picker,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Divider,
  Appbar,
  Checkbox,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

const ProfileDetailsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [aadharCard, setAadharCard] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfJoin, setDateOfJoin] = useState('');
  const [grade, setGrade] = useState('');
  const [classValue, setClassValue] = useState('');
  const [classTeacher, setClassTeacher] = useState('');

  // Parent Information
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherAadhar, setFatherAadhar] = useState('');
  const [motherAadhar, setMotherAadhar] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');

  // Present Address
  const [addressType, setAddressType] = useState('present');
  const [presentHouseNo, setPresentHouseNo] = useState('');
  const [presentStreet, setPresentStreet] = useState('');
  const [presentArea, setPresentArea] = useState('');
  const [presentLandmark, setPresentLandmark] = useState('');
  const [presentDistrict, setPresentDistrict] = useState('');
  const [presentState, setPresentState] = useState('');
  const [presentPincode, setPresentPincode] = useState('');
  const [presentPhone, setPresentPhone] = useState('');
  const [sameAddress, setSameAddress] = useState(false);

  // Permanent Address
  const [permanentHouseNo, setPermanentHouseNo] = useState('');
  const [permanentStreet, setPermanentStreet] = useState('');
  const [permanentArea, setPermanentArea] = useState('');
  const [permanentLandmark, setPermanentLandmark] = useState('');
  const [permanentDistrict, setPermanentDistrict] = useState('');
  const [permanentState, setPermanentState] = useState('');
  const [permanentPincode, setPermanentPincode] = useState('');
  const [permanentPhone, setPermanentPhone] = useState('');

  // Documents and Approval
  const [aadharUpload, setAadharUpload] = useState('');
  const [fatherMotherAadharUpload, setFatherMotherAadharUpload] = useState('');
  const [isProfileApproved, setIsProfileApproved] = useState(false);

  // Snackbar for notifications
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    console.log('ProfileDetailsScreen useEffect: Route params received:', route.params);
    if (route.params?.userData) {
      setUser(route.params.userData);
    }

    if (route.params?.profileData) {
      const data = route.params.profileData;
      console.log('ProfileDetailsScreen useEffect: Setting profile data:', data);
      setProfileData(data);

      // Populate form fields
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setDateOfBirth(data.dateOfBirth || '');
      setAadharCard(data.aadharCard || '');
      setContactNumber(data.contactNumber || '');
      setDateOfJoin(data.dateOfJoin || '');
      setGrade(data.grade || '');
      setClassValue(data.class || '');
      setClassTeacher(data.classTeacher || '');

      setFatherName(data.fatherName || '');
      setMotherName(data.motherName || '');
      setFatherAadhar(data.fatherAadhar || '');
      setMotherAadhar(data.motherAadhar || '');
      setFatherOccupation(data.fatherOccupation || '');

      setAddressType(data.addressType || 'present');
      setPresentHouseNo(data.presentHouseNo || '');
      setPresentStreet(data.presentStreet || '');
      setPresentArea(data.presentArea || '');
      setPresentLandmark(data.presentLandmark || '');
      setPresentDistrict(data.presentDistrict || '');
      setPresentState(data.presentState || '');
      setPresentPincode(data.presentPincode || '');
      setPresentPhone(data.presentPhone || '');
      setSameAddress(data.sameAddress || false);

      setPermanentHouseNo(data.permanentHouseNo || '');
      setPermanentStreet(data.permanentStreet || '');
      setPermanentArea(data.permanentArea || '');
      setPermanentLandmark(data.permanentLandmark || '');
      setPermanentDistrict(data.permanentDistrict || '');
      setPermanentState(data.permanentState || '');
      setPermanentPincode(data.permanentPincode || '');
      setPermanentPhone(data.permanentPhone || '');

      setAadharUpload(data.aadharUpload || '');
      setFatherMotherAadharUpload(data.fatherMotherAadharUpload || '');
      setIsProfileApproved(data.isProfileApproved || false);
    }
  }, [route.params]);

  const handleEdit = () => {
    console.log('handleEdit called, switching to edit mode');
    setIsEditMode(true);
  };

  const handleCancel = () => {
    console.log('handleCancel called, discarding changes');
    setIsEditMode(false);
  };

  const handleSave = async () => {
    console.log('handleSave called');

    // Validation
    if (!firstName.trim()) {
      showSnackbar('First Name is required', 'error');
      return;
    }

    if (!lastName.trim()) {
      showSnackbar('Last Name is required', 'error');
      return;
    }

    if (!contactNumber.trim()) {
      showSnackbar('Contact Number is required', 'error');
      return;
    }

    setLoading(true);
    try {
      // Create organized data structure
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        aadharCard: aadharCard.trim(),
        contactNumber: contactNumber.trim(),
        dateOfJoin,
        grade,
        class: classValue,
        classTeacher,
      };

      const responsepro = await axios.put(
        `http://localhost:5000/api/profile/${user.userid}`,
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('handleSave: API Response received:', responsepro.data);


      const parentData = {
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        fatherAadhar: fatherAadhar.trim(),
        motherAadhar: motherAadhar.trim(),
        fatherOccupation: fatherOccupation.trim(),
      };

      const responseparent = await axios.put(
        `http://localhost:5000/api/parent/${user.userid}`,
        parentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('handleSave: API Response received:', responseparent.data);


      const presentAddressData = {
        addressType,
        presentHouseNo: presentHouseNo.trim(),
        presentStreet: presentStreet.trim(),
        presentArea: presentArea.trim(),
        presentLandmark: presentLandmark.trim(),
        presentDistrict: presentDistrict.trim(),
        presentState: presentState.trim(),
        presentPincode: presentPincode.trim(),
        presentPhone: presentPhone.trim(),
      };

      const responsepresent = await axios.put(
        `http://localhost:5000/api/address/${user.userid}`,
        presentAddressData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('handleSave: API Response received:', responsepresent.data);


      const permanentAddressData = sameAddress
        ? presentAddressData
        : {
            addressType,
            permanentHouseNo: permanentHouseNo.trim(),
            permanentStreet: permanentStreet.trim(),
            permanentArea: permanentArea.trim(),
            permanentLandmark: permanentLandmark.trim(),
            permanentDistrict: permanentDistrict.trim(),
            permanentState: permanentState.trim(),
            permanentPincode: permanentPincode.trim(),
            permanentPhone: permanentPhone.trim(),
          };
      if (!sameAddress) {

        const responsepermanent = await axios.put(
        `http://localhost:5000/api/address/${user.userid}`,
        permanentAddressData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('handleSave: API Response received:', responsepermanent.data);
      }

      const documentsData = {
        aadharUpload: aadharUpload.trim(),
        fatherMotherAadharUpload: fatherMotherAadharUpload.trim(),
        isProfileApproved,
        sameAddress,
      };

      const responsedocuments = await axios.put(
        `http://localhost:5000/api/documents/${user.userid}`,
        documentsData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('handleSave: API Response received:', responsedocuments.data);


      const completeProfileData = {
        ...userData,
        ...parentData,
        ...presentAddressData,
        ...permanentAddressData,
        ...documentsData,
      };

      console.log('handleSave: Organized profile data:', completeProfileData);
      console.log('handleSave: Sending data to API endpoint:', `http://localhost:5000/api/users/${user.userid}`);

      

     
      // Show success notification
      showSnackbar('Profile updated successfully!', 'success');

      setTimeout(() => {
        setIsEditMode(false);
        setProfileData(completeProfileData);
        
        // Navigate back to Home page
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
              params: {
                userData: { ...user, ...completeProfileData },
                profileData: completeProfileData,
              },
            },
          ],
        });
      }, 1500);
    } catch (error) {
      console.error('handleSave: Update failed:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to update profile. Please try again.';
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isEditMode) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel discard'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              setIsEditMode(false);
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const pickAadharFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (result.type === 'success') {
        setAadharUpload(result.uri);
        showSnackbar('Aadhar file selected successfully', 'success');
      } else {
        console.log('File selection cancelled');
      }
    } catch (err) {
      console.error('Error picking file:', err);
      showSnackbar('Error selecting file', 'error');
    }
  };

  const pickFatherMotherAadharFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (result.type === 'success') {
        setFatherMotherAadharUpload(result.uri);
        showSnackbar('File selected successfully', 'success');
      } else {
        console.log('File selection cancelled');
      }
    } catch (err) {
      console.error('Error picking file:', err);
      showSnackbar('Error selecting file', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={isEditMode ? 'Edit Profile' : 'Profile Details'} />
        {!isEditMode && <Appbar.Action icon="pencil" onPress={handleEdit} />}
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Personal Information Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Personal Information</Title>

            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="account" />}
            />

            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="account" />}
            />

            <TextInput
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              left={<TextInput.Icon name="calendar" />}
            />

            <TextInput
              label="Aadhar Card"
              value={aadharCard}
              onChangeText={setAadharCard}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              placeholder="12-digit Aadhar number"
              style={styles.input}
              left={<TextInput.Icon name="card-account-details" />}
            />

            <TextInput
              label="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon name="phone" />}
            />

            <TextInput
              label="Date of Join"
              value={dateOfJoin}
              onChangeText={setDateOfJoin}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              left={<TextInput.Icon name="calendar" />}
            />

            <TextInput
              label="Grade"
              value={grade}
              onChangeText={setGrade}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="bookmark" />}
            />

            <TextInput
              label="Class"
              value={classValue}
              onChangeText={setClassValue}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="book" />}
            />

            <TextInput
              label="Class Teacher"
              value={classTeacher}
              onChangeText={setClassTeacher}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="human-greeting-variant" />}
            />
          </Card.Content>
        </Card>

        {/* Parent Information Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Parent Information</Title>

            <TextInput
              label="Father Name"
              value={fatherName}
              onChangeText={setFatherName}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="account" />}
            />

            <TextInput
              label="Mother Name"
              value={motherName}
              onChangeText={setMotherName}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="account" />}
            />

            <TextInput
              label="Father Aadhar Card"
              value={fatherAadhar}
              onChangeText={setFatherAadhar}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              placeholder="12-digit Aadhar number"
              style={styles.input}
              left={<TextInput.Icon name="card-account-details" />}
            />

            <TextInput
              label="Mother Aadhar Card"
              value={motherAadhar}
              onChangeText={setMotherAadhar}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              placeholder="12-digit Aadhar number"
              style={styles.input}
              left={<TextInput.Icon name="card-account-details" />}
            />

            <TextInput
              label="Father Occupation"
              value={fatherOccupation}
              onChangeText={setFatherOccupation}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="briefcase" />}
            />
          </Card.Content>
        </Card>

        {/* Present Address Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Present Address</Title>

            <Text style={styles.label}>Address Type</Text>
            {isEditMode ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={addressType}
                  onValueChange={(itemValue) => setAddressType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Present" value="present" />
                  <Picker.Item label="Permanent" value="permanent" />
                </Picker>
              </View>
            ) : (
              <Text style={styles.pickerText}>
                {addressType === 'present' ? 'Present' : 'Permanent'}
              </Text>
            )}

            <TextInput
              label="House No."
              value={presentHouseNo}
              onChangeText={setPresentHouseNo}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="home" />}
            />

            <TextInput
              label="Street Name"
              value={presentStreet}
              onChangeText={setPresentStreet}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="road" />}
            />

            <TextInput
              label="Area Name"
              value={presentArea}
              onChangeText={setPresentArea}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="map-marker" />}
            />

            <TextInput
              label="Land Mark"
              value={presentLandmark}
              onChangeText={setPresentLandmark}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="landmark" />}
            />

            <TextInput
              label="District Name"
              value={presentDistrict}
              onChangeText={setPresentDistrict}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="map" />}
            />

            <TextInput
              label="State Name"
              value={presentState}
              onChangeText={setPresentState}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              style={styles.input}
              left={<TextInput.Icon name="map" />}
            />

            <TextInput
              label="Pincode"
              value={presentPincode}
              onChangeText={setPresentPincode}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              keyboardType="numeric"
              style={styles.input}
              left={<TextInput.Icon name="mailbox" />}
            />

            <TextInput
              label="Phone Number"
              value={presentPhone}
              onChangeText={setPresentPhone}
              editable={isEditMode}
              mode={isEditMode ? 'outlined' : 'flat'}
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon name="phone" />}
            />

            {isEditMode && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={sameAddress ? 'checked' : 'unchecked'}
                  onPress={() => setSameAddress(!sameAddress)}
                />
                <Text style={styles.checkboxLabel}>Same as Permanent Address</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Permanent Address Section */}
        {!sameAddress && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Permanent Address</Title>

              <TextInput
                label="House No."
                value={permanentHouseNo}
                onChangeText={setPermanentHouseNo}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="home" />}
              />

              <TextInput
                label="Street Name"
                value={permanentStreet}
                onChangeText={setPermanentStreet}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="road" />}
              />

              <TextInput
                label="Area Name"
                value={permanentArea}
                onChangeText={setPermanentArea}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="map-marker" />}
              />

              <TextInput
                label="Land Mark"
                value={permanentLandmark}
                onChangeText={setPermanentLandmark}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="landmark" />}
              />

              <TextInput
                label="District Name"
                value={permanentDistrict}
                onChangeText={setPermanentDistrict}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="map" />}
              />

              <TextInput
                label="State Name"
                value={permanentState}
                onChangeText={setPermanentState}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                style={styles.input}
                left={<TextInput.Icon name="map" />}
              />

              <TextInput
                label="Pincode"
                value={permanentPincode}
                onChangeText={setPermanentPincode}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                keyboardType="numeric"
                style={styles.input}
                left={<TextInput.Icon name="mailbox" />}
              />

              <TextInput
                label="Phone Number"
                value={permanentPhone}
                onChangeText={setPermanentPhone}
                editable={isEditMode}
                mode={isEditMode ? 'outlined' : 'flat'}
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon name="phone" />}
              />
            </Card.Content>
          </Card>
        )}

        {/* Documents and Approval Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Documents & Approval</Title>

            <Button
              icon="file-upload"
              mode="outlined"
              onPress={pickAadharFile}
              disabled={!isEditMode}
              style={styles.uploadButton}
              labelStyle={styles.uploadButtonLabel}
            >
              {aadharUpload ? 'Aadhar Card Selected ✓' : 'Select Aadhar Card'}
            </Button>
            {aadharUpload && <Text style={styles.selectedFileText}>{aadharUpload}</Text>}

            <Divider style={styles.divider} />

            <Button
              icon="file-upload"
              mode="outlined"
              onPress={pickFatherMotherAadharFile}
              disabled={!isEditMode}
              style={styles.uploadButton}
              labelStyle={styles.uploadButtonLabel}
            >
              {fatherMotherAadharUpload ? 'Father/Mother Aadhar Selected ✓' : 'Select Father/Mother Aadhar'}
            </Button>
            {fatherMotherAadharUpload && <Text style={styles.selectedFileText}>{fatherMotherAadharUpload}</Text>}

            {isEditMode && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={isProfileApproved ? 'checked' : 'unchecked'}
                  onPress={() => setIsProfileApproved(!isProfileApproved)}
                />
                <Text style={styles.checkboxLabel}>Is Profile Approved?</Text>
              </View>
            )}
            {!isEditMode && (
              <View style={styles.approvalStatus}>
                <Icon 
                  name={isProfileApproved ? 'check-circle' : 'alert-circle'} 
                  size={24} 
                  color={isProfileApproved ? '#4CAF50' : '#FFC107'} 
                />
                <Text style={[styles.approvalText, { color: isProfileApproved ? '#4CAF50' : '#FFC107' }]}>
                  {isProfileApproved ? 'Profile Approved' : 'Pending Approval'}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {isEditMode ? (
            <>
              <Button
                icon="content-save"
                mode="contained"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                style={[styles.button, styles.saveButton]}
                labelStyle={styles.buttonLabel}
              >
                Save Changes
              </Button>
              <Button
                icon="close"
                mode="outlined"
                onPress={handleCancel}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.cancelButtonLabel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              icon="pencil"
              mode="contained"
              onPress={handleEdit}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Edit Profile
            </Button>
          )}
        </View>
      </ScrollView>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'success' ? '#4CAF50' : '#F44336',
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    paddingVertical: 8,
  },
  approvalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 8,
  },
  approvalText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    marginVertical: 8,
    borderColor: '#6200EE',
  },
  uploadButtonLabel: {
    fontSize: 14,
    color: '#6200EE',
  },
  selectedFileText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    gap: 12,
  },
  button: {
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonLabel: {
    fontSize: 16,
  },
  cancelButtonLabel: {
    fontSize: 16,
    color: '#E53935',
  },
});

export default ProfileDetailsScreen;
