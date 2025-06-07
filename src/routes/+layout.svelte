<script>
    import "../styles/app.css";
    import NavBar from "$lib/component/NavBar.svelte";
    import Footer from "$lib/component/Footer.svelte";
    import '@fortawesome/fontawesome-free/css/all.min.css';
</script>
<main class="flex-column">
    <NavBar/>
    
    <div class="main-obsah">
        <slot /> <!-- tu sa zobrazí aktívna stránka (napr. /about, /contact, ...) -->
    </div>
    <div class="spacer"></div>
    <Footer/>
</main>

<style>
    main{
        width: 100%;
        min-height: 100vh;
        background-color: var(--background-color);
        font-family: var(--font-main);
        word-spacing: var(--word-spacing);
        letter-spacing: var(--letter-spacing);
        font-family: 'Times New Roman', Times, serif;
        color: var(--text-color);
    }

    .main-obsah{
        width: 95%;
        height: 100%;
        margin: 0 auto;
    }

    @media(max-width:855px){
        .main-obsah{
        width: 100%;
        padding: 0 5px;
        }
    }

</style>