<script>
    import { page } from "$app/stores"
    import { browser } from '$app/environment'
    import { onMount } from 'svelte'

    $: url = $page.url.pathname
    let isLoggedIn = false

    onMount(() => {
        if (browser) {
            checkLoginStatus()
        }
    })

    function checkLoginStatus() {
        const loginStatus = localStorage.getItem('isLoggedIn')
        const loginTime = localStorage.getItem('loginTime')
        
        if (loginStatus === 'true' && loginTime) {
            const now = new Date().getTime()
            const loginTimestamp = parseInt(loginTime)
            const hoursDiff = (now - loginTimestamp) / (1000 * 60 * 60)
            
            // Ak je prihlásený menej ako 24 hodín
            if (hoursDiff < 24) {
                isLoggedIn = true
            } else {
                // Vymaž staré prihlásenie
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('loginTime')
                localStorage.removeItem('userToken')
                localStorage.removeItem('userName')
                isLoggedIn = false
            }
        }
    }

</script>

<nav class="navbar">
    <div class="nav-links">
        <a class:selected={url === '/'} class="btn" href="/">Home</a>
        <a class:selected={url === '/about'} class="btn" href="/about">O kapele</a>
        <a class:selected={url === '/albums'} class="btn" href="/albums">Hudba</a>
        <a class:selected={url === '/concerts'} class="btn" href="/concerts">Vystúpenia</a>
        <a class:selected={url === '/gallery'} class="btn" href="/gallery">Galéria</a>
        {#if isLoggedIn}
            <a class:selected={url.startsWith('/admin')} class="btn admin-btn" href="/admin">
                <i class="fas fa-cog"></i>
                Admin
            </a>
        {/if}
    </div>
</nav>
<style>
    .navbar {
        display: flex;
        align-items: center;
        padding: var(--spacing-lg) 0;
        width: 100%;
        background-color: var(--background-color);
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 1px solid var(--border-color);
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

    .admin-btn {
        background-color: rgba(220, 53, 69, 0.1) !important;
        border-color: #dc3545 !important;
        color: #dc3545 !important;
    }

    .admin-btn:hover {
        background-color: #dc3545 !important;
        color: white !important;
    }

    .admin-btn i {
        margin-right: 5px;
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