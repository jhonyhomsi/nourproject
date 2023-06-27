import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const AdminScreen = ({ navigation }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [dataStock, setDataStock] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [dataForm, setDataForm] = useState({
    role: '',
    mission: '',
  });
  const [stockData, setStockData] = useState({
    productName: '',
    quantity: '',
    price: '',
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch('https://nourapp.onrender.com/stocks');
      if (response.ok) {
        const data = await response.json();
        setDataStock(data);
      } else {
        console.error('Failed to fetch stock data');
      }
    } catch (error) {
      //ERROR DETECTING
      console.error('Failed to connect to server:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://nourapp.onrender.com/AddUser', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',zz
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User registered successfully');
      } else {
        const errorResponse = await response.json();
        console.error('Failed to register user:', errorResponse.error);
      }
    } catch (error) {
      console.error('Failed to connect to server:', error);
    }
  };

  const handleMissions = async () => {
    try {
      const missionData = { ...dataForm, enumeration: 'Your Enumeration Value' };

      const response = await fetch('https://nourapp.onrender.com/AddMissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
      });

      if (response.ok) {
        console.log('Mission Is Added Successfully');
      } else {
        const errorResponse = await response.json();
        console.error('Failed to Add Mission:', errorResponse.error);
      }
    } catch (error) {
      console.error('Failed to connect to server:', error);
    }
  };

  const handleStock = async () => {
    try {
      const { productName, quantity, price } = stockData;

      if (productName === '' || quantity === '' || price === '') {
        console.error('Incomplete stock data');
        return;
      }

      const response = await fetch('https://nourapp.onrender.com/AddStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData),
      });

      if (response.ok) {
        console.log('Stock added successfully');
        fetchStockData();
        setStockData({
          productName: '',
          quantity: '',
          price: '',
        });
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add stock:', errorResponse.error);
      }
    } catch (error) {
      console.error('Failed to connect to server:', error);
    }
  };

  const handleFormChange = (formName) => {
    setActiveForm(formName);
  };

  const handleChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleMissionChange = (name, value) => {
    setDataForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleStockChange = (field, value) => {
    setStockData((prevData) => ({ ...prevData, [field]: value }));

    const { productName, quantity, price } = stockData;
    setIsFormValid(productName !== '' && quantity !== '' && price !== '');
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('https://nourapp.onrender.com/stocks');
        const data = await response.json();
        setDataStock(data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Admin Panel</Text>
        <Button title="Add Users" onPress={() => handleFormChange('users')} />
        <Button title="Add Missions" onPress={() => handleFormChange('missions')} />
        <Button title="Stock" onPress={() => handleFormChange('stock')} />
        <Button title="Exit" onPress={handleLogout} />
      </View>
      <ScrollView style={styles.content}>
        {activeForm === 'users' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Users</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Role'
              value={formData.role}
              onChangeText={(text) => handleChange('role', text)}
            />  
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        )}
        {activeForm === 'missions' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Missions</Text>
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={dataForm.role}
              onChangeText={(text) => handleMissionChange('role', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mission"
              value={dataForm.mission}
              onChangeText={(text) => handleMissionChange('mission', text)}
            />
            <Button title="Submit" onPress={handleMissions} />
          </View>
        )}
        {activeForm === 'stock' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={stockData.productName}
              onChangeText={(text) => handleStockChange('productName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={stockData.quantity}
              onChangeText={(text) => handleStockChange('quantity', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={stockData.price}
              onChangeText={(text) => handleStockChange('price', text)}
            />
            <Button title="Submit" onPress={handleStock} disabled={!isFormValid} />
          </View>
        )}
      </ScrollView>
      <ScrollView>
        {dataStock.map((item, index) => (
          <View key={index} style={styles.stockItem}>
            <Text>{item.productName}</Text>
            <Text>{item.quantity}</Text>
            <Text>{item.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  navbarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4.445,
    marginTop: -20,
    paddingTop: 19,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default AdminScreen;