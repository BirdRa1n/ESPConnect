import React from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    HStack,
    Heading,
    Input,
    InputField,
    useColorMode,
} from "@gluestack-ui/themed";
import { DataTable } from 'react-native-paper';

interface DeviceInfoProps {
    DeviceInfo: {
        macAddress: string,
        localIP: string,
        chipID: number,
        flashChipID: number,
        flashChipSize: number,
    },
    networks: {
        ssid: string,
        rssi: number,
        encryption: number,
    }[];
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ DeviceInfo, networks }) => {
    const ColorMode = useColorMode();

    function getWiFiSecurityType(encryption: number): string {
        switch (encryption) {
            case 0:
                return "No security (Open)";
            case 1:
                return "WEP (Wired Equivalent Privacy)";
            case 2:
                return "WPA (Wi-Fi Protected Access)";
            case 3:
                return "WPA2 (Wi-Fi Protected Access 2)";
            case 4:
                return "WPA3 (Wi-Fi Protected Access 3)";
            default:
                return "Other security methods";
        }
    }

    // Exemplo de uso:
    const securityType = getWiFiSecurityType(4); // Isso retornará "WPA3 (Wi-Fi Protected Access 3)"


    return (
        <>
            <Box w={"100%"} h={"88%"}>
                <Heading marginTop={19} marginBottom={10}>Device</Heading>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Model</FormControlLabelText>
                    </FormControlLabel>
                    <Input isDisabled={true}>
                        <InputField value="Unknown" />
                    </Input>
                </FormControl>

                <HStack w={"100%"} space="sm" marginTop={5}>
                    <FormControl w={"49%"}>
                        <FormControlLabel>
                            <FormControlLabelText>Local IP</FormControlLabelText>
                        </FormControlLabel>
                        <Input isDisabled={true}>
                            <InputField value={DeviceInfo?.localIP || "0"} />
                        </Input>
                    </FormControl>
                    <FormControl w={"49%"}>
                        <FormControlLabel>
                            <FormControlLabelText>MAC Address</FormControlLabelText>
                        </FormControlLabel>
                        <Input isDisabled={true}>
                            <InputField value={DeviceInfo?.macAddress || "0"} />
                        </Input>
                    </FormControl>
                </HStack>

                <HStack w={"100%"} space="sm" marginTop={5}>
                    <FormControl w={"49%"}>
                        <FormControlLabel>
                            <FormControlLabelText>Chip ID</FormControlLabelText>
                        </FormControlLabel>
                        <Input isDisabled={true}>
                            <InputField value={String(DeviceInfo?.chipID)} />
                        </Input>
                    </FormControl>
                    <FormControl w={"49%"}>
                        <FormControlLabel>
                            <FormControlLabelText>Flash Chip Size</FormControlLabelText>
                        </FormControlLabel>
                        <Input isDisabled={true}>
                            <InputField value={`${DeviceInfo.flashChipSize / (1024 * 1024)} MB`} />
                        </Input>
                    </FormControl>
                </HStack>

                {/* Renderize as redes em uma tabela */}
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>SSID</DataTable.Title>
                        <DataTable.Title textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>RSSI</DataTable.Title>
                        <DataTable.Title textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>ENCRYPTION</DataTable.Title>
                    </DataTable.Header>

                    {networks.map((network, index) => (
                        <DataTable.Row key={index} >
                            <DataTable.Cell textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>{network.ssid}</DataTable.Cell>
                            <DataTable.Cell textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>{network.rssi}</DataTable.Cell>
                            <DataTable.Title textStyle={{ color: ColorMode == "dark" ? "white" : "black" }}>{getWiFiSecurityType(network?.encryption)}</DataTable.Title>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </Box>
        </>
    );
}

export default DeviceInfo;
