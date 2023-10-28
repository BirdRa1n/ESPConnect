import { GluestackUIProvider } from "@gluestack-ui/themed";
import React from "react";
import { useColorScheme } from "react-native";
import StackNavigation from "./src/navigation/stack.navigation";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  return (
    <GluestackUIProvider colorMode={isDarkMode ? "dark" : "light"}>
      <StackNavigation />
    </GluestackUIProvider>
  );
}
