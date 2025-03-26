import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Send, Plus, Wallet } from 'lucide-react-native';
import { TransactionModal, type Transaction } from "@/components/transaction-modal";
import { BudgetModal } from '@/components/BudgetModal';
import { useBudget } from '@/contexts/BudgetContext';

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

const getCategoryIcon = (category: string) => {
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
      return { name: "md-card", color: "#6b7280" };
  }
};

export default function Home() {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    budget, 
    setBudget, 
    checkBudget, 
    shouldOpenBudgetModal 
  } = useBudget();

  useEffect(() => {
    // Check budget when component mounts
    checkBudget();
  }, []);

  const handleAddTransaction = () => setIsModalOpen(true);

  const handleSaveTransaction = (transaction: Transaction) => {
    setRecentTransactions([transaction, ...recentTransactions.slice(0, 2)]);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceHeaderText}>Your Balance</Text>
          <Wallet size={20} color="#BFDBFE" />
        </View>
        <Text style={styles.balanceAmount}>$1,258.90</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Month Spending</Text>
          <Text style={styles.statValue}>$3,482.55</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Budget</Text>
          <Text style={styles.statValue}>
            {budget !== null 
              ? `$${budget.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : '$0.00'}
          </Text>
        </View>

        {/* Budget Modal */}
        <BudgetModal
          visible={shouldOpenBudgetModal}
          onClose={() => {}}
          onSubmit={setBudget}
        />
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
          {recentTransactions.map((transaction) => {
            const icon = getCategoryIcon(transaction.category);
            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${icon.color}20` }]}>
                    <Ionicons name={icon.name} size={20} color={icon.color} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  </View>
                </View>
                <Text style={[styles.amount, transaction.type === "credit" ? styles.credit : styles.debit]}>
                  {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

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
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  balanceCard: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceHeaderText: {
    color: "#BFDBFE",
    fontSize: 14,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
  },
  quickStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 14,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 4,
    color: "#1e293b",
  },
  recentTransactions: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  seeAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  transactionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
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
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  credit: {
    color: "#16a34a",
  },
  debit: {
    color: "#dc2626",
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