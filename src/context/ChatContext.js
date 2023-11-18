import { createContext , useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useReducer } from "react";

export const ChatsContext = createContext();


export const ChatsContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "null",
        user : {},
    };

    const charReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user : action.payload,
                    chatId : currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(charReducer, INITIAL_STATE);

    return (
        <ChatsContext.Provider value={{ data : state ,  dispatch }}>
            {children}
        </ChatsContext.Provider>
    )
};