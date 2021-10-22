const { admin } = require('./admin')

const createProfile = async (userRecord, context) => {
  const { uid, email } = userRecord

  admin.firestore()
    .collection('user')
    .doc(uid)
    .set({
      uid,
      email,
      firstName: '',
      lastName: '',
      creationDate: admin.firestore.FieldValue.serverTimestamp()
    })
    .catch(console.error)

  const doc = await admin.firestore().collection('group').doc('staff').get()
  admin.firestore()
    .collection('group')
    .doc('staff')
    .update({
      user: [...doc.data().user, uid]
    })
    .catch(console.error)
}

module.exports = { createProfile }
