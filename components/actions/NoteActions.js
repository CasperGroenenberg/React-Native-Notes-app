import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {    FETCH_NOTES, NOTES_FETCH_SUCCESS, NOTE_CREATE, NOTE_UPDATE, NOTE_EDIT, 
            SAVE_NOTE, SELECT_NOTE, DELETE_NOTE, DELETE_NOTE_SUCCESS } from './types';

export const fetchNotes = () => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        dispatch({type: FETCH_NOTES });
        firebase.database().ref(`/users/${currentUser.uid}/notes`)
        .on('value', snapshot => {
            dispatch({type: NOTES_FETCH_SUCCESS, payload: snapshot.val() });
        });
    };
};

export const editNote = ({ prop, value }) => {
    return {
        type: NOTE_EDIT,
        payload: { prop, value }
    };
};

export const updateNote = ({ prop, value }) => {
    return {
        type: NOTE_UPDATE,
        payload: { prop, value }
    };
};

export const deleteNote = ({ id }) => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        dispatch({ type: DELETE_NOTE });

        firebase.database().ref(`/users/${currentUser.uid}/notes/${id}`).remove()
        .then(() => {
            dispatch({ type: DELETE_NOTE_SUCCESS });
            Actions.main();
        })
    }
};
  


export const createNote = ({ title, body }) => {
    const { currentUser } = firebase.auth();
    const lastEdit = new Date().toLocaleString();


    return (dispatch) => {
        dispatch({ type: SAVE_NOTE });

        firebase.database().ref(`/users/${currentUser.uid}/notes`)
        .push({title, body, lastEdit})
        .then((res) => {

            const id = res.getKey();
            firebase.database().ref(`/users/${currentUser.uid}/notes/${res.getKey()}/id`).set(id)
            .then(() => {
                dispatch({ type: NOTE_CREATE });
                Actions.main();
            });
        });
    };
};

export const selectNote = ({ id }) => {
    return {
        type: SELECT_NOTE,
        payload: id 
    };

    Actions.noteCreate();
};

