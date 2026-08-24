document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    const submit = form.querySelector('.contact__submit');
    submit.disabled = true;
    submit.textContent = 'Sending…';

    const token = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!token) {
        submit.disabled = false;
        submit.textContent = 'Send';
        return;
    }

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_key: form.querySelector('[name="access_key"]').value,
                name: form.querySelector('[name="name"]').value,
                email: form.querySelector('[name="email"]').value,
                message: form.querySelector('[name="message"]').value,
                'cf-turnstile-response': token,
            }),
        });

        const json = await res.json();

        if (json.success) {
            form.innerHTML = '<p class="contact__success">Message sent — I\'ll get back to you soon.</p>';
        } else {
            showError(form, submit);
        }
    } catch {
        showError(form, submit);
    }
});

function showError(form, submit) {
    submit.disabled = false;
    submit.textContent = 'Send';
    if (window.turnstile) window.turnstile.reset();
    let err = form.querySelector('.contact__error');
    if (!err) {
        err = document.createElement('p');
        err.className = 'contact__error';
        err.textContent = 'Something went wrong. Try emailing me directly.';
        form.appendChild(err);
    }
}
