import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppRegistry } from "react-native";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { graphqlUrl } from '@/config/api';

const client = new ApolloClient({
  link: new HttpLink({ uri: graphqlUrl }),
  cache: new InMemoryCache(),
});

// Prevent auto-hide so we control when splash disappears
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider>
          <RoleProvider>
            <Slot />
          </RoleProvider>
        </ThemeProvider>
      </AuthProvider>
      </ApolloProvider>
    </View>
  );
}

// AppRegistry.registerComponent("MyApplication", () => App);
