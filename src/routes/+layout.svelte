<script>
    import "../styles/app.css";
    import NavBar from "$lib/component/NavBar.svelte";
    import Footer from "$lib/component/Footer.svelte";
    import '@fortawesome/fontawesome-free/css/all.min.css';
</script>
<div class="app-wrapper">
    <!-- Navigácia s pozadím na celú šírku -->
    <div class="nav-wrapper">
        <div class="content-container">
            <NavBar/>
        </div>
    </div>

    <!-- Hlavný obsah -->
    <main class="main-wrapper">
        <div class="content-container">
            <slot /> <!-- tu sa zobrazí aktívna stránka (napr. /about, /contact, ...) -->
        </div>
    </main>

    <!-- Footer s pozadím na celú šírku -->
    <div class="footer-wrapper">
        <div class="content-container">
            <Footer/>
        </div>
    </div>
</div>

<style>
    .app-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
    }

    .nav-wrapper {
        background-color: var(--primary-color);
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-md);
    }

    .main-wrapper {
        flex: 1;
        width: 100%;
        padding: var(--spacing-xl) 0;
    }

    .footer-wrapper {
        background-color: var(--primary-color);
        width: 100%;
        margin-top: auto;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Responzívne úpravy */
    @media (max-width: 768px) {
        .main-wrapper {
            padding: var(--spacing-lg) 0;
        }
    }
</style>