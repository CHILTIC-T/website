document.addEventListener("DOMContentLoaded", function() {
    // Inicializa EmailJS con tu User ID
    emailjs.init("nQX3lv59U-qADkjVm"); // Reemplaza con tu User ID

    // Obtén el formulario y agrega el evento de envío
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del formulario

            // Recoge los datos del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Verifica en consola que los datos no estén vacíos
            console.log("Sending email with:", name, email, message);

            // Usa EmailJS para enviar el formulario
            emailjs.send('service_nka1pdj', 'template_z4stonh', {
                from_name: name,
                from_email: email,
                message: message
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Mensaje enviado correctamente. ¡Gracias por contactarnos!');
                // Opcional: Limpia los campos del formulario después de enviar
                contactForm.reset();
            }, function(error) {
                console.error('FAILED...', error);
                alert('Hubo un problema al enviar el mensaje. Inténtalo nuevamente.');
            });
        });
    } else {
        console.error("Formulario de contacto no encontrado.");
    }
});
