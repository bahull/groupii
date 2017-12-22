import axios from 'axios'

const initialState = {
  anItem: ['createProject', 'postNewItem'],
  newList: ['a project'],


  newCard: '',
  cards: [],
  newTask: '',
  inputOpen: false
};



//actions: command given that is send to reducer & reducer uses it to figure out how the state should change.
const ADD_TO_LIST = 'ADD_TO_LIST';
const REMOVE_ITEM_FROM_LIST = 'REMOVE_ITEM_FROM_LIST';

//adding cards
const CARD_INPUT = 'CARD_INPUT'
const NEW_CARD = 'NEW_CARD'

//adding tasks
const TASK_INPUT = 'TASK_INPUT'
const NEW_TASK = 'NEW_TASK'

const OPEN_INPUT = 'OPEN_INPUT'

const ALL_CARDS = 'ALL_CARDS'
//edit and delete tasks
const OPEN_TASKEDIT = 'OPEN_TASKEDIT'
const CHANGE_EDITTASK = 'CHANGE_EDITTASK'
const SEND_EDITTASK = 'SEND_EDITTASK'





//ACTION CREATORS: creating a properly formatted action that has the right type in it.
export function addToList(newItem) {
  return {
    type: ADD_TO_LIST,
    payload: newItem
  };
}
export function removeFromList(newItem) {
  return {
    type: REMOVE_ITEM_FROM_LIST,
    payload: function() {}
  };
}


//adding cards
export function cardInput(e) {
  return{
    type: CARD_INPUT,
    payload: e.target.value
  }
}
export function addCard(card, projectID) {
  return {
    type: NEW_CARD,
    payload: axios.post('http://localhost:3001/api/newCard', { card, projectID }).then(res => {
      return res
  })
  // {cardHeader: res.data, tasks: []}
  }
}
export function getCards(projectID) {
  return {
    type: ALL_CARDS,
    payload: axios.get(`http://localhost:3001/api/getAllCards/${projectID}`).then(response => {
      
      console.log('data', response.data)
      return response.data
    })
  }
}

//adding tasks
export function taskInput(e){
  return{
    type: TASK_INPUT,
    payload: {name: e.target.name, value: e.target.value}
  }
}
export function addTask(task, cardID, projectID) {
  return {
    type: NEW_TASK,
    payload: axios.post('http://localhost:3001/api/newTask', {task, cardID, projectID}).then(res => {
      return res
    })
  }
}

export function openInput(input) {
  return {
    type: OPEN_INPUT,
    payload: input
  }
}

//editing tasks
export function openEditTask(taskID, task) {
  return {
    type: OPEN_TASKEDIT,
    payload: {taskID, task}
  }
}

export function changeEditTask(e){
  return {
    type: CHANGE_EDITTASK,
    payload: e.target.value
  }
}
export function sendEditTask(taskID, task){
  return {
    type: SEND_EDITTASK,
    payload: axios.post('http://localhost:3001/api/editTask', {taskID, task})
  }
}







// Reducer: state & action
export default function reducer(state = initialState, action) {
  switch (action.type) {

    case ADD_TO_LIST:
      return Object.assign({}, state, { items: action.payload });

    case REMOVE_ITEM_FROM_LIST:
      return Object.assign({}, state, { items: action.payload });

    //Spencer's additions\/

    case ALL_CARDS + '_PENDING'://grabbing all cards from database
      return Object.assign({}, state, {isLoading: true})
    case ALL_CARDS + '_FULFILLED':
      console.log('card Payload', action.payload)
        let testVar = action.payload
        let finalArr = []
  
        function makeItWork(array) {
          console.log(array)
          let newArr = array
          let tasksArr = []
          let tasksObj = { task: '', taskID: '' }
  
          for (let i = 0; i < newArr.length; i++) {
            let obj = { cardHeader: '', tasks: [], cardID: '' }
  
            obj.cardHeader = newArr[i].title
            obj.cardID = newArr[i].id
            if (newArr[i].content !== null) {
              tasksObj.task = newArr[i].content
            }
            if (newArr[i].task_id !== null) {
              tasksObj.taskID = newArr[i].task_id
            }
            if (newArr[i + 1]) {
              if (obj.cardHeader !== newArr[i + 1].title) {
                tasksArr.push(tasksObj)
                tasksObj = { task: '', taskID: '' }
                obj.tasks = tasksArr
              }
              if (obj.cardHeader === newArr[i + 1].title) {
                tasksArr.push(tasksObj)
                tasksObj = { task: '', taskID: '' }
                continue;
              }
            }
            else {
              tasksArr.push(tasksObj)
            }
  
            console.log(finalArr, "Check here")
            obj.tasks = tasksArr.sort((a,b) => {return a.taskID - b.taskID})
            tasksArr = []
            finalArr.push(obj)
          }
          console.log("CHECKOUT YOUR FINALARR HERE ", finalArr)
          return finalArr
  
  
        }
        makeItWork(testVar)
        console.log(finalArr)
        return Object.assign({}, state, { cards: finalArr, newCard: '', isLoading: false });

    case CARD_INPUT://adding cards
      return Object.assign({}, state, {newCard: action.payload});

    case NEW_CARD: 
      

    case TASK_INPUT://adding tasks to cards
      console.log(action.payload)
      return Object.assign({}, state, {newTask: action.payload.value, cardID: action.payload.name});


    case NEW_TASK:
    let obj = [...state.cards]
      function stuff(index, task){
        obj[index].tasks.push(task)
        return obj
      }
      stuff(action.payload.index, action.payload.task)

      return Object.assign({}, state, {cards: obj, newTask: ''});



    case OPEN_INPUT:
      return Object.assign({}, state, {inputOpen: action.payload});

    case OPEN_TASKEDIT:
      return Object.assign({}, state, {editTaskID: action.payload.taskID, editTaskTask: action.payload.task})
    case CHANGE_EDITTASK:
      return Object.assign({}, state, {editTaskTask: action.payload})



    default:
      return state;
      //in case none of the action types match, it can return the state to make sure it don't break anything.
  }
}
