import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Send, Plus, Wallet } from 'lucide-react-native'; // Assuming you have lucide-react-native for icons
// import { Header } from '@/components/header'; // Ensure this is adapted for React Native

const Home = () => {
  const recentTransactions = [
    {
      name: "Salary Deposit",
      date: "Today, 12:30 PM",
      amount: "5,000.00",
      type: "credit",
    },
    {
      name: "Amazon Purchase",
      date: "Today, 10:15 AM",
      amount: "129.99",
      type: "debit",
    },
    {
      name: "Netflix Subscription",
      date: "Yesterday, 3:20 PM",
      amount: "14.99",
      type: "debit",
    },
    {
      name: "Netflix Subscription",
      date: "Yesterday, 3:20 PM",
      amount: "14.99",
      type: "debit",
    },
    {
      name: "Netflix Subscription",
      date: "Yesterday, 3:20 PM",
      amount: "14.99",
      type: "debit",
    },
    {
      name: "Netflix Subscription",
      date: "Yesterday, 3:20 PM",
      amount: "14.99",
      type: "debit",
    },
    {
      name: "Netflix Subscription",
      date: "Yesterday, 3:20 PM",
      amount: "14.99",
      type: "debit",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* <Header showProfile={true} /> */}

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceHeaderText}>Your Balance</Text>
          <Wallet size={20} color="#BFDBFE" />
        </View>
        <Text style={styles.balanceAmount}>$1,258.90</Text>
        <View style={styles.balanceActions}>
            {/* <TouchableOpacity style={styles.balanceButton}>
              <Send size={16} color="#FFFFFF" />
              <Text style={styles.balanceButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceButton}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.balanceButtonText}>Add Money</Text>
            </TouchableOpacity> */}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Month Spending</Text>
          <Text style={styles.statValue}>$3,482.55</Text>
          <Text style={styles.statChangeGreen}>+50.3% of the Budget</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Budget</Text>
          <Text style={styles.statValue}>$24,562.80</Text>
        </View>
      </View>

      {/* Recent Transactions Preview */}
      <View style={styles.recentTransactions}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {recentTransactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={transaction.type === "credit" ? styles.creditIcon : styles.debitIcon}>
                  {transaction.type === "credit" ? "+" : "-"}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={transaction.type === "credit" ? styles.creditAmount : styles.debitAmount}>
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  balanceCard: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceHeaderText: {
    color: '#BFDBFE',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  balanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  balanceButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statChangeRed: {
    color: '#EF4444',
    fontSize: 12,
  },
  statChangeGreen: {
    color: '#10B981',
    fontSize: 12,
  },
  recentTransactions: {
    marginBottom: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#2563EB',
    fontSize: 14,
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditIcon: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debitIcon: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  creditAmount: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debitAmount: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;