import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WaitressScreen = ({ navigation }) => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('https://nourapp.onrender.com/missions');
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          setMissions(data.missions);
        } else {
          console.error('Failed to fetch missions. Server returned status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };    
  
    fetchMissions();
  }, []);
  
  const handleMissionDone = async (missionNumber) => {
    try {
      const response = await fetch(`https://nourapp.onrender.com/missions/${missionNumber}/confirm`, {
        method: 'DELETE', // Use DELETE method instead of POST
      });
  
      if (response.ok) {
        console.log('Mission confirmed as done');
        setMissions(prevMissions =>
          prevMissions.filter(mission => mission.missionNumber !== missionNumber) // Remove the mission from the state
        );
      } else {
        const errorResponse = await response.json();
        console.error('Failed to confirm mission:', errorResponse.error);
      }
    } catch (error) {
      console.error('Failed to connect to server:', error);
    }
  };
  
  const handleShowFinishedOrders = () => {
    // Logic for navigating to the FinishedScreen
    navigation.navigate('Finished'); // Replace 'FinishedScreen' with the correct screen name
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Waitress Screen</Text>
        <Button title="Exit" onPress={handleLogout} />
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Missions</Text>
        <View style={styles.container}>
          {missions.map((mission, index) => (
            <View key={index} style={styles.missionContainer}>
              <Text style={styles.missionText}>{mission.role}</Text>
              <Text style={styles.missionText}>{mission.mission}</Text>
              {!mission.done && (
                <Button
                  title="Confirm"
                  onPress={() => handleMissionDone(mission.missionNumber)}
                />
              )}
            </View>
          ))}
          <Button title="Click Me To See The Finished Orders" onPress={handleShowFinishedOrders} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  content: {
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
  missionContainer: {
    marginBottom: 10,
  },
  missionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WaitressScreen;