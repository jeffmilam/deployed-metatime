import { useState } from 'react'
import TickIcon from './TickIcon'
import Modal from './Modal'
import ProgressBar from './ProgressBar'

const ListTimes = ({ times, getData }) => {
  const [showModal, setShowModal] = useState(false)

  const deleteItem = async () => {
    window.location.reload()
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/times/${times.id}`, {
        method: 'DELETE'
      })
      console.log('Deleted')
      if (response.status = 200) {
        getData()
      }
    } catch (err) {
      console.error(err)
    }

  }

    return (
      <li className="list-item">
        <div className="info-container">
          <TickIcon />
          <p className="task-title">{times.title}</p>
        </div>

        <div className="button-container">
          <button className="edit" onClick={() => setShowModal(true)}>EDIT</button>
          <button className='delete' onClick={deleteItem}>DELETE</button>
        </div>
        {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} times={times}/>} 
      </li> 
    )
  }
  
  export default ListTimes
  