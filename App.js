import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

class TextInputWithBorderColor extends Component {
  render() {
    return (
      <TextInput
        style={styles.input}
        placeholder={this.props.placeholder}
        placeholderTextColor="#F0E3CA"
        onChangeText={this.props.onChangeText}
        value={this.props.value}
      />
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      about: '',
      todos: [],
      selectedIndex: null,
      isModalVisible: false,
      modalVisible: false,
      miniInput: '',
      maxInput: '',
    };
  }

  handleAdd = () => {
    const { title, about, todos } = this.state;
    if (title !== '' && about !== '') {
      todos.push({ title, about });
      this.setState({ title: '', about: '' });
    } else {
      Alert.alert('Please enter a title and about');
    }
  };

  handleCrossClick = index => {
    this.setState({ selectedIndex: index });
  };

  handleDeleteTask = () => {
    const { todos, selectedIndex } = this.state;
    todos.splice(selectedIndex, 1);
    this.setState({ todos, selectedIndex: null, isModalVisible: false });
  };

  handleSave = () => {
    const { todos, selectedIndex, miniInput, maxInput } = this.state;
    if (miniInput !== '' && maxInput !== '') {
      const updatedTodos = [...todos];
      updatedTodos[selectedIndex].title = miniInput;
      updatedTodos[selectedIndex].about = maxInput;
      this.setState({ todos: updatedTodos, modalVisible: false });
    } else {
      Alert.alert('Please Enter required input fields');
    }
  };

  renderDeleteModal = () => {
    const { isModalVisible, buttonPressed } = this.state;

    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => this.setState({ isModalVisible: false })}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Delete this task?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={this.handleDeleteTask}
                style={[
                  styles.modalButton,
                  {
                    borderColor:
                      buttonPressed === 'yes' ? '#FF8303' : '#A35709',
                  },
                ]}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ isModalVisible: false })}
                style={[
                  styles.modalButton,
                  { borderColor: buttonPressed === 'no' ? '#A35709' : '#FF8303' },
                ]}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderEditModal = () => {
    const { modalVisible, buttonSaved } = this.state;
    return (


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => this.setState({ modalVisible: false })}>
        <Pressable
          onPress={() => this.setState({ modalVisible: false })}
          style={[styles.modalContainer, { justifyContent: 'flex-end' }]}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Mini Input..."
              placeholderTextColor="#F0E3CA"
              onChangeText={text => this.setState({ miniInput: text })}
            />
            <View style={[styles.modalInput, { height: 300 }]}>
              <TextInput
                style={{
                  color: '#ffff',
                  width: '100%',
                  height: '100%',
                }}
                placeholder="Max Input..."
                placeholderTextColor="#F0E3CA"
                onChangeText={text => this.setState({ maxInput: text })}
                multiline={true}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                style={[
                  styles.modalButton,
                  {
                    borderColor:
                      buttonSaved === 'Cancel' ? '#A35709' : '#FF8303',
                  },
                ]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleSave}
                style={[
                  styles.modalButton,
                  { borderColor: buttonSaved === 'save' ? '#FF8303' : '#A35709' },
                ]}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Pressable>
      </Modal>

    );
  };

  renderInput = () => {
    const { title, about } = this.state;
    return (
      <View style={styles.viewStyle}>
        <View style={{ width: '80%' }}>
          <TextInputWithBorderColor
            placeholder="Title..."
            value={title}
            onChangeText={text => this.setState({ title: text })}
          />
          <TextInputWithBorderColor
            placeholder="About..."
            value={about}
            onChangeText={text => this.setState({ about: text })}
          />
        </View>
        <TouchableOpacity onPress={this.handleAdd}>
          <Image source={require('./assets/addbtn.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  renderTaskList = () => {
    const { todos, selectedIndex } = this.state;
    const noTasks = todos.length === 0;
    return (
      <ScrollView>
        {noTasks ? (
          <View style={{ alignSelf: 'center' }}>
            <View style={{ height: 70 }} />
            <View
              style={{ width: 70, height: 2, backgroundColor: '#FF8303' }}
            />
            <Text style={styles.noTasksText}>No tasks</Text>
            <View
              style={{ width: 70, height: 2, backgroundColor: '#FF8303' }}
            />
          </View>
        ) : (
          todos.map((todo, index) => (
            <>
              <View key={index} style={styles.todoItem}>
                <View>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Title: {todo.title}
                  </Text>
                  <Text style={{ color: 'white' }}>About: {todo.about}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.handleCrossClick(index)}>
                  <Image source={require('./assets/cross.png')} />
                </TouchableOpacity>
              </View>
              {selectedIndex === index && (
                <View style={styles.editDeleteContainer}>
                  <TouchableOpacity
                    onPress={() => this.setState({ isModalVisible: true })}>
                    <Image source={require('./assets/delete.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ modalVisible: true })}>
                    <Image source={require('./assets/edit.png')} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          ))
        )}
      </ScrollView>
    )
  }

  render() {
    const { todos } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderInput()}
        {this.renderTaskList()}
        {this.renderDeleteModal()}
        {this.renderEditModal()}
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 10
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A35709',
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: '#ffff',
    marginTop: 5,
  },
  addButton: {
    width: 48,
    height: 48,
  },
  todoItem: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#A35709',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 90,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  noTasksText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center'
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#FF8303',
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242320',
  },
  modalText: {
    fontSize: 18,
    color: '#ffff',
  },
  modalButton: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  buttonText: {
    color: '#ffff',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#A35709',
    padding: 10,
    color: '#ffff',
    marginTop: 5,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});

export default App;