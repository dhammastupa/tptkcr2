import { db, Timestamp } from 'src/boot/firebase.js'

export default function useLogMeritMaking (collection, document, action, userID, userName) {
  db.collection('meritBook').add({
    collection,
    document,
    action,
    userID,
    userName,
    createdOn: Timestamp.now()
  }).then((docRef) => {
    console.log('Document written with ID: ', docRef.id)
  }).catch((error) => {
    console.error('Error adding document: ', error)
  })
}
