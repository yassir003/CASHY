import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TransactionModal } from "@/components/transaction-modal";

type Transaction = {
  id: string;
  name: string;
  date: string;
  amount: string;
  type: "credit" | "debit";
  category: string;
};

// Updated mock data with proper dates
const initialTransactions: Transaction[] = [
  {
    id: "t1",
    name: "Salary Deposit",
    date: "2024-03-15",
    amount: "5000.00",
    type: "credit",
    category: "income",
  },
  {
    id: "t2",
    name: "Amazon Purchase",
    date: "2024-03-15",
    amount: "129.99",
    type: "debit",
    category: "shopping",
  },
  {
    id: "t3",
    name: "Netflix Subscription",
    date: "2024-03-14",
    amount: "14.99",
    type: "debit",
    category: "entertainment",
  },
  {
    id: "t4",
    name: "Freelance Payment",
    date: "2024-03-14",
    amount: "750.00",
    type: "credit",
    category: "income",
  },
];

const getCategoryIcon = (category: string): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (category) {
    case "shopping":
      return { name: "cart", color: "#f59e0b" };
    case "food":
      return { name: "restaurant", color: "#10b981" };
    case "income":
      return { name: "wallet", color: "#3b82f6" };
    case "entertainment":
      return { name: "film", color: "#8b5cf6" };
    default:
      return { name: "id-card", color: "#6b7280" };
  }
};

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {};
  
  transactions.forEach((transaction) => {
    // Add null check and fallback
    const transactionDate = transaction.date ? new Date(transaction.date) : new Date();
    const date = transactionDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });

  return Object.entries(grouped).map(([title, data]) => ({ title, data }));
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveTransaction = (transaction: Transaction) => {
    if (isEditing) {
      setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)));
    } else {
      setTransactions([{ ...transaction, id: `t${Date.now()}` }, ...transactions]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryIcon(item.category).color + "20" }]}>
          <Ionicons
            name={getCategoryIcon(item.category).name}
            size={20}
            color={getCategoryIcon(item.category).color}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{item.name}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.amount, item.type === "credit" ? styles.credit : styles.debit]}>
          {item.type === "credit" ? "+" : "-"}${item.amount}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => { setCurrentTransaction(item); setIsEditing(true); setIsModalOpen(true); }}>
            <Ionicons name="pencil" size={18} color="#6b7280" style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={18} color="#ef4444" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}>Transactions</Text> */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={[styles.balanceValue, styles.credit]}>
              ${transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Expenses</Text>
            <Text style={[styles.balanceValue, styles.debit]}>
              ${transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <SectionList
        sections={groupTransactionsByDate(transactions)}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { setIsModalOpen(true); setIsEditing(false); }}>
        <Ionicons name="add" size={28} color="white" />
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
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceItem: {
    flex: 1,
    marginRight: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  credit: {
    color: "#16a34a",
  },
  debit: {
    color: "#dc2626",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
  },
  transactionItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  transactionInfo: {
    justifyContent: "center",
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: "#64748b",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#3b82f6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});