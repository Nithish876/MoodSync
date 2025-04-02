Here’s a structured and precise `.md` format instruction file for implementing the **Profile Screen** and improving its design:

---

## Profile Screen Development

### **Overview**

The Profile screen is a tab in the app where users can:

1. View their name and a unique friend code.
2. Share their friend code via a "Share" button.
3. View and manage their friends list.
4. Add new friends using a friend code.

---

### **Key Features**

1. **Name Display**:

   - Fetch and display the user's name from Firebase.
   - Name should be displayed in bold, centered text.

2. **Friend Code Display**:

   - Fetch the unique friend code from Firebase.
   - Provide a "Copy" button (clipboard icon) next to the code for easy copying.

3. **Share Button**:

   - Generate a Firebase Dynamic Link with the friend code.
   - On click, allow users to share the link via native sharing options (email, WhatsApp, etc.).

4. **Friends List**:

   - Display all the user’s friends fetched from Firebase in a scrollable list.
   - Each friend entry should display:
     - Friend's name.
     - Option to remove the friend (show a delete icon).

5. **Add Friend**:

   - Include an **Add Friend** button that:
     - Opens a popup to enter another user's friend code.
     - Sends a friend request or directly adds the friend to the user's friends list.

6. **UI Improvements**:
   - Enhance the visual layout using rounded corners, spacing, and gradients.
   - Use vibrant, aesthetic colors that align with the app's clean and aesthetic theme.

---

### **Firebase Integration**

#### **Data Structure**

```json
{
  "users": {
    "userId1": {
      "name": "John Doe",
      "friendCode": "ABCD1234",
      "friends": ["userId2", "userId3"]
    },
    "userId2": {
      "name": "Jane Smith",
      "friendCode": "EFGH5678",
      "friends": ["userId1"]
    }
  }
}
```

---

### **Implementation Steps**

#### 1. **Set up Firebase**

- Fetch user details (`name` and `friendCode`) from Firebase on screen load.
- Fetch the user’s `friends` array and populate the list.

#### 2. **Copy Functionality**

- Implement clipboard functionality for copying the friend code.
- Show a success toast after copying.

#### 3. **Dynamic Link Generation**

- Use Firebase Dynamic Links to create and share a personalized invitation link:
  - Link format: `https://moodsync.page.link?code=<friendCode>`.

#### 4. **Add Friend**

- Open a dialog box when "Add Friend" is clicked.
- Validate the entered friend code against Firebase.
- Add the friend to both users' `friends` arrays.

#### 5. **Remove Friend**

- Allow users to remove a friend from their list by:
  - Deleting the friend’s ID from their `friends` array in Firebase.

#### 6. **UI Enhancements**

- Use soft, pastel colors for the background (e.g., peach or light pink).
- Add a subtle shadow effect on boxes.
- Replace "Add Friend" with an outlined button for visual contrast.
- Use rounded buttons for "Share" and "Copy."

---

### **Example Code**

#### Firebase Fetch and Update

```typescript
import { database } from "./firebaseConfig";
import { ref, get, update } from "firebase/database";

// Fetch user details
const fetchUserDetails = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Update friends list
const addFriend = async (userId, friendId) => {
  const userRef = ref(database, `users/${userId}/friends`);
  const friendRef = ref(database, `users/${friendId}/friends`);

  // Add friend for both users
  await update(userRef, { [friendId]: true });
  await update(friendRef, { [userId]: true });
};
```

#### Copy Functionality

```javascript
import * as Clipboard from "expo-clipboard";

const copyToClipboard = (code) => {
  Clipboard.setString(code);
  alert("Friend Code Copied!");
};
```

#### Dynamic Link

```typescript
import { getDynamicLinks } from "firebase/dynamic-links";

const generateDynamicLink = async (friendCode) => {
  const link = await getDynamicLinks().createDynamicLink({
    link: `https://moodsync.page.link/invite?code=${friendCode}`,
    domainUriPrefix: "https://moodsync.page.link",
    androidInfo: { androidPackageName: "com.moodsync.app" },
    iosInfo: { iosBundleId: "com.moodsync.app" },
  });
  return link.shortLink;
};
```

---

### **Dependencies**

Add the following dependencies:

```bash
npm install firebase @react-navigation/native react-native-paper expo-clipboard
```
