class Tooltip extends HTMLElement {
    // Element is created -> Basic initializations
    constructor() {
        super();
        this._tooltipIcon;
        this._tooltipVisible = false;
        this._tooltipText = 'Some dummy tooltip text.';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            div {
                font-weight: normal;
                background-color: black;
                color: white;
                position: absolute;
                top: 1.5rem;
                left: 0.75rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
            }

            .highlight: {
                background-color: red;
            }

            :host {
                position: relative
            }

            /* Accessing the component itself */
            /* Adding the component class so we can only target one component */
            /* We are now setting a primary color using css variables and we use #ccc as default in case the variable value is not provided */
            :host(.important) {
                background: var(--color-primary, #ccc);
                padding: 0.15rem;
            }

            /* Setting style to a component that is surrounded by <p> tag */
            /* this could also work with stuff like p .class or p.class */
            :host-context(p) {
                font-weight: bold;
            }

            ::slotted(.highlight) {
                border-bottom: 2px dotted red;
            }

            .icon {
                background: black;
                color: white;
                padding: 0.15rem 0.5rem;
                text-align: center;
                border-radius: 50%;
            }
        </style>
        <slot>Some default</slot>
        <span class="icon">?</span>
        `;
    }

    // Element attached to DOM -> Dom initializations
    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        this._tooltipIcon = this.shadowRoot.querySelector('span');
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this._render();
    }

    // Observed if attirbute gets updated
    // Making checks
    // Setting tooltipText to the newValue 
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === 'text') {
            this._tooltipText = newValue;
        }
    }

    // Getting the observed attributes in our class/component
    // The values here are gettable from outside the class, but not settable (only has a get)
    static get observedAttributes() {
        return ['text'];
    }

    // Gets executed when the element is removed from the DOM
    // We take advantage of the disconnectedCallback to clean up the event listeners
    disconnectedCallback() {
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if (this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }

    // Underscore to indicate that this method should only get called internally in this class
    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }

    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }
}

customElements.define('cfl-tooltip', Tooltip);