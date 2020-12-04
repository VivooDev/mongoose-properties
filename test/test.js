const UserModel = require('./_model').model;
const db = require('./db');


const createUser = async () => {
  let user = new UserModel({
    account: {
      name: 'Vivoo',
      email: 'hello@vivoo.io'
    },
  });
  await user.save();
  return user._id
}
const getUser = async () => {
  return UserModel.findOne().exec()
}
const getUserPropertyDocumentCount = async () => {
  return UserModel.properties().count().exec()
}

const changeProfilePhotoProperty = async (userId) => {
  const user = await UserModel.findOne({_id: userId}).exec();
  user.setProp('profile.photo', 'https://via.placeholder.com/300')
  user.save();
  return user;
}
const findUserProperty = async (userId, name) => {
  return UserModel.properties().findOne({identifier: userId, name}).sort({ createdAt: -1 }).exec()
};

function run(){
  return new Promise(async (resolve, reject) => {
    try {
      const startTotalPropertyCount = await getUserPropertyDocumentCount()
      console.log(`[START] Total property count: ${startTotalPropertyCount}`)
      // const createdUserId = await createUser();
      const createdUserId = (await getUser())._id;
      console.log(`User ${createdUserId} successfully created.`)
      const userPhotoUpdated = await changeProfilePhotoProperty(createdUserId)
      console.log(`User ${userPhotoUpdated._id}'s photo updated to : ${userPhotoUpdated.profile.photo}`)
      const findPhotoProperty = await findUserProperty(userPhotoUpdated._id, 'profile.photo');
      console.log(`Finding profile photo property document: ${findPhotoProperty}`)
      const finalTotalPropertyCount = await getUserPropertyDocumentCount()
      console.log(`[FINAL] Total property count: ${finalTotalPropertyCount}`)
      resolve();
    }catch (e) {
      console.error(e);
      reject(e);
    }
  });
}



db.connection.once('open', function() {
  run().then(() => {
    console.log('Finish.')
  }).catch((e) => {
    console.error(e);
  });
});
