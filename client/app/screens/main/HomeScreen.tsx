import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TransactionModal } from "@/components/transaction-modal";
import { BudgetModal } from '@/components/BudgetModal';
import { useBudget } from '@/contexts/BudgetContext';
import {Transaction, useTransactions } from '@/contexts/TransactionContext';
import { useCategories } from "@/contexts/CategoriesContext";
import {
  Home,
  Utensils,
  Car,
  Film,
  Music,
  ShoppingBag,
  Briefcase,
  Plane,
  Heart,
  Smartphone,
  Plus,
  Wallet,
  ArrowRight,
} from 'lucide-react-native';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Transaction: undefined;
  Budget: undefined;
  // Add other screens as needed
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Define an IconType to match the icons object
type IconType = keyof typeof icons;

// Match the icons object from TransactionsScreen
const icons = {
  Home,
  Utensils,
  Car,
  Film,
  Music,
  ShoppingBag,
  Briefcase,
  Plane,
  Heart,
  Smartphone,
  Plus,
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    budget, 
    setBudget, 
    checkBudget, 
    shouldOpenBudgetModal 
  } = useBudget();
  
  const { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    addTransaction 
  } = useTransactions();
  
  // Add state for recent transactions
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  // Add state for month spending and balance
  const [monthSpending, setMonthSpending] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  
  // Add categories context to match TransactionsScreen
  const { categories, fetchCategories } = useCategories();

  // Calculate month spending and balance
  const calculateMonthSpending = (transactionsList: Transaction[]) => {
    // If there are no transactions or there's an error, set spending to 0
    if (transactionsList.length === 0 || error) {
      setMonthSpending(0);
      const budgetAmount = budget?.amount || 0;
      setBalance(budgetAmount);
      return;
    }

    // Calculate month spending from transactions with type "expense"
    const totalExpenses = transactionsList
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    setMonthSpending(totalExpenses);
    
    // Calculate balance as total budget - month spending
    const budgetAmount = budget?.amount || 0;
    setBalance(budgetAmount - totalExpenses);
  };

  useEffect(() => {
    // Check budget when component mounts
    checkBudget();
    fetchCategories();
  }, []);
  
  useEffect(() => {
    // Fetch all transactions and then filter for the most recent 5
    const loadTransactions = async () => {
      await fetchTransactions();
    };
    
    loadTransactions();
  }, []);
  
  // Effect to update recent transactions and recalculate spending when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      // Sort transactions by date (newest first) and take the first 5
      const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      
      setRecentTransactions(sortedTransactions.slice(0, 5));
    } else {
      setRecentTransactions([]);
    }
    
    // Always recalculate spending when transactions change
    calculateMonthSpending(transactions);
  }, [transactions, budget?.amount]);

  const handleAddTransaction = () => setIsModalOpen(true);

  // Add proper typing for transaction parameter
  const handleSaveTransaction = (transaction: Transaction) => {
    addTransaction(transaction);
    setIsModalOpen(false);
  };

  // Handler for the "See All" button to navigate to Transactions screen
  const handleSeeAllTransactions = () => {
    navigation.navigate('Transaction');
  };

  // Add proper typing for iconName and color parameters
  const getCategoryIcon = (iconName: string, color: string) => {
    const iconProps = { size: 20, color: color };
    // Use type assertion to handle the dynamic icon component
    const IconComponent = (icons[iconName as IconType] || icons.Home);
    return <IconComponent {...iconProps} />;
  };

  // Format currency with commas and 2 decimal places
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).replace('$', '');
  };

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceHeaderText}>Your Balance</Text>
          <Wallet size={20} color="#BFDBFE" />
        </View>
        <Text style={styles.balanceAmount}>
          ${formatCurrency(balance)}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Month Spending</Text>
          <Text style={styles.statValue}>
            ${formatCurrency(monthSpending)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Budget</Text>
          <Text style={styles.statValue}>
            {budget?.amount !== undefined 
              ? `$${formatCurrency(budget.amount)}`
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
          <TouchableOpacity 
            style={styles.seeAllButton} 
            onPress={handleSeeAllTransactions}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ArrowRight size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsCard}>
          {loading ? (
            <Text style={styles.loadingText}>Loading transactions...</Text>
          ) : error ? (
            <Text style={styles.errorText}>No Transactions found for this month</Text>
          ) : recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>No recent transactions</Text>
          ) : (
            recentTransactions.map((transaction) => {
              // Match the category handling approach from TransactionsScreen
              const category = categories.find(cat => cat._id === transaction.category);
              const categoryName = transaction.categoryName || category?.name || "Uncategorized";
              const categoryColor = transaction.categoryColor || category?.color || "#6b7280";
              const categoryIcon = transaction.categoryIcon || category?.icon || "Home";
              
              // Format date to show "Today" or "Yesterday" if applicable
              const formatDate = (dateString: string | undefined) => {
                if (!dateString) return "";
                
                const txDate = new Date(dateString);
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (txDate.toDateString() === today.toDateString()) {
                  return "Today";
                } else if (txDate.toDateString() === yesterday.toDateString()) {
                  return "Yesterday";
                } else {
                  return txDate.toLocaleDateString();
                }
              };
              
              return (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.categoryIcon, { 
                      backgroundColor: categoryColor + "20" 
                    }]}>
                      {getCategoryIcon(categoryIcon, categoryColor)}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionName}>{transaction.name}</Text>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionCategory}>
                          {categoryName}
                        </Text>
                        {transaction.date && (
                          <Text style={styles.transactionDate}>
                            • {formatDate(transaction.date)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.amount, transaction.type === "income" ? styles.credit : styles.debit]}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Plus size={28} color="#fff" />
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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
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
    flex: 1,
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
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionCategory: {
    fontSize: 14,
    color: "#64748b",
  },
  transactionDate: {
    fontSize: 14,
    color: "#94a3b8",
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
  loadingText: {
    padding: 16,
    textAlign: "center",
    color: "#64748b",
  },
  errorText: {
    padding: 16,
    textAlign: "center",
    color: "#dc2626",
  },
  emptyText: {
    padding: 16,
    textAlign: "center",
    color: "#64748b",
  },
});