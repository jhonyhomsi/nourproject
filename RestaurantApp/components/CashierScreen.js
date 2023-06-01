import React from 'react';
import { View, Text, Button } from 'react-native';

const CashierScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Perform logout logic here
    navigation.replace('Login');
  };

  return (
    <View>
      <Text>Worker Missions</Text>
      <Button title="Exit" onPress={handleLogout} />
    </View>
  );
};

export default CashierScreen;