import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function App() {
    const [text, setText] = useState("");
    const qrCodeRef = useRef<any>(null);

    const downloadQR = async () => {
        if (!qrCodeRef.current) return;

        qrCodeRef.current.toDataURL(async (data: string) => {
            try {
                const fileUri = FileSystem.cacheDirectory + "qrcode.png";
                await FileSystem.writeAsStringAsync(fileUri, data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    alert("Sharing is not available on this device");
                }
            } catch (error) {
                console.error("Error saving QR code:", error);
                alert("Failed to save QR Code");
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Generator</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter text or URL"
                value={text}
                onChangeText={setText}
            />
            <View style={styles.codeContainer}>
                <QRCode
                    value={text.trim() !== "" ? text.trim() : "placeholder"}
                    size={250}
                    getRef={(c) => (qrCodeRef.current = c)}
                />
            </View>
            <Pressable onPress={downloadQR} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Save or Share QR</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#34170D',
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderColor: "#fff",
        borderWidth: 1,
        width: "100%",
        marginBottom: 30,
        paddingHorizontal: 10,
        backgroundColor: '#34170D',
        color: '#fff',
        borderRadius: 50
    },
    codeContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 50,
        borderColor: "#34170D",
        borderWidth: 1,

    },
    buttonContainer: {
        backgroundColor: '#34170D',
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginTop: 30,
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 16,
        color:'#fff',
        fontWeight:'bold'
    }
});
