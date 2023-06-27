import React from 'react';
import { View, Text, Button } from 'react-native';

const CleanerScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Perform logout logic here
    navigation.replace('Login');
  };

  return (
    <View>
      <Text>Worker Missions</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default CleanerScreen;