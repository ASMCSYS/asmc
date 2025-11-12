import React, {Fragment, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useHandleImageUpload} from '../../hooks/useCommon.js';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../helpers/constants';

const ImageUpload = ({fieldName, value, onChange}) => {
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const {mutate: uploadImage} = useHandleImageUpload();

  const selectImageSource = async () => {
    Alert.alert(
      'Choose an option',
      'Select an image from your gallery or take a new photo',
      [
        {text: 'Camera', onPress: () => handleSelectImage('camera')},
        {text: 'Gallery', onPress: () => handleSelectImage('gallery')},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  const handleSelectImage = async source => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.errorMessage || 'Failed to pick image',
        });
        return;
      }

      if (result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0];
        setLoading(true);
        const formData = new FormData();
        formData.append('image', {
          uri: selectedAsset.uri,
          type: 'image/jpeg',
          name: selectedAsset.fileName
            ? selectedAsset.fileName.toLowerCase()
            : 'upload.jpg',
        });

        uploadImage(formData, {
          onSuccess: result => {
            setLoading(false);
            if (result?.success) {
              onChange(result?.result?.path);
              Toast.show({
                type: 'success',
                text1: 'Image uploaded successfully',
              });
            } else {
              Toast.show({
                type: 'error',
                text1: result?.message || 'Image upload failed',
              });
            }
          },
          onError: error => {
            setLoading(false);
            Toast.show({
              type: 'error',
              text1: error?.message || 'Image upload failed',
            });
          },
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: error?.message || 'An error occurred during image upload',
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Fragment>
          <TouchableOpacity
            onPress={selectImageSource}
            style={styles.uploadButton}>
            <Text style={styles.uploadText}>
              {value ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>
          {value && (
            <TouchableOpacity onPress={() => setShowImage(true)}>
              <Image source={{uri: value}} style={styles.profilePreview} />
            </TouchableOpacity>
          )}
        </Fragment>
      )}

      {/* show image modal here */}
      <Modal
        visible={showImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImage(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setShowImage(false)}
          />
          <View style={styles.modalContent}>
            <Image source={{uri: value}} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImage(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  uploadText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  profilePreview: {
    width: 80,
    height: 80,
    marginLeft: 16,
    borderRadius: 8,
  },
  profilePreview: {
    width: 80,
    height: 80,
    marginLeft: 16,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default ImageUpload;
