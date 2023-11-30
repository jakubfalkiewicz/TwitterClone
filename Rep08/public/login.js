function loginUser() {
  const userLogin = document.getElementById("loginLogin").value;
  const userPassword = document.getElementById("loginPassword").value;
  const userEmail = axios
    .post(`http://localhost:3000/users/login`, {
      login: userLogin,
      password: userPassword,
    })
    .then((res) => {
      window.location.href = "http://localhost:3000/users/";
    });
}
document.getElementById("button").addEventListener("click", () => loginUser());
