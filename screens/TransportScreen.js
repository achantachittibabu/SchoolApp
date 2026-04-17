import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const TransportScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transport');
      setTransportData(response.data.data || []);
    } catch (error) {
      setTransportData([
        { transportid: '1', route: 'Route A', busno: 'BUS001', pickuptime: '07:30 AM', status: 'Active' },
        { transportid: '2', route: 'Route B', busno: 'BUS002', pickuptime: '08:00 AM', status: 'Active' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTransport();
  }, [user]);

  const renderTransportRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.route || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.busno || 'N/A'}</Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity onPress={() => navigation.navigate('TransportDetail', { userData: user, transportData: item })} style={styles.viewButton}>
          <Icon name="eye" size={20} color="#FFC107" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Transport</Title>
          <Divider style={styles.divider} />
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}><Text style={styles.headerText}>Route</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Bus No</Text></View>
                <View style={styles.tableCellAction}><Text style={styles.headerText}>Action</Text></View>
              </View>
              {transportData.length > 0 ? (
                <FlatList data={transportData} renderItem={renderTransportRow} keyExtractor={(item) => item.transportid?.toString()} scrollEnabled={false} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No transport found</Text>
                </View>
              )}
            </>
          )}
          <Button mode="contained" onPress={fetchTransport} style={styles.refreshButton} loading={loading}>Refresh</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#FFF9C4', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#FBC02D' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', marginBottom: 2 },
  tableCell: { flex: 1, justifyContent: 'center' },
  tableCellAction: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontWeight: '600', fontSize: 12, color: '#F57F17' },
  cellText: { fontSize: 12, color: '#333' },
  viewButton: { padding: 8, backgroundColor: '#FFF9C4', borderRadius: 4 },
  loader: { marginVertical: 20 },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { marginTop: 12, fontSize: 14, color: '#999' },
  refreshButton: { marginTop: 16, backgroundColor: '#FFC107' },
});

export default TransportScreen;
