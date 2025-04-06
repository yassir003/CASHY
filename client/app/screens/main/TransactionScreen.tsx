import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TransactionModal } from "@/components/transaction-modal";
import { Transaction, useTransactions } from "@/contexts/TransactionContext";
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
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react-native";

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
  Pencil,
  Trash2,
  AlertCircle,
};

// Define an IconType to match the icons object
type IconType = keyof typeof icons;

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {};
  
  transactions.forEach((transaction) => {
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

  return Object.entries(grouped)
    .map(([title, data]) => ({ title, data }))
    .sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime());
};

const TransactionsScreen = () => {
  const { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    addTransaction,
    updateTransaction,
    deleteTransaction 
  } = useTransactions();

  const { categories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSaveTransaction = async (transaction: Transaction) => {
    if (isEditing && currentTransaction) {
      await updateTransaction(currentTransaction.id, transaction);
    } else {
      await addTransaction(transaction);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  const getCategoryIcon = (iconName: string, color: string) => {
    const iconProps = { size: 20, color: color };
    const IconComponent = (icons[iconName as IconType] || icons.Home);
    return <IconComponent {...iconProps} />;
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    // Use embedded category data if available, otherwise fall back to finding it in categories array
    const category = categories.find(cat => cat._id === item.category);
    const categoryName = item.categoryName || category?.name || "Uncategorized";
    const categoryColor = item.categoryColor || category?.color || "#6b7280";
    const categoryIcon = item.categoryIcon || category?.icon || "Home";
    
    // Format amount with 2 decimal places
    const formattedAmount = parseFloat(item.amount).toFixed(2);
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[styles.categoryIcon, { 
            backgroundColor: categoryColor + "20" 
          }]}>
            {getCategoryIcon(categoryIcon, categoryColor)}
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={styles.transactionCategory}>
              {categoryName}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.amount, item.type === "income" ? styles.credit : styles.debit]}>
            {item.type === "income" ? "+" : "-"}${formattedAmount}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => { 
              setCurrentTransaction(item); 
              setIsEditing(true); 
              setIsModalOpen(true); 
            }}>
              <Pencil size={18} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const calculateTotal = (type: 'income' | 'expense') => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.warningContainer}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            Transactions will be renewed at the start of each month
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={[styles.balanceValue, styles.credit]}>
              ${(0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Expenses</Text>
            <Text style={[styles.balanceValue, styles.debit]}>
              ${(0).toFixed(2)}
            </Text>
          </View>
        </View>
        <Text style={styles.errorText}>No Transactions found for this month</Text>
        
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => { 
            setIsModalOpen(true); 
            setIsEditing(false); 
            setCurrentTransaction(undefined);
          }}
        >
          <Plus size={28} color="white" />
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.warningContainer}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            Transactions will be renewed at the start of each month
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={[styles.balanceValue, styles.credit]}>
              ${calculateTotal('income')}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Expenses</Text>
            <Text style={[styles.balanceValue, styles.debit]}>
              ${calculateTotal('expense')}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Add a transaction to get started</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => { 
          setIsModalOpen(true); 
          setIsEditing(false); 
          setCurrentTransaction(undefined);
        }}
      >
        <Plus size={28} color="white" />
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
  warningContainer: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    marginLeft: 8,
    color: "#92400e",
    fontSize: 14,
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748b',
  },
});

export default TransactionsScreen;