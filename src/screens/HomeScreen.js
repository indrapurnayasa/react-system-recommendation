import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

// Function to format numbers with dots as thousand separators
const formatBalance = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function HomeScreen({ route}) {
  const {cif} = route.params;
  
  const [accountData, setAccountData] = useState({
    type: '',
    number: '',
    balance: '*******',
  });

  const [showBalance, setShowBalance] = useState(false); // State to toggle balance visibility
  const [recentTransactions, setRecentTransactions] = useState([
    { type: 'E-Wallet', name: 'Dana Indra', icon: 'smartphone' },
    { type: 'E-Wallet', name: 'Ovo Indra', icon: 'smartphone' },
    { type: 'Transfer', name: 'John Doe', icon: 'send' },
    { type: 'Payment', name: 'Electricity Bill', icon: 'zap' },
  ]);

  useEffect(() => {
    // Fetch account data from the API
    if (cif) {
      axios.get(`http://10.63.110.70:5000/user?cif=${cif}`)
      .then(response => {
        const { accountNumber, accountType, totalAmount } = response.data.user;
        setAccountData({
          type: accountType,
          number: accountNumber,
          balance: `${formatBalance(totalAmount)}`, // Format the balance with dots
        });
      })
      .catch(error => {
        console.error('Error fetching account data:', error);
      });
    }
  }, [cif]);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const renderTransaction = (transaction, index) => (
    <TouchableOpacity key={index} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Feather name={transaction.icon} size={24} color="#00D68F" />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{transaction.type}</Text>
        <Text style={styles.transactionName}>{transaction.name}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.accountSection}>
        <View style={styles.accountHeader}>
          <Text style={styles.accountTitle}>Rekening transaksi kamu</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.accountCardsContainer}>
          <View style={styles.seeAssetsCard}>
            <View style={styles.pieChartCircle}>
              <Feather name="pie-chart" size={16} color="#000000" />
            </View>
            <View style={styles.seeAssetsTextContainer}>
              <Text style={styles.seeAssetsTitle}>See</Text>
              <Text style={styles.seeAssetsSubtitle}>Assets</Text>
            </View>
          </View>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountType}>{accountData.type}</Text>
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>PRIMARY</Text>
                </View>
              </View>
              <Text style={styles.accountNumber}>{accountData.number}</Text>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                  Rp{showBalance ? accountData.balance : '********'}
                </Text>
                <TouchableOpacity onPress={toggleBalanceVisibility}>
                  <Feather 
                    name={showBalance ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#000000" 
                    style={styles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Fitur pilihan kamu</Text>
          <TouchableOpacity>
            <Text style={styles.configureText}>Atur</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.featureGrid}>
          {['Transfer', 'TapCash', 'Bayar & Beli', 'E-Wallet', 'Virtual Account', 'Kartu'].map((feature, index) => (
            <TouchableOpacity key={index} style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: ['#7FE1D0', '#FFA26B', '#92A3FD', '#00D68F', '#C58BF2', '#FF9CF7'][index] }]}>
                <Feather name={['send', 'credit-card', 'shopping-cart', 'smartphone', 'credit-card', 'credit-card'][index]} size={24} color="white" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentTransactions}>
        <Text style={styles.recentTransactionsTitle}>Transaksi favorit terakhir</Text>
        {recentTransactions.map(renderTransaction)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#000000',
    fontWeight: '500',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabText: {
    color: '#888888',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#D6FF7F',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '500',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#FF8500',
    fontSize: 14,
  },
  accountCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAssetsCard: {
    backgroundColor: '#C2F0EC',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChartCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  seeAssetsTextContainer: {
    flexDirection: 'column',
  },
  seeAssetsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAssetsSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  accountCard: {
    flex: 1,
    backgroundColor: '#FF9500',
    borderRadius: 16,
    padding: 20,
    marginLeft: 12, // Add some space between the cards
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  primaryBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  primaryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  accountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  accountLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: '#FFFFFF50',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  accountSection: {
    padding: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  eyeIcon: {
    opacity: 0.7,
  },
  featuresSection: {
    padding: 20,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  configureText: {
    color: '#FF9933',
    fontWeight: '500',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feature: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureText: {
    textAlign: 'center',
    fontSize: 12,
  },
  recentTransactions: {
    padding: 20,
  },
  recentTransactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F9F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    color: '#888888',
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
