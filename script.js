//Selecciono Formulario y boton de formulario
let email = document.getElementById("exampleFormControlInput1");
let texto = document.getElementById("exampleFormControlTextarea1");
//const enviar = document.getElementsByClassName("btn btn-primary")
let submitBtn = document.getElementById('submit-btn');
let form = document.getElementById("consulta")

console.log(email,  texto, submitBtn);

//Agrego Evento al Boton de envio
submitBtn.addEventListener('click', (event) => {
    // Previene el comportamiento predeterminado del botón de envío
    event.preventDefault();

    // Valida el correo electrónico
      let emailValue = email.value;
      while (!emailValue.includes('@') || !emailValue.includes('.com')) {
        alert('Por favor, ingrese una dirección de correo electrónico válida.');
        emailValue = prompt('Ingrese su correo electrónico:');
    }

    // Pregunta si el usuario desea enviar el formulario
    let confirmMessage = '¿Está seguro de que desea enviar el formulario?';
    if (confirm(confirmMessage)) {
      // Envía el formulario
      form.submit();
    }
});
