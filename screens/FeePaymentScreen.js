import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const FeePaymentScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/fees');
      setFeesData(response.data.data || []);
    } catch (error) {
      setFeesData([
        { feeid: '1', month: 'January', amount: '5000', status: 'Paid', duedate: '2024-01-15' },
        { feeid: '2', month: 'February', amount: '5000', status: 'Pending', duedate: '2024-02-15' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchFees();
  }, [user]);

  const renderFeeRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.month || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>Rs. {item.amount || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={[styles.cellText, { color: item.status === 'Paid' ? '#4CAF50' : '#F44336' }]}>
          {item.status || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity onPress={() => navigation.navigate('FeePaymentDetail', { userData: user, feeData: item })} style={styles.viewButton}>
          <Icon name="eye" size={20} color="#607D8B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Fee Payment</Title>
          <Divider style={styles.divider} />
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}><Text style={styles.headerText}>Month</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Amount</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Status</Text></View>
                <View style={styles.tableCellAction}><Text style={styles.headerText}>Action</Text></View>
              </View>
              {feesData.length > 0 ? (
                <FlatList data={feesData} renderItem={renderFeeRow} keyExtractor={(item) => item.feeid?.toString()} scrollEnabled={false} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No fees found</Text>
                </View>
              )}
            </>
          )}
          <Button mode="contained" onPress={fetchFees} style={styles.refreshButton} loading={loading}>Refresh</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#ECEFF1', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#607D8B' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', marginBottom: 2 },
  tableCell: { flex: 1, justifyContent: 'center' },
  tableCellAction: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontWeight: '600', fontSize: 12, color: '#455A64' },
  cellText: { fontSize: 12, color: '#333' },
  viewButton: { padding: 8, backgroundColor: '#ECEFF1', borderRadius: 4 },
  loader: { marginVertical: 20 },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { marginTop: 12, fontSize: 14, color: '#999' },
  refreshButton: { marginTop: 16, backgroundColor: '#607D8B' },
});

export default FeePaymentScreen;
