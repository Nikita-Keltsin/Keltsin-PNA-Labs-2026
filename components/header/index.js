export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <nav class="navbar navbar-expand-lg mb-4" style="background: #ffffff; border-bottom: 2px solid #1b5c87;">
                <div class="container">
                    <span class="navbar-brand title mb-0">
                        <span class="dark-blue">DSP</span><span class="green">Lab</span>
                    </span>
                    <button id="home-btn" class="my-btn primary" style="font-size: 1rem; width: auto; height: auto; padding: 5px 20px;">
                        Домой
                    </button>
                </div>
            </nav>
        `;
    }

    render(listener) {
        this.parent.innerHTML = this.getHTML();
        const homeBtn = document.getElementById('home-btn');
        homeBtn.addEventListener('click', listener);
    }
}