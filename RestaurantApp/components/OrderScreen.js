import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OrderForm = ({ route, navigation }) => {
  const { item } = route.params;
  const [tableNumber, setTableNumber] = useState('');
  const [juiceName, setJuiceName] = useState('');
  const [isProductAvailable, setIsProductAvailable] = useState(null); // Initialize as null

  useEffect(() => {
    checkProductAvailability(); // Check product availability on component mount
  }, []);

  const checkProductAvailability = async () => {
    try {
      const response = await fetch(`http://192.168.1.7:5000/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ juiceName }), // Send juiceName in the request body
      });

      const data = await response.json();
      console.log(data);
      setIsProductAvailable(data.available);
    } catch (error) {
      console.error('Error checking product availability:', error);
    }
  };
  

  const handleOrder = async () => {
    try {
      // Send the order data to the server
      const response = await fetch('http://192.168.1.7:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber,
          itemName: item.name,
          juiceName,
        }),
      });

      if (response.ok) {
        alert('Order placed successfully');
      } else {
        console.error('Failed to place order');
      }

      // Reset form values
      setTableNumber('');
      setJuiceName('');

      // Navigate back to the menu
      navigation.goBack();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Form</Text>
      <Text style={styles.itemName}>Selected Item: {item.name}</Text>
      <Text style={styles.label}>Table Number:</Text>
      <TextInput
        style={styles.input}
        value={tableNumber}
        onChangeText={setTableNumber}
        placeholder="Enter table number"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Juice Name (optional):</Text>
      <TextInput
        style={styles.input}
        value={juiceName}
        onChangeText={(text) => {
          setJuiceName(text);
          setIsProductAvailable(true); // Reset product availability on text change
        }}
        placeholder="Enter juice name"
      />
      {isProductAvailable === null && (
        <Text style={styles.notification}>Checking product availability...</Text>
      )}
      {isProductAvailable === false && (
        <Text style={styles.notification}>Product is not available in stock</Text>
      )}
      <Button title="Place Order" onPress={handleOrder} disabled={!isProductAvailable} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  notification: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
});

export default OrderForm;