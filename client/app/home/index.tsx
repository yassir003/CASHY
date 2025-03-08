import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import BottomNavbar from '@/components/BottomNavbar'; // Adjust the import path as needed

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent} // Add padding to the content
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.userName}>Amine</Text>
        </View>

        {/* Total Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$10,000.80</Text>
        </View>

        {/* Send + Add Money Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Spending */}
        <View style={styles.metricContainer}>
          <Text style={styles.metricLabel}>Monthly Spending</Text>
          <Text style={styles.metricValue}>$3,482.55</Text>
          <Text style={styles.metricSubtext}>+2.3% from last month</Text>
        </View>

        {/* Monthly Saving */}
        <View style={styles.metricContainer}>
          <Text style={styles.metricLabel}>Monthly Saving</Text>
          <Text style={styles.metricValue}>$1,258.90</Text>
          <Text style={styles.metricSubtext}>+4.8% from last month</Text>
        </View>

        {/* Recent Transactions Header */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionHeaderText}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions List */}
        <View style={styles.transactionList}>
          {/* Transaction 1 */}
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTitle}>Salary Deposit</Text>
            <Text style={styles.transactionTime}>Today, 12:30 PM</Text>
            <Text style={styles.transactionAmountPositive}>+$5,000.00</Text>
          </View>
          <View style={styles.separator} />

          {/* Transaction 2 */}
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTitle}>Amazon Purchase</Text>
            <Text style={styles.transactionTime}>Today, 10:15 AM</Text>
            <Text style={styles.transactionAmountNegative}>-$129.99</Text>
          </View>
          <View style={styles.separator} />

          {/* Transaction 3 */}
          <View style={styles.transactionItem}>
            <Text style={styles.transactionTitle}>Netflix Subscription</Text>
            <Text style={styles.transactionTime}>Yesterday, 3:20 PM</Text>
            <Text style={styles.transactionAmountNegative}>-$14.99</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding equal to the height of the BottomNavbar
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: '#1e40af',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#1e40af',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#1e40af',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  metricSubtext: {
    fontSize: 14,
    color: '#4caf50', // Green for positive change
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  transactionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#1e40af',
  },
  transactionList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  transactionItem: {
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionTime: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmountPositive: {
    fontSize: 16,
    color: '#4caf50', // Green for positive amounts
    fontWeight: 'bold',
  },
  transactionAmountNegative: {
    fontSize: 16,
    color: '#f44336', // Red for negative amounts
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});

export default HomeScreen;