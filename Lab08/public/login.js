function loginUser() {
  const userLogin = document.getElementById("loginLogin").value;
  const userPassword = document.getElementById("loginPassword").value;
  const userEmail = axios
    .post(`/users/login`, {
      login: userLogin,
      password: userPassword,
    })
    .then((res) => {
      location.href = `/profile/${res.data._id}`;
      sessionStorage.setItem("loggedId", `${res.data._id}`);
    })
    .catch((err) => console.log(err));
}
const button = document.getElementById("button");
button.addEventListener("click", () => loginUser());
