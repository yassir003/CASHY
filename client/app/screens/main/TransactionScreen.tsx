import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
// import { Header } from "@/components/header"; // Adjust this for React Native
import { TransactionModal, type Transaction } from "@/components/transaction-modal"
// Mock data
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
  {
    id: "t4",
    name: "Freelance Payment",
    date: "Yesterday, 1:45 PM",
    amount: "750.00",
    type: "credit",
    category: "income",
  },
  {
    id: "t5",
    name: "Grocery Shopping",
    date: "Feb 28, 5:30 PM",
    amount: "85.75",
    type: "debit",
    category: "food",
  },
  {
    id: "t6",
    name: "Client Payment",
    date: "Feb 28, 2:15 PM",
    amount: "1200.00",
    type: "credit",
    category: "income",
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>()
  const [isEditing, setIsEditing] = useState(false)

  const handleAddTransaction = () => {
    setCurrentTransaction(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentTransaction) {
      setTransactions(transactions.filter((t) => t.id !== currentTransaction.id))
    }
    setIsDeleteDialogOpen(false)
  }

  const handleSaveTransaction = (transaction: Transaction) => {
    if (isEditing) {
      setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)))
    } else {
      setTransactions([transaction, ...transactions])
    }
    setIsModalOpen(false)
  }

  return (
    <View style={styles.container}>
      {/* <Header title="Transactions" showProfile={false} /> */}

      <ScrollView style={styles.scrollArea}>
        <View style={styles.card}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <View
                  style={[
                    styles.iconContainer,
                    transaction.type === "credit"
                      ? styles.creditIcon
                      : styles.debitIcon,
                  ]}
                >
                  <Text style={styles.iconText}>
                    {transaction.type === "credit" ? "+" : "-"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <View style={styles.transactionActions}>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === "credit" ? styles.creditAmount : null,
                  ]}
                >
                  {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
                </Text>
                <TouchableOpacity
                  onPress={() => handleEditTransaction(transaction)}
                >
                  <Ionicons name="pencil" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTransaction(transaction)}
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
        isEditing={isEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  creditIcon: {
    backgroundColor: "#dbeafe",
  },
  debitIcon: {
    backgroundColor: "#f3f4f6",
  },
  iconText: {
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
  transactionActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 16,
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