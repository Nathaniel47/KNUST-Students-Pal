import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const Scheduler = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete Physics Assignment',
      course: 'Physics 101',
      type: 'assignment',
      dueDate: '2025-08-05',
      priority: 'high',
      completed: false,
      description: 'Chapter 3 problems 1-15',
    },
    {
      id: '2',
      title: 'Study for Math Midterm',
      course: 'Calculus I',
      type: 'exam',
      dueDate: '2025-08-08',
      priority: 'high',
      completed: false,
      description: 'Review chapters 1-5',
    },
  ]);

  const [courses, setCourses] = useState([
    'Physics 101',
    'Calculus I',
    'Computer Science',
    'English Literature',
    'Chemistry',
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentView, setCurrentView] = useState('today'); // today, week, all
  const [editingTask, setEditingTask] = useState(null);

  const navigation = useNavigation();

    useFocusEffect(
      useCallback(() => {
        const parent = navigation.getParent();
  
        // Ensure a parent exists before trying to set options on it
        if (parent) {
          // Set options when CareerHub is focused
          parent.setOptions({
            headerTitle: 'Schedule Tasks',
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
              headerTitle: '', // Clear the title
              headerTitleStyle: {}, // Reset style if needed
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
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 20,
                      paddingHorizontal: 20,
                      alignSelf: 'center',
                      width: 230,
                      marginTop: 2,
                      backgroundColor: '#fff',
                      paddingVertical: 10,
                      height: 40,
                    }}>
                    <Ionicons name="search-outline" size={20} />
                    <Text>Search updates....</Text>
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

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    type: 'assignment',
    dueDate: '',
    priority: 'medium',
    description: '',
  });

  const taskTypes = [
    { label: 'Assignment', value: 'assignment' },
    { label: 'Exam', value: 'exam' },
    { label: 'Project', value: 'project' },
    { label: 'Study', value: 'study' },
    { label: 'Reading', value: 'reading' },
  ];

  const priorities = [
    { label: 'Low', value: 'low', color: '#2ecc71' },
    { label: 'Medium', value: 'medium', color: '#f39c12' },
    { label: 'High', value: 'high', color: '#e74c3c' },
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      course: '',
      type: 'assignment',
      dueDate: '',
      priority: 'medium',
      description: '',
    });
    setEditingTask(null);
  };

  const openModal = (task = null) => {
    if (task) {
      setFormData({
        title: task.title,
        course: task.course,
        type: task.type,
        dueDate: task.dueDate,
        priority: task.priority,
        description: task.description,
      });
      setEditingTask(task);
    } else {
      resetForm();
    }
    setIsModalVisible(true);
  };

  const saveTask = () => {
    if (!formData.title || !formData.course || !formData.dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      completed: editingTask ? editingTask.completed : false,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task));
    } else {
      setTasks([...tasks, taskData]);
    }

    setIsModalVisible(false);
    resetForm();
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setTasks(tasks.filter(task => task.id !== taskId));
        }},
      ]
    );
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getFilteredTasks = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    switch (currentView) {
      case 'today':
        return tasks.filter(task => task.dueDate === todayStr);
      case 'week':
        return tasks.filter(task => task.dueDate >= todayStr && task.dueDate <= nextWeekStr);
      case 'all':
      default:
        return tasks;
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'assignment': return 'document-text-outline';
      case 'exam': return 'school-outline';
      case 'project': return 'construct-outline';
      case 'study': return 'book-outline';
      case 'reading': return 'library-outline';
      default: return 'list-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  const TaskItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.taskCompleted]}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={styles.taskCheckbox}
          onPress={() => toggleTaskCompletion(item.id)}
        >
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? '#2ecc71' : '#bdc3c7'}
          />
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
            {item.title}
          </Text>
          <Text style={styles.taskCourse}>{item.course}</Text>
          {item.description ? (
            <Text style={styles.taskDescription}>{item.description}</Text>
          ) : null}
        </View>

        <View style={styles.taskMeta}>
          <Ionicons
            name={getTaskIcon(item.type)}
            size={20}
            color="#7f8c8d"
            style={styles.taskIcon}
          />
          <View style={[
            styles.priorityBadge,
            { backgroundColor: priorities.find(p => p.value === item.priority)?.color }
          ]} />
        </View>
      </View>

      <View style={styles.taskFooter}>
        <Text style={[
          styles.taskDate,
          isOverdue(item.dueDate) && !item.completed && styles.taskOverdue
        ]}>
          Due: {formatDate(item.dueDate)}
          {isOverdue(item.dueDate) && !item.completed && ' (Overdue)'}
        </Text>
        
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openModal(item)}
          >
            <Ionicons name="create-outline" size={20} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteTask(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const filteredTasks = getFilteredTasks().sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Scheduler</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['today', 'week', 'all'].map((view) => (
          <TouchableOpacity
            key={view}
            style={[
              styles.filterButton,
              currentView === view && styles.filterButtonActive
            ]}
            onPress={() => setCurrentView(view)}
          >
            <Text style={[
              styles.filterText,
              currentView === view && styles.filterTextActive
            ]}>
              {view === 'today' ? 'Today' : view === 'week' ? 'This Week' : 'All Tasks'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubtext}>
              {currentView === 'today' ? 'No tasks due today' : 
               currentView === 'week' ? 'No tasks this week' : 
               'Add your first task to get started'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={({ item }) => <TaskItem item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={saveTask}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Enter task title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Course *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.course}
                  onValueChange={(value) => setFormData({...formData, course: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Course" value="" />
                  {courses.map((course, index) => (
                    <Picker.Item key={index} label={course} value={course} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                    style={styles.picker}
                  >
                    {taskTypes.map((type) => (
                      <Picker.Item key={type.value} label={type.label} value={type.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.priority}
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                    style={styles.picker}
                  >
                    {priorities.map((priority) => (
                      <Picker.Item key={priority.value} label={priority.label} value={priority.value} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Due Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.dueDate}
                onChangeText={(text) => setFormData({...formData, dueDate: text})}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Add task description..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterTextActive: {
    color: '#fff',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskCompleted: {
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  taskCourse: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  taskMeta: {
    alignItems: 'center',
  },
  taskIcon: {
    marginBottom: 8,
  },
  priorityBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  taskDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  taskOverdue: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
});

export default Scheduler;