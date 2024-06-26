import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native';
import Login from './src/components/Login';
import TaskList from './src/components/TaskList';
import Feather from 'react-native-vector-icons/Feather'

import firebase from './src/services/firebaseConnection';

export default function App() {
  const [ user, setUser ] = useState(null);
  const inputRef = useRef(null);
  const [tasks, setTasks ] = useState([]);
  const [newTask, setNewTask ] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {

    function getUser(){
      if(!user){
        return;
      }

      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
        setTasks([]);
        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])
        })
      })
    }
    getUser();

  },[user])

  function handleAdd(){
    if(newTask === ''){
      return;
    }
    // Usuario quer editar uma tarefa
    if(key !== ''){
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      })
      .then(() => {
        const taskIndex = tasks.findIndex( item => item.key === key)
        const taskClone = tasks;
        taskClone[taskIndex].nome = newTask
        setTasks([...taskClone])
        
      })

      Keyboard.dismiss();
      setNewTask('');
      setKey('');
      return;

    }

    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;

    tarefas.child(chave).set({
      nome: newTask
    })
    .then(() => {
      const data = {
        key: chave,
        nome: newTask
      };
      setTasks(oldTasks => [...oldTasks, data])
    })
    
    Keyboard.dismiss();
    setNewTask('');
  }
  
  function handleDelete(key){
    firebase.database().ref('tarefas').child(user).child(key).remove()
    .then(() => {
      const findTasks = tasks.filter( item => item.key !== key);
      setTasks(findTasks);
    })
  }

  function handleEdit(data){
    setKey(data.key);
    setNewTask(data.nome);
    inputRef.current.focus();
  }

  function cancelEdit(){
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  }

  if(!user){
    return <Login changeStatus={ (user) => setUser(user)}/>
  }
  return (

  <SafeAreaView style={styles.container}>

    { key.length > 0 && (
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <TouchableOpacity onPress={ cancelEdit }>
          <Feather name='x-circle' size={20} color='#FF0000' />
        </TouchableOpacity>
        <Text style={{ color: '#FF0000', fontSize: 14, marginLeft: 5,  }}>
          Voce está editando uma tarefa!
        </Text>
      </View>
    )}




    <View style={styles.containerTask}>
      <TextInput
        style={styles.input}
        placeholder='Digite sua nova tarefa...'
        value={newTask}
        onChangeText={ (text) => setNewTask(text) }
        ref={inputRef}
      />
      <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>

    <FlatList
      style={styles.listaTarefas}
      data={tasks}
      keyExtractor={ item => item.key }
      renderItem={ ({ item }) => (
        <TaskList data={item} deleteteItem={handleDelete} editItem={handleEdit} />

      )}
    />
    
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 10,
    backgroundColor: '#2f6fc',
    marginTop: 25
  },
  containerTask:{
    flexDirection: 'row',
  },
  input:{
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#141414',
    borderRadius: 5,
    height: 45,
  },
  buttonAdd:{
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 16,
    borderRadius: 5
  },
  buttonText:{
    color: '#FFF',
    fontSize: 22
  }
});
