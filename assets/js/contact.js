function contactForm() {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        console.log('start');
        event.preventDefault();
        const templateParams = {
            contact_number: (Math.random() * 100000) | 0,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
        };
        console.log(templateParams);

        emailjs.send('service_evbr12q', 'template_7l4z0kd', templateParams).then(
            function () {
                alert('피드백을 보냈습니다!');
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
                console.log('SUCCESS!', response.status, response.text);
            },
            function (error) {
                console.log('FAILED...', error);
            }
        );
    });
}

contactForm();
