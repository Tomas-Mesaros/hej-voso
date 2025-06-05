<script>
    import { page } from "$app/stores"

    $: url = $page.url.pathname

</script>

<nav class="flex-row">
    <div class="navBar">
        <a class:selected={url === '/'} class="btn" href="/">Home</a>
        <a class:selected={url === '/about'} class="btn" href="/about">O mne</a>
        <a class:selected={url === '/albums'} class="btn" href="/albums">Hudba</a>
        <a class:selected={url === '/concerts'} class="btn" href="/concerts">Vystúpenia</a>
        <a class:selected={url === '/contact'} class="btn" href="/contact">Kontakt</a>
        <a class:selected={url === '/gallery'} class="btn" href="/gallery">Galéria</a>
        <a class:selected={url === '/e-shop'} class="btn" href="/e-shop">Obchod</a>
    </div>
    <!-- <div class="navBar-btn">
        <i class="fas fa-bars "></i>
        <i class="fa-solid fa-xmark "></i>
    </div> -->
</nav>
<style>
    nav{
        background-color: var(--primary-color);
        padding: 15px 20px;
        gap: var(--gap);
        margin-bottom: 20px;
        align-items: center;
    }

    .navBar{
        display: flex;
        flex-direction: row;
        gap: var(--gap);
    }

    /* .navBar-btn{
        position: absolute;
        right: 0;
        top: 0;
        padding: 15px;
    } */

    a.selected {
        background-color: var(--button-hover-color);
		font-weight: bold;
	}

    @media (max-width:855px){
        .navBar{
            display:flex;
            flex-wrap:wrap;
            margin: 0 auto;
        }
    }

</style>