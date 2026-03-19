import { Text, StyleSheet, View, Style } from 'react-native'
import React, { Component } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";




const tab = createBottomTabNavigator();

function homescreen ({tabnavigation}) { 
    return (
      <View >
        <Text style={{
          fontSize: 30,
          textAlign: 'center',
          marginTop: "20%"
        }}>
          Home
        </Text>
      </View>
    )
  }

export default homescreen;


