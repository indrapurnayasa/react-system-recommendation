import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Animated, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function InsightScreen({ route }) {
  const [financialData, setFinancialData] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'income', title: 'Pemasukan' },
    { key: 'expense', title: 'Pengeluaran' },
  ]);
  const { cif } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response_user = await axios.get(`http://10.63.110.70:5000/detailTransaction?cif=${cif}&start_date=2024-10-01&end_date=2024-10-31`);
      const data_user = response_user.data;

      const response_recommendation = await axios.get(`http://10.63.110.70:5000/detailRecommendation?cif=${cif}&start_date=2024-10-01&end_date=2024-10-31`);
      const data_recommendation = response_recommendation.data;
      
      const processedData = {
        period: `${new Date(data_user.date_range.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(data_user.date_range.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        income: data_user.totals.totalIncome,
        expense: data_user.totals.totalExpense,
        difference: data_user.totals.difference,
        incomeBreakdown: data_user.transactions.topIncomeCategories.map(item => ({
          name: item.category,
          amount: item.totalAmount,
          percentage: item.percentage
        })),
        expenseBreakdown: data_user.transactions.topExpenseCategories.map(item => ({
          name: item.category,
          amount: item.totalAmount,
          percentage: item.percentage
        })),
        promoMerchants: (data_recommendation.promo_recommendations || []).map(item => ({
          id: item.id,
          name: item.promoName.split(' ').length > 5
            ? item.promoName.split(' ').slice(0, 3).join(' ') + '...'
            : item.promoName,
          imageUrl: item.bannerUrl,
          directUrl: item.promoUrl,
          merchantName: item.merchantName
        })),
        productRecommendations: (data_recommendation.product_recommendations || []).map(item => ({
          id: item.id,
          name: item.productName,
          productUrl: item.productUrl,
          iconUrl: item.iconUrl
        })),
      };

      setFinancialData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatCurrency = (amount) => `Rp${amount.toLocaleString('id-ID')}`;

  const renderIncomeItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.expenseItem}>
      <View style={styles.expenseIconContainer}>
        <Feather name="arrow-down-right" size={24} color="#00D68F" />
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.expensePercentage}>
        <Text style={styles.expensePercentageText}>{item.percentage}%</Text>
        <Feather name="chevron-right" size={24} color="#888888" />
      </View>
    </TouchableOpacity>
  );

  const renderExpenseItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.expenseItem}>
      <View style={styles.expenseIconContainer}>
        <Feather name={index === 0 ? 'file-text' : index === 1 ? 'arrow-up-right' : 'arrow-down-left'} size={24} color="#FF9933" />
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.expensePercentage}>
        <Text style={styles.expensePercentageText}>{item.percentage}%</Text>
        <Feather name="chevron-right" size={24} color="#888888" />
      </View>
    </TouchableOpacity>
  );

  const IncomeRoute = () => (
    <View style={[styles.expenseBreakdown, financialData?.incomeBreakdown.length <= 2 && styles.shortList]}>
      {financialData?.incomeBreakdown.map(renderIncomeItem)}
    </View>
  );

  const ExpenseRoute = () => (
    <View style={[styles.expenseBreakdown, financialData?.expenseBreakdown.length <= 2 && styles.shortList]}>
      {financialData?.expenseBreakdown.map(renderExpenseItem)}
    </View>
  );

  const renderScene = SceneMap({
    income: IncomeRoute,
    expense: ExpenseRoute,
  });

  const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        renderLabel={({ route, focused }) => (
          <View style={[
            styles.tabItem,
            focused ? styles.activeTabItem : styles.inactiveTabItem
          ]}>
            <Text style={[
              styles.tabLabel,
              focused ? styles.activeTabLabel : styles.inactiveTabLabel
            ]}>
              {route.title}
            </Text>
          </View>
        )}
      />
  );

  const renderRecommendationSection = (title, items) => {
    return (
      <View style={styles.recommendationSection}>
        <View style={styles.recommendationHeader}>
          <Text style={styles.recommendationTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('WebViewScreen', { url: 'https://bniexperience.bni.co.id' })}
          >
            <Text style={styles.viewAllButtonText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScrollView}>
          {items.map((item, index) => (
            <TouchableOpacity 
              key={item.id || index} 
              style={styles.recommendationItem}
              onPress={() => navigation.navigate('WebViewScreen', { url: item.directUrl })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.recommendationImage} />
              <Text style={styles.recommendationMerchantName}>{item.merchantName}</Text>
              <Text style={styles.recommendationName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderProductRecommendationSection = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.productRecommendationSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.iconsContainer}>
          {items.map((item) => (
            <TouchableOpacity 
              key={item.id || `item-${index}`}  // Use a unique identifier
              style={styles.productRecommendationItem}
              onPress={() => navigation.navigate('WebViewScreen', { url: item.productUrl })}
            >
              <View style={styles.iconCircle}>
              <Image
                source={{ uri: item.iconUrl }}
                style={styles.iconImage}
              />
              </View>
              <Text style={styles.iconName} numberOfLines={2} ellipsizeMode="tail">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const ChartComponent = ({ financialData, index }) => {
    const incomeBarHeight = useRef(new Animated.Value(0)).current;
    const expenseBarHeight = useRef(new Animated.Value(0)).current;
    const isFirstRender = useRef(true);

    const animateBars = () => {
      Animated.parallel([
        Animated.timing(incomeBarHeight, {
          toValue: (financialData.income / Math.max(financialData.income, financialData.expense)) * 100,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(expenseBarHeight, {
          toValue: (financialData.expense / Math.max(financialData.income, financialData.expense)) * 100,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    };

    useEffect(() => {
      if (isFirstRender.current) {
        animateBars();
        isFirstRender.current = false;
      } else {
        incomeBarHeight.setValue((financialData.income / Math.max(financialData.income, financialData.expense)) * 100);
        expenseBarHeight.setValue((financialData.expense / Math.max(financialData.income, financialData.expense)) * 100);
      }
    }, [financialData, index]);

    return (
      <View style={styles.chart}>
        <View style={styles.barContainer}>
          <Animated.View
            style={[
              styles.chartBar,
              styles.incomeBar,
              { height: incomeBarHeight.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })}
            ]}
          />
          <Text style={styles.chartLabel}>Pemasukan</Text>
        </View>
        <View style={styles.barContainer}>
          <Animated.View
            style={[
              styles.chartBar,
              styles.expenseBar,
              { height: expenseBarHeight.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })}
            ]}
          />
          <Text style={styles.chartLabel}>Pengeluaran</Text>
        </View>
      </View>
    );
  };

  if (!financialData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.financialSummary}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Rekap keuanganmu</Text>
          <Feather name="info" size={20} color="#EB8E27" style={styles.infoIcon} />
        </View>
        <Text style={styles.periodText}>
          Periode <Text style={styles.periodDate}>{financialData.period}</Text>
        </Text>

        <View style={styles.boxContainer}>
          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountTypeText}>Semua tabungan & giro rupiah</Text>
          </View>

          <View style={styles.financialDetails}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Pemasukan</Text>
              <Text style={[styles.financeAmount, styles.incomeAmount]}>{formatCurrency(financialData.income)}</Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Pengeluaran</Text>
              <Text style={[styles.financeAmount, styles.expenseAmount]}>{formatCurrency(financialData.expense)}</Text>
            </View>
            <View style={styles.chartUnderline} />
          </View>

          <Text style={styles.differenceText}>
            Selisih <Text style={styles.differenceAmount}>{formatCurrency(financialData.difference)}</Text>
          </Text>

          <ChartComponent financialData={financialData} index={index} />

          <View style={[styles.tabViewContainer, financialData?.incomeBreakdown.length <= 2 && styles.shortList]}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={renderTabBar}
            />
          </View>
        </View>
      </View>

      {renderProductRecommendationSection('Special Offer for You', financialData.productRecommendations)}
      {renderRecommendationSection('Promo Merchant', financialData.promoMerchants)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  financialSummary: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    
  },
  periodText: {
    color: '#888888',
    marginBottom: 15,
    fontWeight: '500',
    fontSize: 12,
  },
  periodDate: {
    color: '#000000',
    marginBottom: 15,
    fontWeight: '500',
  },
  accountTypeContainer: {
    borderWidth: 1,            // Set the border width
    borderColor: '#ccc',      // Set the border color
    borderRadius: 8,          // Rounded corners
    padding: 10,              // Padding inside the box
    backgroundColor: '#fff',  // Background color of the box
    margin: 10,               // Optional: margin outside the box
  },
  accountTypeText: {
    fontWeight: '500',
    fontSize: 14,
  },
  financialDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  financeItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeLabel: {
    color: '#000000',
    fontWeight: '500',
    paddingHorizontal: 30,
    marginBottom: 5,
  },
  financeAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#00D68F',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  differenceText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
  },
  differenceAmount: {
    color: '#00D68F',
    fontWeight: 'bold',
  },
  chart: {
    position: 'relative', // Add this to position the underline absolutely
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 200,
    marginVertical: 40,
  },
  barContainer: {
    alignItems: 'center',
    width: '40%',
  },
  chartBar: {
    width: '100%',
    maxWidth: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  incomeBar: {
    backgroundColor: '#00D68F',
    marginRight: 15,
  },
  expenseBar: {
    backgroundColor: '#FF6B6B',
    marginLeft: 15,
  },
  chartLabel: {
    marginTop: 20, // Increased to make room for underline
    fontSize: 12,
    color: '#000000',
  },
  expenseBreakdown: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  expenseIconContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 12,
    color: '#888888',
  },
  expenseAmount: {
    color: '#000000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  expensePercentage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expensePercentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  indicatorStyle: {
    backgroundColor: '#00D68F',
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
  },
  tabLabelStyle: {
    color: '#888888',
    fontWeight: 'bold',
  },
  recommendationSection: {
    paddingLeft: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationScrollView: {
    flexDirection: 'row',
  },
  recommendationItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  recommendationImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
  },
  recommendationMerchantName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryHeader: {
    flexDirection: 'row', // Aligns items in a row (horizontally)
    alignItems: 'center', // Vertically aligns Text and Icon in the center
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  infoIcon: {
    marginLeft: 8, // Adds some space between the text and the icon (adjust as needed)
  },
  boxContainer: {
    borderWidth: 1,            // Set the border width
    borderColor: '#ccc',      // Set the border color
    borderRadius: 8, 
    paddingTop:15,
    paddingHorizontal: 20,              // Padding inside the box
    backgroundColor: '#fff',  // Background color of the box
    margin: 10,               // Optional: margin outside the box
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: 148,
  },
  activeTabItem: {
    backgroundColor: '#dbeb5b',
  },
  inactiveTabItem: {
    backgroundColor: '#f2f2f2',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabLabel: {
    color: '#000000',
  },
  inactiveTabLabel: {
    color: '#888888',
  },
  indicator: {
    height: 0, // Hide the default indicator
  },
  productRecommendationSection: {
    alignItems: 'center', // Center the entire section
    paddingBottom: 30
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Ensure the title is centered
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginLeft: 25,
    width: '100%', // Ensure the container takes full width
  },
  iconItem: {
    alignItems: 'center',  
    width: '25%', // Set a fixed width for each item (adjust as needed)
    marginBottom: 15,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FF8500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconName: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 5, // Add some horizontal padding for longer text
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 16, // Add some padding to align with the scrollable content
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllButtonText: {
    color: '#FF8500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationSection: {
    paddingLeft: 16, // Changed from 25 to align with other sections
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabViewContainer: {
    marginBottom: 10,
    height: 275, 
  },
  expenseBreakdown: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
    paddingTop: 10, // Add some padding at the top
  },
  shortList: {
    minHeight: 260, // Set a minimum height for short lists
  },
  productRecommendationItem: {
    width: '23%', // Adjust this value to fit four items per row with some spacing
    marginBottom: 15,
    alignItems: 'center',
  },
  iconImage: {
    width: 38, // Adjust icon size
    height: 38, // Adjust icon size
    paddingHorizontal: 10,
  },
});