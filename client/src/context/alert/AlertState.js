import React, { useReducer } from "react";
import AlertContext from "./alertContext";
import AlertReducer from "./alertReducer";
import uuid from "uuid";
import {
SET_ALERT,
REMOVE_ALERT
  } from '../types';

  const AlertState = props => {
      const initialState = [];

      /// Actions ///

    // Set Alert
    const setAlert = (msg, type, timeout=3000) => {
        const id = uuid.v4();
        dispatch({
            type: SET_ALERT,
            payload: { msg, type, id }
        });

        setTimeout(() => dispatch({
            type: REMOVE_ALERT,
            payload: id
        }), timeout);
    }

      const [state, dispatch] = useReducer(AlertReducer, initialState);

    return <AlertContext.Provider value={{
        alerts: state,
        setAlert
    }}>
        {props.children}
    </AlertContext.Provider>
  }

  export default AlertState;