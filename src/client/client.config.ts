export const isHttpS = true; // This is a general flag to indicate if the server is running in https mode or not
export const hostname = window.location.hostname;
export const httPrefix = isHttpS ? `https://${hostname}` : "http://localhost";
