import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultStyles from "../../styles/styles";

const InputField = ({ label, error, secureTextEntry, ...props }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure((prevState) => !prevState);
  };

  return (
    <View style={styles.inputContainer}>
      {label && <Text style={defaultStyles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          style={[defaultStyles.input, styles.inputField]}
          placeholderTextColor="#888"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.iconWrapper}
          >
            <Ionicons
              name={isSecure ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={defaultStyles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: "80%", // Restrict input width
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    backgroundColor: "#fff",
  },
  inputField: {
    flex: 1,
    fontSize: 18,
  },
  iconWrapper: {
    marginLeft: 8,
  },
});

export default InputField;
