import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import LottieView from "lottie-react-native";

import axios from "axios";
import { useColorMode, Divider, EyeOffIcon, EyeIcon } from '@gluestack-ui/themed';
import {
    ActionsheetItem,
    ActionsheetItemText,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Heading,
    Input,
    InputField,
    Text,
    Center,
    Box,
    Spinner,
    HStack,
    VStack,
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
    InputSlot,
    LockIcon,
    Icon
} from "@gluestack-ui/themed";

interface Network {
    ssid: string;
}

interface NetworkItemProps {
    network: Network;
    colormode: string;
    onSelect: (ssid: string) => void;
}

const NetworkItem: React.FC<NetworkItemProps> = ({ network, onSelect, colormode }) => (
    <ActionsheetItem onPress={() => onSelect(network.ssid)} sx={{ _dark: { bg: "$borderDark950" }, _light: { bg: "#F9F9F9" } }}>
        <HStack w={"100%"} justifyContent='space-between'>
            <ActionsheetItemText color={colormode === "dark" ? "white" : "#18181b"}>{network.ssid}</ActionsheetItemText>
            <FontAwesome5 name="wifi" size={25} color={colormode === "dark" ? "white" : "#18181b"} />
        </HStack>
    </ActionsheetItem>
);

interface ConfigESPProps {
    closeModal: () => void;
}

const ConfigWifiIoTDevice: React.FC<ConfigESPProps> = ({ closeModal }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showSSIDs, setShowSSIDs] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [ssid, setSSID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);


    const colormode = useColorMode()

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!showSSIDs && !showForm) {
                testConnection();
            }
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [showSSIDs]);

    const getNetworks = async () => {
        try {
            const response = await axios.get("http://192.168.4.1/networks");
            const result = response.data;
            setIsLoading(false);
            setNetworks(result.networks);
        } catch (error) {
            console.error(error);
        }
    };

    const testConnection = async () => {
        try {
            await axios.get("http://192.168.4.1", { timeout: 8000 });
            setShowSSIDs(true); setIsLoading(true);
            getNetworks()
        } catch (error) {
            showToast("Ops!", "A conexão com o dispositivo falhou. Tente novamente.", "error");
        }
    };

    const setConnection = async (selectedSSID: string, selectedPassword: string) => {
        try {
            await axios.get("http://192.168.4.1/setting", {
                params: {
                    ssid: selectedSSID,
                    pass: selectedPassword,
                },
            });
            closeModal();
            showToast("Sucesso!", `A rede ${selectedSSID} foi definida.`, "attention")
        } catch (error) {
            showToast("Ops!", "Ocorreu uma falha ao definir a rede WI-FI", "error");
        }
    };
    const toast = useToast();

    const showToast = async (title: string, description: string, type: string) => {
        toast.show({
            placement: "top",
            duration: 1500,
            render: ({ id }) => {
                return (
                    <Toast sx={{ _android: { top: 25 } }} action={type || "info"} variant={"accent"}>
                        <VStack space="xs">
                            <ToastTitle>{title}</ToastTitle>
                            <ToastDescription>
                                {description}
                            </ToastDescription>
                        </VStack>
                    </Toast>
                )
            },
        })
    }

    return (
        <Box p={20} marginBottom={10}>
            {!showForm && !showSSIDs || showSSIDs && isLoading ? (
                <Center p={10}>
                    <Box w={120} h={100}>
                        <LottieView
                            style={{ width: "100%", height: "100%" }}
                            source={require("../../../../assets/lottie-files/wifiLoading.json")}
                            autoPlay={true}
                            loop={true}
                        /></Box>
                </Center>
            ) : null}


            {showSSIDs && !isLoading ? (
                <VStack space="sm">
                    {networks?.map((network, key) => (
                        <VStack key={key}>
                            <NetworkItem
                                network={network}
                                colormode={colormode}
                                onSelect={(selectedSSID) => {
                                    setSSID(selectedSSID);
                                    setShowSSIDs(false);
                                    setShowForm(true);
                                }}
                            />
                        </VStack>

                    ))}
                </VStack>
            ) : null}

            {showForm ? (
                <>
                    <HStack marginBottom={15} alignItems="center" alignContent="center">
                        <Heading size="sm">{"WI-FI Selecionado: "}</Heading>
                        <Text fontSize={"$sm"}>{ssid}</Text>
                    </HStack>
                    <FormControl>
                        <FormControlLabel>
                            <FormControlLabelText>Senha</FormControlLabelText>
                        </FormControlLabel>
                        <Input variant="underlined" size="xl" sx={{ ":focus": { borderColor: "#6d28d9" } }}>
                            <InputField
                                placeholder=""
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={password}
                                onChangeText={(e) => setPassword(e)}
                                onSubmitEditing={() => {
                                    setConnection(ssid, password)
                                }}
                            />
                            <InputSlot pr="$3" onPress={() => { setShowPassword(!showPassword) }}>
                                <Icon as={showPassword ? EyeOffIcon : EyeIcon} />
                            </InputSlot>
                        </Input>
                    </FormControl>
                </>
            ) : null}
        </Box>
    );
};


export default ConfigWifiIoTDevice;