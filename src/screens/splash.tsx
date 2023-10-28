import { Box, Center, Spinner, VStack, Text } from "@gluestack-ui/themed"
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

interface SplashProps {
    navigation: any
}

const Splash: React.FC<SplashProps> = ({ navigation }) => {
    const animationRef = useRef<LottieView | null>(null);

    return (<>
        <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }}>
            <Center h={"100%"}>

                <Box w={120} h={100}>
                    <LottieView
                        ref={animationRef}
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/lottie-files/wifiLoading.json")}
                        onAnimationFinish={() => navigation.navigate('home')}
                        autoPlay={true}
                        loop={false}
                    /></Box>
            </Center>
        </Box>
    </>)
}

export default Splash