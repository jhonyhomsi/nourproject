import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.7:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Admin' }],
          });
        } else if (data.role === 'waitress') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Waitress' }],
          });
        } else if (data.role === 'client') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Client' }],
          });
        } else if (data.role === 'cleaner') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Cleaner' }],
          });
        } else if (data.role === 'cooker') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Cooker' }],
          });
        } else if (data.role === 'cashier') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Cashier' }],
          });
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in', error);
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;