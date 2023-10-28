import { Box, Center, HStack, Heading, Text, useColorMode } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

//icons
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import ConfigWifiIoTDevice from "../components/home/configIoTDevice";
import axios from "axios";
import DeviceInfo from "../components/home/deviceInfo";

interface HomeProps {
    navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [showDevice, setShowDevice] = useState<boolean>(false);
    const [devicFound, setDeviceFound] = useState(false);
    const [device, setDevice] = useState([]);
    const [availableNetworks, setAvailableNetworks] = useState([])

    const modalRef = useRef<Modalize | null>(null);

    const openModal = (modalType: string): void => {
        if (modalRef.current) {
            modalRef.current.open();
        }
    };


    const closeModal = (): void => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            !devicFound ? getDeviceInfo()
                : null;
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const insets = useSafeAreaInsets();

    const getDeviceInfo = () => {
        axios
            .get("http://192.168.4.1/deviceinfo", { timeout: 4000 })
            .then((res) => {
                setDevice(res?.data);
                setDeviceFound(true);

                getAvailableNetworks()
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAvailableNetworks = () => {
        axios
            .get("http://192.168.4.1/networks", { timeout: 4000 })
            .then((res) => {
                setAvailableNetworks(res?.data?.networks);
                setShowDevice(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const renderContent = (): JSX.Element | null => {
        return <ConfigWifiIoTDevice closeModal={closeModal} />;
    };

    const ColorMode = useColorMode();

    return (
        <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
            <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }}>
                <Box
                    w={"100%"}
                    h={"100%"}
                    marginTop={insets.top}
                    marginBottom={insets.bottom}
                    p={10}
                >
                    <HStack justifyContent="space-between" w={"100%"}>
                        <HStack>
                            <Heading fontSize={"$2xl"} color="$violet700" >ESP</Heading>
                            <Heading fontSize={"$2xl"} color="$textLight800" sx={{ _dark: { color: "white" } }}>Connect</Heading>
                        </HStack>

                        <Heading color="$textLight800" sx={{ _dark: { color: "white" } }}>
                            <MaterialCommunityIcons
                                name="wifi-cog"
                                size={27}
                                onPress={() => {
                                    openModal("config");
                                }}
                            />
                        </Heading>
                    </HStack>
                    {!showDevice ? (
                        <Center h={"90%"} w={"100%"}>
                            <Box w={190} h={190} marginLeft={6}>
                                <LottieView
                                    style={{ width: "100%", height: "100%" }}
                                    source={require("../../assets/lottie-files/finding.json")}
                                    autoPlay={true}
                                    loop={true}
                                />

                            </Box>
                            <Text marginLeft={10} textAlign="center">Searching for Device</Text>
                        </Center>
                    ) : (
                        <ScrollView>
                            <DeviceInfo DeviceInfo={device} networks={availableNetworks} />

                        </ScrollView>
                    )}
                </Box>
            </Box>
            <Modalize ref={modalRef} adjustToContentHeight modalStyle={{ backgroundColor: ColorMode == "dark" ? "#171717" : "white" }}>
                {renderContent()}
            </Modalize>
        </GestureHandlerRootView>
    );
};

export default Home;
