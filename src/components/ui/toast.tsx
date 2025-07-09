import React from "react";

export type ToastActionElement = React.ReactNode;
export type ToastProps = { message: string };

export const Toast = ({ message }: ToastProps) => <div>{message}</div>;
