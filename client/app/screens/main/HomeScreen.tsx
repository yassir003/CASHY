import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Send, Plus, Wallet } from 'lucide-react-native'; // Assuming you have lucide-react-native for icons
import { Ionicons } from "@expo/vector-icons"; // For icons
// import { Header } from "@/components/header"; // Adjust this for React Native
import { TransactionModal, type Transaction } from "@/components/transaction-modal"

// Initial transactions data
// const initialTransactions = [
//   {
//     id: "t1",
//     name: "Salary Deposit",
//     date: "Today, 12:30 PM",
//     amount: "5000.00",
//     type: "credit",
//     category: "income",
//   },
//   {
//     id: "t2",
//     name: "Amazon Purchase",
//     date: "Today, 10:15 AM",
//     amount: "129.99",
//     type: "debit",
//     category: "shopping",
//   },
//   {
//     id: "t3",
//     name: "Netflix Subscription",
//     date: "Yesterday, 3:20 PM",
//     amount: "14.99",
//     type: "debit",
//     category: "entertainment",
//   },
// ];

export default function Home() {
  // Initial transactions data
  const initialTransactions: Transaction[] = [
    {
    id: "t1",
    name: "Salary Deposit",
    date: "Today, 12:30 PM",
    amount: "5000.00",
    type: "credit",
    category: "income",
  },
  {
    id: "t2",
    name: "Amazon Purchase",
    date: "Today, 10:15 AM",
    amount: "129.99",
    type: "debit",
    category: "shopping",
  },
  {
    id: "t3",
    name: "Netflix Subscription",
    date: "Yesterday, 3:20 PM",
    amount: "14.99",
    type: "debit",
    category: "entertainment",
  },
];
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    setRecentTransactions([transaction, ...recentTransactions.slice(0, 2)]);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.recentHeaderText}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsCard}>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === "credit"
                      ? styles.creditIcon
                      : styles.debitIcon,
                  ]}
                >
                  <Text style={styles.transactionIconText}>
                    {transaction.type === "credit" ? "+" : "-"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === "credit" ? styles.creditAmount : null,
                ]}
              >
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        isEditing={false}
      />
    </View>
  );
}

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
    elevation: 2,
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
    fontSize: 12,
    color: "#ef4444",
  },
  statChangeGreen: {
    fontSize: 12,
    color: "#22c55e",
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
  recentHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#2563EB',
    fontSize: 14,
  },
  transactionsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#dbeafe",
  },
  debitIcon: {
    backgroundColor: "#f3f4f6",
  },
  transactionIconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  creditAmount: {
    color: "#3b82f6",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});