import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AlertType, ErrorType, MessageType, WarningType } from '../types';

const setDescription = createAction<string>('ui/setDescription');
const clearErrors = createAction<string>('ui/clearErrors');
const clearMessages = createAction<string>('ui/clearMessages');
const clearWarnings = createAction<string>('ui/clearWarnings');
const setError = createAction<ErrorType>('ui/setError');
const setMessage = createAction<MessageType>('ui/setMessage');
const setPositionY = createAction<number>('ui/setPositionY');
const setWarning = createAction<WarningType>('ui/setWarning');

export const actions = {
  clearErrors,
  clearMessages,
  clearWarnings,
  setDescription,
  setError,
  setMessage,
  setPositionY,
  setWarning,
};

const initialState = {
  description: null as string,
  errors: [] as ErrorType[],
  messages: [] as MessageType[],
  positionY: 0 as number,
  warnings: [] as WarningType[],
};

const customMessageExists = (alerts: AlertType[], customMessage: string) =>
  customMessage && alerts.some(alert => alert.customMessage === customMessage);

const uiReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(clearErrors, (state) => {
      state.errors = initialState.errors;
    })
    .addCase(setError, (state, action: PayloadAction<ErrorType>) => {
      if (customMessageExists(state.errors, action.payload.customMessage)) {
        return;
      }

      state.errors.push(action.payload);
    })
    .addCase(clearMessages, (state) => {
      state.messages = initialState.messages;
    })
    .addCase(setMessage, (state, action: PayloadAction<MessageType>) => {
      if (customMessageExists(state.messages, action.payload.customMessage)) {
        return;
      }

      state.messages.push(action.payload);
    })
    .addCase(setDescription, (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    })
    .addCase(setPositionY, (state, action: PayloadAction<number>) => {
      state.positionY = action.payload;
    })
    .addCase(clearWarnings, (state) => {
      state.warnings = initialState.warnings;
    })
    .addCase(setWarning, (state, action: PayloadAction<WarningType>) => {
      if (customMessageExists(state.warnings, action.payload.customMessage)) {
        return;
      }

      state.warnings.push(action.payload);
    });
});

export default uiReducer;
