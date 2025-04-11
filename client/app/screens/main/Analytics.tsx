import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack } from 'victory';
import { useCategories } from '@/contexts/CategoriesContext';
import { useTransactions } from '@/contexts/TransactionContext';

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
};

const AnalyticsDashboard: React.FC = () => {
  const { categories } = useCategories();
  const { transactions } = useTransactions();
  
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalSpending, setTotalSpending] = useState<number>(0);

  // Helper function to get current month name and year
  function getCurrentMonth(): string {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // Process transactions and categories to create chart data
  useEffect(() => {
    if (transactions.length && categories.length) {
      // Calculate spending by category
      const categorySpending = calculateCategorySpending();
      setExpensesByCategory(categorySpending);
      
      // Calculate total spending
      const total = categorySpending.reduce((sum, category) => sum + category.amount, 0);
      setTotalSpending(total);
      
      // Generate monthly data
      const monthly = generateMonthlyData();
      setMonthlyData(monthly);
    }
  }, [transactions, categories]);

  // Calculate spending by category
  const calculateCategorySpending = () => {
    // Create a map to track spending by category
    const categoryMap = new Map();
    
    // Initialize each category with zero spending
    categories.forEach(category => {
      categoryMap.set(category._id, {
        name: category.name,
        amount: 0,
        color: category.color
      });
    });
    
    // Sum up expenses by category
    transactions.forEach(transaction => {
      if (transaction.type === 'expense' && categoryMap.has(transaction.category)) {
        const category = categoryMap.get(transaction.category);
        category.amount += parseFloat(transaction.amount);
        categoryMap.set(transaction.category, category);
      }
    });
    
    // Convert map to array and filter out categories with zero spending
    return Array.from(categoryMap.values())
      .filter(category => category.amount > 0)
      .map(category => ({
        ...category,
        amount: Math.round(category.amount) // Round for cleaner display
      }));
  };

  // Generate monthly income vs expenses data (last 5 months)
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Create data structure for last 5 months
    const monthlyData: MonthlyData[]  = [];
    
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyData.push({
        month: months[monthIndex],
        income: 0,
        expenses: 0
      });
    }
    
    // Group transactions by month and type
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = months[transactionDate.getMonth()];
      const monthData = monthlyData.find(data => data.month === transactionMonth);
      
      if (monthData) {
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'income') {
          monthData.income += amount;
        } else {
          monthData.expenses += amount;
        }
      }
    });
    
    // Round values for cleaner display
    return monthlyData.map(data => ({
      month: data.month,
      income: Math.round(data.income),
      expenses: Math.round(data.expenses)
    }));
  };

  // Format data for VictoryPie
  const pieChartData = expensesByCategory.map(category => ({
    x: category.name,
    y: category.amount,
    color: category.color
  }));

  // Calculate percentage for each category
  const calculatePercentage = (amount: number) => {
    return totalSpending ? (amount / totalSpending) * 100 : 0;
  };

  // Format data for the stacked bar chart
  const expensesData = monthlyData.map(data => ({
    x: data.month,
    y: data.expenses
  }));

  const incomeData = monthlyData.map(data => ({
    x: data.month,
    y: data.income
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Analytics</Text>
        <Text style={styles.headerSubtitle}>{selectedMonth}</Text>
      </View>
      
      {/* Bar Chart for Income vs Expenses */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Income vs Expenses</Text>
        
        {monthlyData.length > 0 ? (
          <>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              width={Dimensions.get('window').width - 32}
              height={300}
            >
              <VictoryAxis
                tickValues={monthlyData.map(data => data.month)}
                tickFormat={monthlyData.map(data => data.month)}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x) => `$${x / 1000}k`}
              />
              <VictoryStack>
                <VictoryBar
                  data={expensesData}
                  style={{ data: { fill: "#FF6384" } }}
                  barWidth={20}
                />
                <VictoryBar
                  data={incomeData}
                  style={{ data: { fill: "#4BC0C0" } }}
                  barWidth={20}
                />
              </VictoryStack>
            </VictoryChart>
            
            <View style={styles.barLegendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4BC0C0' }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6384' }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No monthly data available</Text>
        )}
      </View>
      
      {/* Pie Chart for Spending Categories */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        
        {expensesByCategory.length > 0 ? (
          <>
            <View style={styles.pieChartWrapper}>
              <VictoryPie
                data={pieChartData}
                colorScale={pieChartData.map(d => d.color)}
                innerRadius={80}
                padAngle={2}
                width={Dimensions.get('window').width - 32}
                height={300}
                style={{
                  labels: {
                    fill: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }
                }}
                labelRadius={({ innerRadius }) => (typeof innerRadius === 'number' ? innerRadius : 0) + 50}
                labels={({ datum }) => `${datum.x}\n$${datum.y}`}
              />
              
              <View style={styles.totalSpendingContainer}>
                <Text style={styles.totalSpendingLabel}>Total</Text>
                <Text style={styles.totalSpendingAmount}>${totalSpending}</Text>
              </View>
            </View>
            
            {/* Categories Legend */}
            <View style={styles.legendContainer}>
              {expensesByCategory.map((category) => (
                <View key={category.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: category.color }]} />
                  <Text style={styles.legendText}>{category.name}</Text>
                  <View style={styles.legendMetrics}>
                    <Text style={styles.legendAmount}>${category.amount}</Text>
                    <Text style={styles.legendPercent}>{Math.round(calculatePercentage(category.amount))}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No category spending data available</Text>
        )}
      </View>

      {/* Budget vs Spending */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Budget vs Actual Spending</Text>
        
        {categories.length > 0 ? (
          <View style={styles.budgetContainer}>
            {categories.map(category => {
              const spent = expensesByCategory.find(c => c.name === category.name)?.amount || 0;
              const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
              const isOverBudget = percentage > 100;
              
              return (
                <View key={category._id} style={styles.budgetItem}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.categoryLabel}>
                      <View style={[styles.legendDot, { backgroundColor: category.color }]} />
                      <Text style={styles.budgetCategoryName}>{category.name}</Text>
                    </View>
                    <Text style={styles.budgetText}>
                      ${spent} of ${category.budget}
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget ? '#FF6384' : category.color
                        }
                      ]} 
                    />
                  </View>
                  
                  {isOverBudget && (
                    <Text style={styles.overBudgetText}>
                      ${(spent - category.budget).toFixed(2)} over budget
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>No budget data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#333',
    fontSize: 22,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pieChartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  totalSpendingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalSpendingLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalSpendingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  legendContainer: {
    width: '100%',
  },
  barLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    flex: 1,
  },
  legendMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  legendPercent: {
    fontSize: 14,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    margin: 20,
    textAlign: 'center',
  },
  budgetContainer: {
    width: '100%',
  },
  budgetItem: {
    marginBottom: 16,
    width: '100%',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCategoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  budgetText: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  overBudgetText: {
    fontSize: 12,
    color: '#FF6384',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default AnalyticsDashboard;