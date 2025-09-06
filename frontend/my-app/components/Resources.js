import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
const resourcesData = [
  {
    college: 'Select Your College',
    programs: [{ name: 'Select Program', driveLink: '' }],
  },
  {
    college: 'College of Science',
    programs: [
      { name: 'Select Program', driveLink: '' },
      { name: 'Acturial Science', driveLink: 'https://drive.google.com/drive/folders/1JGE8gDBP8gQA7w41fdyVrr3k6H6LOlCt?usp=drive_link' },
      { name: 'Computer Science', driveLink: 'https://drive.google.com/drive/folders/1hGYiCwHxcJe-hTYJnNH8yjzcZUApgFci?usp=drive_link' },
      { name: 'Biochemistry', driveLink: 'https://drive.google.com/drive/folders/1rAxSjTYLqM9jh8REBp-qhgOAhfuCSia_?usp=drive_link' },
      { name: 'Chemistry', driveLink: 'https://drive.google.com/drive/folders/1XFUnBjd8ms_0CdjH9ALmCK8bHu5qnkaW?usp=drive_link' },
      { name: 'Environmental Science', driveLink: 'https://drive.google.com/drive/folders/1oAmAFv_cP4rrr3DskBb7NzyuK2mFDS-f?usp=drive_link' }
    ],
  },
  {
    college: 'College of Engineering',
    programs: [
      { name: 'Select Program', driveLink: '' },
      { name: 'Aerospace Engineering', driveLink: 'https://drive.google.com/drive/folders/1x8T7EueeJh-wpweGt_ADe_YM_yRoIk5U?usp=drive_link' },
      { name: 'Biomedical Engineering', driveLink: 'https://drive.google.com/drive/folders/1D0beP5_GU9AVYiafBIdUv56JYaXMj1Qm?usp=drive_link' },
      { name: 'Chemical Engineering', driveLink: 'https://drive.google.com/drive/folders/15uHd0HhmLrwZmaLUquWu_Cs-G5EPt3fQ?usp=drive_link' },
      { name: 'Computer Engineering', driveLink: 'https://drive.google.com/drive/folders/14fHKGrC3O4bFC3siYxpFU2I5vKodFzcG?usp=drive_link' },
      { name: 'Geomatic Engineering', driveLink: 'https://drive.google.com/drive/folders/1sKRn7x8TPZPniyrdWphFwgTxfr-nSiAf?usp=drive_link' }
    ],
  },
  {
    college: 'College of Humanities',
    programs: [
      { name: 'Select Program', driveLink: '' },
      { name: 'English Literature', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
      { name: 'History', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
      { name: 'Sociology', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
    ],
  },
  {
    college: 'College of Business',
    programs: [
      { name: 'Select Program', driveLink: '' },
      { name: 'Marketing', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
      { name: 'Finance', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
      { name: 'Accounting', driveLink: 'https://drive.google.com/drive/folders/1-xS87BlZ10NyeZIsjkGVL8F66bUsjKZv?usp=drive_link' },
    ],
  },
];

const Resources = () => {
  const [selectedCollege, setSelectedCollege] = useState(resourcesData[0].college);
  const [availablePrograms, setAvailablePrograms] = useState(resourcesData[0].programs);
  const [selectedProgram, setSelectedProgram] = useState(availablePrograms[0].name);
  const [currentDriveLink, setCurrentDriveLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

    useFocusEffect(
      useCallback(() => {
        const parent = navigation.getParent();
  
        // Ensure a parent exists before trying to set options on it
        if (parent) {
          // Set options when CareerHub is focused
          parent.setOptions({
            headerTitle: 'Resources',
            headerTitleStyle: { padding: 10 },
            headerRight: () => (
              <View
                style={{
                  marginRight: 20,
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}>
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={24}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="person-circle-outline" size={24}></Ionicons>
                </TouchableOpacity>
              </View>
            ),
          });
        }
  
        // Cleanup function: runs when CareerHub screen loses focus
        return () => {
          if (parent) {
            // Reset header options on the parent navigator
            parent.setOptions({
              headerTitle: 'Updates', // Clear the title
              headerTitleStyle: {padding:10}, // Reset style if needed
              headerRight: () => ( // Set back to your default headerRight for other tabs
                <View
                  style={{
                    marginRight: 20,
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Search');
                    }}
                    // style={{
                    //   flexDirection: 'row',
                    //   gap: 10,
                    //   alignItems: 'center',
                    //   borderWidth: 1,
                    //   borderRadius: 20,
                    //   paddingHorizontal: 20,
                    //   alignSelf: 'center',
                    //   width: 230,
                    //   marginTop: 2,
                    //   backgroundColor: '#fff',
                    //   paddingVertical: 10,
                    //   height: 40,
                    // }}
                    >
                    <Ionicons name="search-outline" size={24} />
                    {/* <Text>Search updates....</Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24}></Ionicons>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="person-circle-outline" size={24}></Ionicons>
                  </TouchableOpacity>
                </View>
              ),
            });
          }
        };
      }, [navigation]) // Dependency array should include navigation
    );

  useEffect(() => {
    const collegeData = resourcesData.find(data => data.college === selectedCollege);
    if (collegeData) {
      setAvailablePrograms(collegeData.programs);
      setSelectedProgram(collegeData.programs[0].name);
      setCurrentDriveLink('');
    }
  }, [selectedCollege]);

  useEffect(() => {
    const programData = availablePrograms.find(program => program.name === selectedProgram);
    if (programData) {
      setCurrentDriveLink(programData.driveLink);
    } else {
      setCurrentDriveLink('');
    }
  }, [selectedProgram, availablePrograms]);

  const handleAccessMaterials = async () => {
    if (!currentDriveLink) {
      Alert.alert('Selection Required', 'Please select both your college and program of study to access materials.');
      return;
    }

    setIsLoading(true);
    try {
      const supported = await Linking.canOpenURL(currentDriveLink);
      if (supported) {
        await Linking.openURL(currentDriveLink);
      } else {
        Alert.alert('Cannot Open Link', 'Make sure you have a browser or Google Drive installed.');
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Error', 'An error occurred while opening the link.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAccessButtonDisabled = !selectedCollege || selectedCollege === resourcesData[0].college || !selectedProgram || selectedProgram === availablePrograms[0].name || !currentDriveLink;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="library-outline" size={60} color="#2c3e50" />
          <Text style={styles.title}>Resources Hub</Text>
          <Text style={styles.subtitle}>
            Select your college and program to access lecture notes and resources.
          </Text>
        </View>

        <View style={styles.selectionCard}>
          <Text style={styles.label}>Select Your College:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCollege}
              onValueChange={itemValue => setSelectedCollege(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {resourcesData.map((data, index) => (
                <Picker.Item key={index} label={data.college} value={data.college} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Select Your Program:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedProgram}
              onValueChange={itemValue => setSelectedProgram(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              enabled={selectedCollege !== resourcesData[0].college}
            >
              {availablePrograms.map((program, index) => (
                <Picker.Item key={index} label={program.name} value={program.name} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, isAccessButtonDisabled && styles.buttonDisabled]}
            onPress={handleAccessMaterials}
            disabled={isAccessButtonDisabled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Access Materials</Text>
                <Ionicons name="arrow-forward-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Important Notes:</Text>
          <Text style={styles.infoText}>Ensure you are logged into your school email for access.</Text>
          <Text style={styles.infoText}>You may need the Google Drive app or a browser to view resources.</Text>
          <TouchableOpacity onPress={() => Alert.alert('Support', 'Contact: support@university.edu')}>
            <Text style={styles.contactText}>Need Help? Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c7a89',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  selectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
    marginTop: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dcdfe3',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#2c3e50',
  },
  pickerItem: {
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0cde4',
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  infoBox: {
    backgroundColor: '#eaf4f7',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#5e7188',
    marginBottom: 8,
    lineHeight: 20,
  },
  contactText: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default Resources;