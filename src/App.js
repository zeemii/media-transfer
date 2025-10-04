import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import MediaPickerScreen from './screens/MediaPickerScreen';
import BackupScreen from './screens/BackupScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{title: 'Media Transfer'}}
          />
          <Stack.Screen 
            name="MediaPicker" 
            component={MediaPickerScreen} 
            options={{title: 'Select Media'}}
          />
          <Stack.Screen 
            name="Backup" 
            component={BackupScreen} 
            options={{title: 'Backup Progress'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;