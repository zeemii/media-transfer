import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const MediaPickerScreen = ({navigation}) => {
  const [selectedMedia, setSelectedMedia] = useState([]);

  const selectMedia = () => {
    const options = {
      mediaType: 'mixed',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 10,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      if (response.assets) {
        setSelectedMedia([...selectedMedia, ...response.assets]);
      }
    });
  };

  const removeMedia = (index) => {
    const updatedMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(updatedMedia);
  };

  const startBackup = () => {
    if (selectedMedia.length === 0) {
      Alert.alert('No Media Selected', 'Please select some media files first.');
      return;
    }
    navigation.navigate('Backup', {selectedMedia});
  };

  const renderMediaItem = ({item, index}) => (
    <View style={styles.mediaItem}>
      <Image source={{uri: item.uri}} style={styles.mediaThumbnail} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeMedia(index)}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.mediaInfo} numberOfLines={1}>
        {item.fileName || 'Unknown'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Media Files</Text>
          <Text style={styles.subtitle}>
            Choose photos and videos to backup
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.selectButton} onPress={selectMedia}>
            <Text style={styles.selectButtonText}>📷 Select Media</Text>
          </TouchableOpacity>
          
          <Text style={styles.selectedCount}>
            Selected: {selectedMedia.length} files
          </Text>
        </View>

        <View style={styles.mediaContainer}>
          {selectedMedia.length > 0 ? (
            <FlatList
              data={selectedMedia}
              renderItem={renderMediaItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={styles.emptyText}>No media selected yet</Text>
              <Text style={styles.emptySubtext}>
                Tap "Select Media" to choose files
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[
              styles.backupButton,
              selectedMedia.length === 0 && styles.disabledButton,
            ]}
            onPress={startBackup}
            disabled={selectedMedia.length === 0}>
            <Text style={styles.backupButtonText}>
              Start Backup ({selectedMedia.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mediaContainer: {
    flex: 1,
    marginBottom: 20,
  },
  mediaItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    maxWidth: '45%',
  },
  mediaThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginBottom: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mediaInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomActions: {
    paddingVertical: 20,
  },
  backupButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  backupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MediaPickerScreen;