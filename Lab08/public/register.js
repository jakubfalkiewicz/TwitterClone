function registerUser() {
  const userLogin = document.getElementById("registerLogin").value;
  const userPassword = document.getElementById("registerPassword").value;
  const userEmail = document.getElementById("registerEmail").value;
  axios
    .post(`/users/register`, {
      login: userLogin,
      password: userPassword,
      email: userEmail,
    })
    .then((res) => {
      location.href = `/profile/${res.data._id}`;
      sessionStorage.setItem("loggedId", `${res.data._id}`);
    })
    .catch((err) => console.log(err));
}
const button = document.getElementById("button");
button.addEventListener("click", () => registerUser());
