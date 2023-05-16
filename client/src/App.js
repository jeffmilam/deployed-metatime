import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import ListTimes from './components/ListTimes'
import Auth from './components/Auth'
import {useEffect, useState} from 'react'
import { useCookies } from 'react-cookie'


const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks, setTasks] = useState(null)
  const [times, setTimes] = useState(null)

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }  

  useEffect (() => {
    if (authToken) {
      getData()
    }}
  , [])

  console.log(tasks)

  // Getting Times
  const getTimes = async () => {
    try {
      const responseTimes = await fetch(`${process.env.REACT_APP_SERVERURL}/times/${userEmail}`)
      const json = await responseTimes.json()
      setTimes(json)
    } catch (err) {
      console.error(err)
    }
  }  

  useEffect (() => {
    if (authToken) {
      getTimes()
    }}
  , [])

  console.log(times)    
  // END getting times

  //Sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))
  const sortedTimes = times?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className='app'>
      {!authToken && <Auth/>}
      {authToken &&
      <>
        <ListHeader ListName={'🏖️ Todo List'} getData={getData}/>
        <p className='user-email'>Welcome back {userEmail}</p>
        {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData}/>)}
        {sortedTimes?.map((times) => <ListTimes key={times.id} times={times} getTimes={getTimes}/>)}
        </>}
        <p className='copyright'>© Coherent Research, LLC</p>
    </div>
  )
}

export default App