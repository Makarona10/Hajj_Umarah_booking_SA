//LOCAL STORAGE
export const setAuthUser = (id, email) => {

  // save object to the local storage
  // Stringify OBJECT TO TEXT
  localStorage.setItem("id", id);
  localStorage.setItem("email", email);
};

export const getAuthUser = () => {
  const id = localStorage.getItem("id");
  const email = localStorage.getItem("email");

  if (id && email) {
    return { id, email };
  }

  return null;
};

export const removeAuthUser = () => {
  if (localStorage.getItem("id")) localStorage.removeItem("id");
  if (localStorage.getItem("email")) localStorage.removeItem("email");
};
export const isAuthenticated = () => {
  const user = localStorage.getItem("id");
  return !!user; // Check if user exists
};

export const isAdmin = () => {
  const { id, email } = getAuthUser();
  return email == "admin@admin.com"; // Check if token contains admin role
};
