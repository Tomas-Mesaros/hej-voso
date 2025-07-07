<script>
    import { page } from "$app/stores"

    $: url = $page.url.pathname

</script>

<nav class="navbar">
    <div class="nav-links">
        <a class:selected={url === '/'} class="btn" href="/">Home</a>
        <a class:selected={url === '/about'} class="btn" href="/about">O kapele</a>
        <a class:selected={url === '/albums'} class="btn" href="/albums">Hudba</a>
        <a class:selected={url === '/concerts'} class="btn" href="/concerts">Vystúpenia</a>
        <a class:selected={url === '/gallery'} class="btn" href="/gallery">Galéria</a>
    </div>
</nav>
<style>
    .navbar {
        display: flex;
        align-items: center;
        padding: var(--spacing-lg) 0;
        width: 100%;
    }

    .nav-links {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-lg);
        align-items: center;
    }

    .navbar .btn {
        background-color: transparent;
        border: 2px solid transparent;
        transition: all var(--transition-normal);
    }

    .navbar .btn:hover {
        background-color: var(--button-hover-color);
        border-color: var(--secondary-color);
    }

    .navbar .btn.selected {
        background-color: var(--button-hover-color);
        border-color: var(--secondary-color);
        font-weight: bold;
    }

    /* Responzívne úpravy */
    @media (max-width: 768px) {
        .navbar {
            padding: var(--spacing-md) 0;
        }

        .nav-links {
            flex-wrap: wrap;
            gap: var(--spacing-sm);
            justify-content: center;
        }

        .navbar .btn {
            font-size: var(--font-size-xs);
            padding: var(--spacing-xs) var(--spacing-sm);
        }
    }
</style>