import { storage } from 'src/boot/firebase'
import { ref } from 'vue'

const useFireStorage = () => {
  const error = ref(null)
  const downloadURL = ref(null)
  const filePath = ref(null)

  const uploadFile = async (file) => {
    filePath.value = `covers/${file.name}`
    const storageRef = storage.ref(filePath.value)
    try {
      const res = await storageRef.put(file)
      downloadURL.value = await res.ref.getDownloadURL()
    } catch (err) {
      console.log(err.message)
      error.value = err
    }
  }
  return { uploadFile, downloadURL, error }
}

export default useFireStorage
