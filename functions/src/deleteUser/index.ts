import admin from "firebase-admin";
import * as functions from "firebase-functions";

/**
 * Deletes user data
 */
const deleteUser = functions.auth.user().onDelete(async (user) => {
  admin.database().ref(`tokens/${user.uid}`).remove();
});

export default deleteUser;
