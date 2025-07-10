import React from "react";

export type ToastActionElement = React.ReactNode;
export interface ToastProps { message: string }

export const Toast = ({ message }: ToastProps) => <div>{message}</div>;
