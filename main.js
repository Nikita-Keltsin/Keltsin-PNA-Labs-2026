import { MainPage } from "./pages/main/index.js";
import { HeaderComponent } from "./components/header/index.js";

class App {
    constructor() {
        this.root = document.getElementById('root');
        this.headerContainer = document.getElementById('header-container');
    }

    // Обработчик кнопки Домой
    goHome() {
        const mainPage = new MainPage(this.root);
        mainPage.render();
    }

    init() {
        // Рендерим хедер один раз
        const header = new HeaderComponent(this.headerContainer);
        header.render(() => this.goHome());

        // Стартуем с главной
        this.goHome();
    }
}

const app = new App();
app.init();