function contactForm() {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // generate a five digit number for the contact_number variable
        this.contact_number.value = (Math.random() * 100000) | 0;
        // these IDs from the previous steps

        emailjs.sendForm('service_evbr12q', 'template_7l4z0kd', this).then(
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
