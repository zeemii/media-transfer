import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ProgressBarAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';

const BackupScreen = ({route, navigation}) => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStatus, setBackupStatus] = useState('idle'); // idle, backing-up, completed, error
  const [backupedFiles, setBackupedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState('');

  const selectedMedia = route.params?.selectedMedia || [];

  useEffect(() => {
    if (selectedMedia.length > 0 && backupStatus === 'idle') {
      // Auto-start backup when screen loads with media
      startBackup();
    }
  }, [selectedMedia]);

  const startBackup = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('No Media', 'No media files to backup.');
      return;
    }

    setBackupStatus('backing-up');
    setBackupProgress(0);
    setBackupedFiles([]);

    try {
      const backupFolder = `${RNFS.DocumentDirectoryPath}/MediaBackup`;
      
      // Create backup folder if it doesn't exist
      const folderExists = await RNFS.exists(backupFolder);
      if (!folderExists) {
        await RNFS.mkdir(backupFolder);
      }

      const totalFiles = selectedMedia.length;
      const completedFiles = [];

      for (let i = 0; i < selectedMedia.length; i++) {
        const media = selectedMedia[i];
        setCurrentFile(media.fileName || `File ${i + 1}`);

        try {
          // Simulate backup process (in real app, this would upload to cloud)
          const fileName = media.fileName || `backup_${Date.now()}_${i}.jpg`;
          const destPath = `${backupFolder}/${fileName}`;
          
          // Copy file to backup location (simulating backup)
          await RNFS.copyFile(media.uri, destPath);
          
          completedFiles.push({
            ...media,
            backupPath: destPath,
            backupTime: new Date().toISOString(),
          });

          // Update progress
          const progress = (i + 1) / totalFiles;
          setBackupProgress(progress);
          setBackupedFiles([...completedFiles]);

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (fileError) {
          console.error('Error backing up file:', fileError);
          // Continue with next file even if one fails
        }
      }

      setBackupStatus('completed');
      setCurrentFile('');
      Alert.alert(
        'Backup Complete',
        `Successfully backed up ${completedFiles.length} of ${totalFiles} files.`,
      );
    } catch (error) {
      console.error('Backup error:', error);
      setBackupStatus('error');
      Alert.alert('Backup Failed', 'An error occurred during backup.');
    }
  };

  const resetBackup = () => {
    setBackupStatus('idle');
    setBackupProgress(0);
    setBackupedFiles([]);
    setCurrentFile('');
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Media Backup</Text>
          <Text style={styles.subtitle}>
            {selectedMedia.length > 0
              ? `${selectedMedia.length} files selected`
              : 'View your backup history'}
          </Text>
        </View>

        {backupStatus === 'idle' && selectedMedia.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No backup in progress</Text>
            <Text style={styles.emptySubtext}>
              Select media files first to start backup
            </Text>
            <TouchableOpacity style={styles.selectButton} onPress={goHome}>
              <Text style={styles.selectButtonText}>Select Media</Text>
            </TouchableOpacity>
          </View>
        )}

        {(backupStatus === 'backing-up' || backupStatus === 'completed') && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                {backupStatus === 'backing-up' ? 'Backing up...' : 'Backup Complete!'}
              </Text>
              <Text style={styles.progressText}>
                {Math.round(backupProgress * 100)}% ({backupedFiles.length}/{selectedMedia.length})
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${backupProgress * 100}%`},
                ]}
              />
            </View>

            {currentFile && (
              <Text style={styles.currentFile}>
                Processing: {currentFile}
              </Text>
            )}

            {backupStatus === 'completed' && (
              <View style={styles.completedActions}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={goHome}>
                  <Text style={styles.primaryButtonText}>Back to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={resetBackup}>
                  <Text style={styles.secondaryButtonText}>New Backup</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {backupedFiles.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={styles.filesTitle}>Backed up files:</Text>
            {backupedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName}>
                  ✓ {file.fileName || `File ${index + 1}`}
                </Text>
                <Text style={styles.fileTime}>
                  {new Date(file.backupTime).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {backupStatus === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>Backup Failed</Text>
            <Text style={styles.errorSubtext}>
              Please check your permissions and try again
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={startBackup}>
              <Text style={styles.retryButtonText}>Retry Backup</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
    marginBottom: 30,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  currentFile: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completedActions: {
    marginTop: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  filesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  fileTime: {
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 5,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BackupScreen;