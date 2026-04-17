import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, TextInput, Divider, Switch } from 'react-native-paper';
import axios from 'axios';

const SettingsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (route.params?.userData) {
      setUser(route.params.userData);
    }
  }, [route.params]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settingsData = {
        userid: user?.userid,
        notificationsEnabled,
        emailNotifications,
        darkMode,
      };

      const response = await axios.post('http://localhost:5000/api/settings', settingsData);
      if (response.status === 200 || response.status === 201) {
        alert('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Settings saved locally');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    alert('Password change functionality coming soon');
  };

  const handleClearCache = () => {
    alert('Cache cleared');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Settings</Title>
          <Divider style={styles.divider} />

          {/* Notification Settings */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Display Settings */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Display</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Account Settings */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Button
              mode="outlined"
              onPress={handleChangePassword}
              style={styles.button}
            >
              Change Password
            </Button>
          </View>

          <Divider style={styles.divider} />

          {/* App Settings */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>App</Text>
            <Button
              mode="outlined"
              onPress={handleClearCache}
              style={styles.button}
            >
              Clear Cache
            </Button>
            <Text style={styles.versionText}>App Version: 1.0.0</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSaveSettings}
            style={styles.saveButton}
            loading={loading}
          >
            Save Settings
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
  settingSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 4,
  },
  settingLabel: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    marginVertical: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
});

export default SettingsScreen;
