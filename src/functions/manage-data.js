import { ref } from 'vue'

export const getDoc = async (collection, id) => {
  return new Promise((resolve, reject) => {
    collection.doc(id).get().then((doc) => {
      const result = doc.exists ? doc.data() : null
      return resolve(result)
    })
  })
}

export const getDocs = async (query) => {
  const docs = await query.get()
  return docs.empty ? [] : docs.docs.map(doc => doc.data())
}

export const getPromiseDocs = (query) => {
  return new Promise((resolve, reject) => {
    query.get().then((docs) => {
      const result = docs.docs.map(doc => doc.data())
      return resolve(result)
    })
  })
}

export const createDoc = (newDoc, data) => {
  return newDoc.set(data)
}

export const updateDoc = (doc, data) => {
  return doc.update(data)
}

export const deleteDoc = (doc) => {
  return doc.delete()
}

export const useLiveData = (query) => {
  const data = ref([])
  query.onSnapshot(snapshot => {
    data.value = snapshot.docs.map(doc => ({ ...doc.data() }))
  })
  return data
}

// sample of using Asunc/Await
export function simulateAsyncAPI (text, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(text)
      resolve()
    }, timeout)
  })
}
