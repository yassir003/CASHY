import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedMonth, setSelectedMonth] = useState('March 2025');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const screenWidth = Dimensions.get('window').width;
  
  const expenseCategories: ExpenseCategory[] = [
    { name: 'Food & Drink', amount: 600, color: '#4285F4' },
    { name: 'Transportation', amount: 100, color: '#34A853' },
    { name: 'Entertainment', amount: 195, color: '#FBBC05' },
    { name: 'Shopping', amount: 200, color: '#7B61FF' },
    { name: 'Utilities', amount: 110, color: '#EA4335' },
    { name: 'Other', amount: 75, color: '#9AA0A6' },
  ];
  
  const totalSpending = expenseCategories.reduce((sum, category) => sum + category.amount, 0);
  
  // Simple bar chart to simulate the line chart
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const incomeData = [1800, 1950, 2100, 1900, 2000, 2200];
  const expenseData = [1400, 1500, 1650, 1200, 1300, 1105];
  
  // Calculate the maximum value to normalize bar heights
  const maxValue = Math.max(...incomeData, ...expenseData);
  
  // Calculate percentage for pie chart segments
  const calculatePercentage = (amount: number) => {
    return (amount / totalSpending) * 100;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      
      {/* Month selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity 
          style={styles.monthButton}
          onPress={() => setShowMonthPicker(!showMonthPicker)}
        >
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Ionicons name={showMonthPicker ? "chevron-up" : "chevron-down"} size={20} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.compareButton}>
          <Text style={styles.compareText}>Compare</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Overview', 'Income', 'Expenses'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Income vs Expenses Chart (simplified) */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Income vs Expenses</Text>
        <View style={styles.barChartContainer}>
          {months.map((month, index) => (
            <View key={month} style={styles.barGroup}>
              <View style={styles.barColumn}>
                <View 
                  style={[
                    styles.bar, 
                    styles.incomeBar, 
                    { height: (incomeData[index] / maxValue) * 150 }
                  ]} 
                />
                <View 
                  style={[
                    styles.bar, 
                    styles.expenseBar, 
                    { height: (expenseData[index] / maxValue) * 150 }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{month}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4285F4' }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EA4335' }]} />
            <Text style={styles.legendText}>Expenses</Text>
          </View>
        </View>
      </View>
      
      {/* Spending by Category */}
      <View style={styles.spendingContainer}>
        <Text style={styles.spendingTitle}>Spending by Category</Text>
        
        <View style={styles.pieChartContainer}>
          {/* Simple pie chart using Views */}
          <View style={styles.pieChart}>
            {expenseCategories.map((category, index) => {
              const percentage = calculatePercentage(category.amount);
              return (
                <View 
                  key={category.name}
                  style={[
                    styles.pieSegment,
                    { 
                      backgroundColor: category.color,
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      transform: [
                        { translateX: Math.cos(index * 60 * Math.PI / 180) * 30 },
                        { translateY: Math.sin(index * 60 * Math.PI / 180) * 30 }
                      ],
                      opacity: percentage / 100 + 0.3, 
                    }
                  ]}
                />
              );
            })}
          </View>
          
          <View style={styles.totalSpendingContainer}>
            <Text style={styles.totalSpendingLabel}>Total Spending</Text>
            <Text style={styles.totalSpendingAmount}>${totalSpending.toLocaleString()}</Text>
            <Text style={styles.totalSpendingPeriod}>This month</Text>
          </View>
        </View>
        
        {/* Categories list */}
        <View style={styles.categoriesList}>
          {expenseCategories.map((category) => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>${category.amount}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  compareButton: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  compareText: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'black',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginVertical: 16,
  },
  barGroup: {
    alignItems: 'center',
    width: '16%',
  },
  barColumn: {
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: 12,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  incomeBar: {
    backgroundColor: '#4285F4',
    marginBottom: 1,
  },
  expenseBar: {
    backgroundColor: '#EA4335',
    position: 'absolute',
    left: '50%',
    marginLeft: -2,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#333',
  },
  spendingContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  spendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSegment: {
    position: 'absolute',
  },
  totalSpendingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  totalSpendingLabel: {
    fontSize: 14,
    color: '#333',
  },
  totalSpendingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  totalSpendingPeriod: {
    fontSize: 12,
    color: '#888',
  },
  categoriesList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 15,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default AnalyticsDashboard;