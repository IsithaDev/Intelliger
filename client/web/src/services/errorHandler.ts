const errorHandler = (error: any) => {
  if (error.response) {
    // Error response from the server
    console.error("API Error:", error.response.data);
    const message =
      error.response.data?.message || "An error occurred. Please try again.";
    throw new Error(message);
  } else if (error.request) {
    // No response from the server
    console.error("No response received from server:", error.request);
    throw new Error(
      "Unable to reach the server. Please check your network connection and try again.",
    );
  } else {
    // Other unexpected errors
    console.error("Unexpected error:", error.message);
    throw new Error("Something went wrong. Please try again later.");
  }
};

export default errorHandler;
