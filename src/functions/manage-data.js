import { ref } from 'vue'

export const getPromiseDoc = async (collection, docId) => {
  return new Promise((resolve, reject) => {
    collection.doc(docId).get().then((doc) => {
      const result = doc.exists ? { ...doc.data() } : null
      return resolve(result)
    })
  })
}

export const getPromiseDocs = (query) => {
  return new Promise((resolve, reject) => {
    query.get().then((data) => {
      const result = data.docs.map(doc => { return { ...doc.data() } })
      return resolve(result)
    })
  })
}

export const getPaginateDocs = (query) => {
  return new Promise((resolve, reject) => {
    query.get().then((data) => {
      const lastRow = data.docs[data.docs.length - 1]
      const result = {
        rows: data.docs.map(doc => { return { ...doc.data() } }),
        lastRow
      }
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
