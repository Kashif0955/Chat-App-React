import {
  Container,
  VStack,
  Box,
  Input,
  Button,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Components/Message";
import { app } from "./Firebase"; // Import auth from the correct file
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch((error) => {
    console.error("Error during sign in:", error);
  });
};

const logOutHandler = () => {
  signOut(auth).catch((error) => {
    console.error("Error during sign out:", error);
  });
};

const App = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Scroll to the bottom after user signs in
        setTimeout(() => {
          if (divForScroll.current) {
            divForScroll.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    });

    const unsubscribeMessages = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
      // Scroll to the bottom after messages have loaded
      setTimeout(() => {
        if (divForScroll.current) {
          divForScroll.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button onClick={logOutHandler} colorScheme="red" w={"full"}>
              LogOut
            </Button>
            <VStack
              h={"full"}
              w={"full"}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  uri={item.uri}
                  text={item.text}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form style={{ width: "100%" }} onSubmit={submitHandler}>
              <HStack>
                <Input
                  placeholder="Enter a Message...."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" colorScheme="purple">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h={"100vh"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme="purple">
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default App;
