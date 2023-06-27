import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const ClientScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('https://nourapp.onrender.com/menu');
      const menu = await response.json();
      setMenuItems(menu);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigation.replace('Login');
  };

  const handleOrder = (item) => {
    navigation.navigate('Order', { item });
  };

  const windowWidth = Dimensions.get('window').width;
  const fontSize = windowWidth * 0.04; // Adjust this multiplier to change the scaling

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
      <Text style={[styles.navbarTitle, { fontSize }]}>Jhony's Caffe</Text>
        <Button title="Exit" onPress={handleLogout} />
      </View>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <Image source={{ uri: `https://nourapp.onrender.com/${item.photo}` }} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Button title="Order" onPress={() => handleOrder(item)} />
          </View>
        ))}
      </ScrollView>
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
  menuContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 10,
    marginTop: 50,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 200,
  },
});

export default ClientScreen;