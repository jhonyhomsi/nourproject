import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';

const FinishedOrders = () => {
  const [finishedOrders, setFinishedOrders] = useState([]);

  useEffect(() => {
    fetchFinishedOrders();
  }, []);

  const fetchFinishedOrders = async () => {
    try {
      const response = await fetch('http://192.168.1.7:5000/orders?status=true'); // Replace with your server URL
      const ordersData = await response.json();
      console.log(ordersData);
      setFinishedOrders(ordersData);
    } catch (error) {
      console.error('Error fetching finished orders:', error);
    }
  };

  const handleDeleteOrder = async (orderNumber) => {
    try {
      await fetch(`http://192.168.1.7:5000/delorders?orderNumber=${orderNumber}`, {
        method: 'DELETE',
      });
      // Remove the deleted order from the state
      setFinishedOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderNumber !== orderNumber)
      );
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finished Orders</Text>
      {finishedOrders.length > 0 ? (
        finishedOrders.map((order, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderText}>Table Number: {order.tableNumber}</Text>
            <Text style={styles.orderText}>Item Name: {order.itemName}</Text>
            {order.juiceName && <Text style={styles.orderText}>Juice Name: {order.juiceName}</Text>}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteOrder(order.orderNumber)}
            >
              <Text style={styles.deleteButtonText}>Served</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noOrdersText}>No finished orders</Text>
      )}
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
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  noOrdersText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default FinishedOrders;