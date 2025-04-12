const API_BASE_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Something went wrong"
    );
  }
  return response.json();
};

export const fetchThreads = async () => {
  const response = await fetch(
    `${API_BASE_URL}/threads`
  );
  return handleResponse(response);
};

export const fetchComments = async (threadId) => {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/comments`
  );
  return handleResponse(response);
}

export const fetchThreadDetails = async (
  threadId
) => {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}`
  );
  return handleResponse(response);
};

export const submitComment = async (threadId, comment) => {
  const response = await fetch(`${API_BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
    body: JSON.stringify(comment),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(
    `${API_BASE_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );
  const data = await handleResponse(response);
  localStorage.setItem("token", data.token);
  return data;
};
