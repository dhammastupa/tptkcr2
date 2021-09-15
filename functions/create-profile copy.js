const { admin } = require('./admin')

const createProfile = (userRecord, context) => {
  const { uid, email } = userRecord

  return admin.firestore()
    .collection('user')
    .doc(uid)
    .set({
      uid,
      email,
      creationDate: admin.firestore.FieldValue.serverTimestamp()
    })
    .catch(console.error)
}

module.exports = { createProfile }
