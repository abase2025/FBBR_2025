// Integração com serviço de envio de email gratuito (Formspree)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validar campos
            if (!name || !email || !subject || !message) {
                errorMessage.textContent = "Por favor, preencha todos os campos.";
                errorMessage.classList.add('show');
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 5000);
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = "Por favor, insira um email válido.";
                errorMessage.classList.add('show');
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 5000);
                return;
            }
            
            try {
                // Formspree é um serviço gratuito para envio de emails
                // Substitua 'xrgkdpvb' pelo seu formulário ID do Formspree
                const response = await fetch('https://formspree.io/f/xrgkdpvb', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        _replyto: email, // Para que o destinatário possa responder diretamente
                        _subject: `Contato FBBR_Odonto: ${subject}`,
                        _format: 'plain', // Formato do email
                        _template: 'table', // Template do email
                        _autoresponse: 'Obrigado por entrar em contato com o FBBR_Odonto. Recebemos sua mensagem e responderemos em breve.' // Resposta automática
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Sucesso
                    successMessage.textContent = "Sua mensagem foi enviada com sucesso para rlambaia2023@gmail.com! Entraremos em contato em breve.";
                    successMessage.classList.add('show');
                    contactForm.reset();
                    
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                } else {
                    // Erro
                    throw new Error(result.error || 'Ocorreu um erro ao enviar sua mensagem.');
                }
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                errorMessage.textContent = error.message || "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.";
                errorMessage.classList.add('show');
                
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 5000);
            }
        });
    }
});
