export const read = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => { // get the response first to get its parameters like error
      return response.json()
    })
    .catch(err => console.log(err));
};

export const update = (userId, token, user) => {
  console.log("USER DATA UPDATE: ", user);
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "PUT",
    headers: { // sending FormData so don't need: Content-Type = json
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: user
  })
    .then(response => { // get the response first to get its parameters like error
      return response.json();
    })
    .catch(err => console.log(err));
};

export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: "GET"
  })
    .then(response => { // get the response first to get its parameters like error
      return response.json()
    })
    .catch(err => console.log(err));
};

export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => { // get the response first to get its parameters like error
      return response.json()
    })
    .catch(err => console.log(err));
}

export const updateUser = (user, next) => {
  if(typeof window !== 'undefined') {
    if(localStorage.getItem('jwt')) {
      // get localStorage
      let auth = JSON.parse(localStorage.getItem('jwt'))
      auth.user = user;
      // set new info
      localStorage.setItem('jwt', JSON.stringify(auth));
      next();
    }
  }
};

export const follow = (userId, token, followId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
    method: "PUT",
    headers: { // sending FormData so don't need: Content-Type = json
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({userId, followId})
  })
    .then(response => { // get the response first to get its parameters like error
      return response.json();
    })
    .catch(err => console.log(err));
};