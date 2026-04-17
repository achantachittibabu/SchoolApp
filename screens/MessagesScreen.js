import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const MessagesScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessagesData(response.data.data || []);
    } catch (error) {
      setMessagesData([
        { messageid: '1', sender: 'Admin', subject: 'Welcome', date: '2024-02-10', read: false },
        { messageid: '2', sender: 'Teacher', subject: 'Assignment', date: '2024-02-12', read: true },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const renderMessageRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.sender || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={[styles.cellText, { fontWeight: item.read ? '400' : '700' }]}>
          {item.subject || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.date || 'N/A'}</Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity onPress={() => navigation.navigate('MessageDetail', { userData: user, messageData: item })} style={styles.viewButton}>
          <Icon name="eye" size={20} color="#00BCD4" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Messages</Title>
          <Divider style={styles.divider} />
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}><Text style={styles.headerText}>From</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Subject</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.tableCellAction}><Text style={styles.headerText}>Action</Text></View>
              </View>
              {messagesData.length > 0 ? (
                <FlatList data={messagesData} renderItem={renderMessageRow} keyExtractor={(item) => item.messageid?.toString()} scrollEnabled={false} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No messages</Text>
                </View>
              )}
            </>
          )}
          <Button mode="contained" onPress={fetchMessages} style={styles.refreshButton} loading={loading}>Refresh</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#E0F2F1', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#00BCD4' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', marginBottom: 2 },
  tableCell: { flex: 1, justifyContent: 'center' },
  tableCellAction: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontWeight: '600', fontSize: 12, color: '#00838F' },
  cellText: { fontSize: 12, color: '#333' },
  viewButton: { padding: 8, backgroundColor: '#E0F2F1', borderRadius: 4 },
  loader: { marginVertical: 20 },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { marginTop: 12, fontSize: 14, color: '#999' },
  refreshButton: { marginTop: 16, backgroundColor: '#00BCD4' },
});

export default MessagesScreen;
