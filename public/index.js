import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { firebaseConfig }  from "./firebase/firebase.js"
import * as validator from "./validators/validator.js"
import * as errors from "./errors/errors.js"
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const dbRef = ref(db);
const loginForm = {
    email: () => document.getElementById("email"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordResetButton: () => document.getElementById("recover-password-button"),
}
onAuthStateChanged(auth, (user) => {
    if (user) {
      updateData();
      toggleButtons("logoutButton", "block");
      toggleButtons("loginButton","none");
      document.getElementById("Login").style.display = "none";
      document.getElementById("CoordenadorVoo").style.display = "block";
    } else {
        
    }
  });
document.getElementById("save").onclick = function() {
    saveSetPoints();
}
document.getElementById("logout-button").onclick = function() {
    handleLogout();
}
document.getElementById("logout-button-list").onclick = function() {
    handleLogout();
}
document.getElementById("logout-button-list").onclick = function() {
    handleLogout();
}
document.getElementById("login-button").onclick = function() {
    loading();
}
loginForm.passwordResetButton().onclick = function() {
    handlePasswordReset();
}
loginForm.loginButton().onclick = function() {
    handleLogin();
}
loginForm.email().onchange = function() {
    handleLoginFormChange();
}
loginForm.password().onchange = function() {
    handleLoginFormChange();
}
function handleLogin()
{
    signInWithEmailAndPassword( 
        auth, loginForm.email().value, loginForm.password().value
    ).then(() => 
    {
        alert('Logado com sucesso!');
        toggleButtons("logoutButton", "block");
        toggleButtons("loginButton","none");
        document.getElementById("Login").style.display = "none";
        document.getElementById("CoordenadorVoo").style.display = "block";
        updateData();
    }).catch(error => 
    {
        alert(errors.mapErrorMessage(error.code));
    });
}
function handleLogout()
{
    signOut(auth)
    .then(() => {
        window.location.href = "";
    })
    .catch((error) => {
      console.log(error);
      alert("Erro ao fazer logout!");
    });
}
function handlePasswordReset() 
{   
    if(isEmailValid())
    {
        sendPasswordResetEmail( 
            auth, loginForm.email().value
        ).then(() => 
        {
            alert('Email para reset de senha enviado com sucesso!');
        }).catch(error => 
        {
            alert(errors.mapErrorMessage(error.code));
        })
    }
    else alert(errors.mapErrorMessage('validation/email'));
}
function saveSetPoints()
{
    set(ref(db, 'setPoints'), writeSetPoints());
}
function updateData()
{
    getData("data/humidity",'humidity','innerHTML','%');
    getData("data/pressure",'pressure','innerHTML',' hPa');
    getData("data/temperature",'temperature','innerHTML','ºC');
    getData("setPoints/humidityFrom",'humidityFrom','value','');
    getData("setPoints/humidityUpTo",'humidityUpTo','value','');
    getData("setPoints/temperatureFrom",'temperatureFrom','value','');
    getData("setPoints/temperatureUpTo",'temperatureUpTo','value','');
    getData("setPoints/pressureFrom",'pressureFrom','value','');
    getData("setPoints/pressureUpTo",'pressureUpTo','value','');
}
function getData(path,htmlId,htmlProperty,symbol) 
{
    get(child(dbRef, path)).then((snapshot) => 
    {
        if (snapshot.exists()) 
        {
            document.getElementById(htmlId)[htmlProperty] = snapshot.val() + symbol;
        } 
        else 
        {
            console.log("No data available ->", htmlId);
        }
    }).catch((error) => 
    {
        console.error(error);
    });
}
function handleLoginFormChange()
{   
    loginForm.loginButton().disabled = isEmailValid() && isPasswordValid() ? false : true;
}
function writeSetPoints()
{
    let setPoints = 
    {
        humidityFrom: parseFloat(document.getElementById('humidityFrom')['value']),
        humidityUpTo: parseFloat(document.getElementById('humidityUpTo')['value']),
        pressureFrom: parseFloat(document.getElementById('pressureFrom')['value']),
        pressureUpTo: parseFloat(document.getElementById('pressureUpTo')['value']),
        temperatureFrom: parseFloat(document.getElementById('temperatureFrom')['value']),
        temperatureUpTo: parseFloat(document.getElementById('temperatureUpTo')['value'])
    };
    return setPoints;
}
function isEmailValid()
{
    return validator.validateEmail(loginForm.email().value);
}
function isPasswordValid()
{
    return validator.validatePassword(loginForm.password().value);
}

function toggleButtons(className, display) 
    {
      var i, elements;
      elements = document.getElementsByClassName(className);
      for (i = 0; i < elements.length; i++) 
      {
        elements[i].style.display = display;
      }

    }
function loading(){
}