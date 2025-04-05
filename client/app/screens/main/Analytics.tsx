import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [selectedMonth] = useState('March 2025');
  
  // Spending by category data
  const expenseCategories: ExpenseCategory[] = [
    { name: 'Food & Drink', amount: 600, color: '#FF6384' },
    { name: 'Transportation', amount: 100, color: '#36A2EB' },
    { name: 'Entertainment', amount: 195, color: '#FFCE56' },
    { name: 'Shopping', amount: 200, color: '#4BC0C0' },
    { name: 'Utilities', amount: 110, color: '#9966FF' },
    { name: 'Other', amount: 75, color: '#FF9F40' },
  ];
  
  // Monthly income vs expenses data
  const monthlyData = [
    { month: 'Jan', income: 3200, expenses: 2800 },
    { month: 'Feb', income: 3400, expenses: 2950 },
    { month: 'Mar', income: 3800, expenses: 1280 },
    { month: 'Apr', income: 3500, expenses: 2400 },
    { month: 'May', income: 4000, expenses: 3000 },
  ];
  
  const totalSpending = expenseCategories.reduce((sum, category) => sum + category.amount, 0);
  
  // Format data for VictoryPie
  const pieChartData = expenseCategories.map(category => ({
    x: category.name,
    y: category.amount,
    color: category.color
  }));

  // Calculate percentage for each category
  const calculatePercentage = (amount: number) => {
    return (amount / totalSpending) * 100;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Analytics</Text>
        <Text style={styles.headerSubtitle}>{selectedMonth}</Text>
      </View>
      
      {/* Bar Chart for Income vs Expenses */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Income vs Expenses</Text>
        
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
          <VictoryBar
            data={monthlyData}
            x="month"
            y="income"
            style={{ data: { fill: "#4BC0C0" } }}
            barWidth={15}
          />
          <VictoryBar
            data={monthlyData}
            x="month"
            y="expenses"
            style={{ data: { fill: "#FF6384" } }}
            barWidth={15}
          />
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
      </View>
      
      {/* Pie Chart for Spending Categories */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        
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
          {expenseCategories.map((category) => (
            <View key={category.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: category.color }]} />
              <Text style={styles.legendText}>{category.name}</Text>
              <Text style={styles.legendAmount}>${category.amount}</Text>
              <Text style={styles.legendPercent}>{Math.round(calculatePercentage(category.amount))}%</Text>
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
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#4285F4',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'white',
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
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  legendPercent: {
    fontSize: 14,
    color: '#666',
  },
});

export default AnalyticsDashboard;