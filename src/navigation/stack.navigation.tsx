import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    useColorMode,
} from "@gluestack-ui/themed";

//screens
import Splash from "../screens/splash";
import Home from "../screens/home";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Host } from "react-native-portalize";


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const colormode = useColorMode();
    return (

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colormode == "dark" ? "black" : "white", // Cor de fundo do header
                    },
                    headerTintColor: colormode == "dark" ? "white" : "black",
                    gestureEnabled: false
                }}
            >
                <Stack.Screen
                    name="splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="home"
                    component={Home}
                    options={{ headerShown: false, title: "ESP Connect", headerTitleAlign: 'left', headerBackVisible: false, headerShadowVisible: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigation;
