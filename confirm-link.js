class ConfirmLink extends HTMLAnchorElement {
    connectedCallback() {
        this.addEventListener('click', event => {
            if (!confirm('Do you want to visit Google?')) {
                event.preventDefault();
            }
        })
    }
}

customElements.define('cfl-confirm-link', ConfirmLink, { extends: 'a' });