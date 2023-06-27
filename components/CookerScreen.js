import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const CookerScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.1.7:5000/orders'); // Replace with your server URL
      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigation.replace('Login');
  };

  const markOrderAsReady = (tableNumber) => {
    // Check if the order is already marked as ready
    const order = orders.find((order) => order.tableNumber === tableNumber);
    if (!order) {
      Alert.alert('Order Not Found', 'The selected order could not be found.');
    } else if (order.status) {
      Alert.alert('Order Already Marked', 'This order has already been marked as ready.');
    } else {
      const orderNumber = order.orderNumber;
      // Update the order status on the server
      fetch(`http://192.168.1.7:5000/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: true }),
      })
        .then(() => {
          // Update the order status locally
          const updatedOrders = orders.map((o) => (o._id === order._id ? { ...o, status: true } : o));
          setOrders(updatedOrders);
          Alert.alert('Order Marked as Ready', `Order ${orderNumber} (Table ${tableNumber}) has been marked as ready.`);
        })
        .catch((error) => {
          console.error('Error marking order as ready:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Missions</Text>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderText}>Table Number: {order.tableNumber}</Text>
            <Text style={styles.orderText}>Item Name: {order.itemName}</Text>
            {order.juiceName && <Text style={styles.orderText}>Juice Name: {order.juiceName}</Text>}
            {!order.status && (
              <Button
                title="Order Ready"
                onPress={() => markOrderAsReady(order.tableNumber)}
                color="#841584"
                accessibilityLabel="Notify Waitress"
              />
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noOrdersText}>No orders yet</Text>
      )}
      <Button title="Exit" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
  },
  noOrdersText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default CookerScreen;