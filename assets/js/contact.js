function contactForm() {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const templateParams = {
            contact_number: (Math.random() * 100000) | 0,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
        };

        emailjs.sendForm('service_evbr12q', 'template_7l4z0kd', templateParams).then(
            function () {
                alert('피드백을 보냈습니다!');
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
            },
            function (error) {
                console.log('FAILED...', error);
            }
        );
    });
}

contactForm();
