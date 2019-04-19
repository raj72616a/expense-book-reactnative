import React from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator  } from "react-navigation";
import CalendarScreen from "./screens/CalendarScreen";
import DayScreen from "./screens/DayScreen";
import SideMenu from "./screens/SideMenu";
import MiniCalc from "./screens/MiniCalc";
import SignUp from "./screens/SignUp";
import IOSIcon from "react-native-vector-icons/Ionicons";

const stackNav = createStackNavigator({
          Home: {
            screen: CalendarScreen,
            navigationOptions: ({ navigation }) => ({
              title: 'Expense Calendar',
              headerLeft : (<TouchableOpacity style={{marginLeft:15}} onPress={() => navigation.openDrawer()}>
                              <IOSIcon name="ios-menu" size={30} />
                            </TouchableOpacity>),
              headerStyle : {
                 backgroundColor: 'skyblue'
              }
            })
          },
          Day: DayScreen,
          MiniCalc: MiniCalc,
          SignUp: SignUp
        },{
          initialRouteName: "Home",
          defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: 'skyblue',
            }
          }
        });

export default createAppContainer(
    createDrawerNavigator({
      Item1: {screen: stackNav}
    },{
      contentComponent: SideMenu,
      drawerWidth: 180, 
    })
  );

