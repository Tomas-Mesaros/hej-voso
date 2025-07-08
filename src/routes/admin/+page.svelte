<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let isLoggedIn = false;
    let userName = '';

    onMount(() => {
        if (browser) {
            const loggedIn = localStorage.getItem('isLoggedIn');
            const name = localStorage.getItem('userName');
            
            if (loggedIn === 'true' && name) {
                isLoggedIn = true;
                userName = name;
            } else {
                goto('/login');
            }
        }
    });

    function logout() {
        if (browser) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
        }
        goto('/');
    }
</script>

<svelte:head>
    <title>Admin Panel - Hej-Voso</title>
    <meta name="description" content="Administračný panel pre správu obsahu" />
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLoggedIn}
    <main class="admin-page">
        <div class="admin-header">
            <div class="header-content">
                <div class="welcome-section">
                    <h1><i class="fas fa-cogs"></i> Admin Panel</h1>
                    <p class="welcome-text">Vitajte, <strong>{userName}</strong>!</p>
                </div>
                
                <button class="logout-btn" on:click={logout}>
                    <i class="fas fa-sign-out-alt"></i>
                    Odhlásiť sa
                </button>
            </div>
        </div>

        <div class="admin-content">
            <div class="admin-grid">
                <!-- Správa členov kapely -->
                <div class="admin-card">
                    <div class="card-header">
                        <i class="fas fa-users"></i>
                        <h2>Členovia kapely</h2>
                    </div>
                    <div class="card-content">
                        <p>Spravujte členov kapely, ich profily a statusy</p>
                        <div class="card-actions">
                            <a href="/admin/members" class="action-btn primary">
                                <i class="fas fa-edit"></i>
                                Spravovať členov
                            </a>
                            <a href="/admin/members/add" class="action-btn secondary">
                                <i class="fas fa-plus"></i>
                                Pridať člena
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Správa hudby -->
                <div class="admin-card">
                    <div class="card-header">
                        <i class="fas fa-music"></i>
                        <h2>Hudba & Albumy</h2>
                    </div>
                    <div class="card-content">
                        <p>Pridávajte albumy, skladby a spravujte hudobný obsah</p>
                        <div class="card-actions">
                            <a href="/admin/albums" class="action-btn primary">
                                <i class="fas fa-compact-disc"></i>
                                Spravovať albumy
                            </a>
                            <a href="/admin/albums/add" class="action-btn secondary">
                                <i class="fas fa-plus"></i>
                                Pridať album
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Správa galérie -->
                <div class="admin-card">
                    <div class="card-header">
                        <i class="fas fa-images"></i>
                        <h2>Galéria</h2>
                    </div>
                    <div class="card-content">
                        <p>Organizujte fotografie do kategórií a spravujte galériu</p>
                        <div class="card-actions">
                            <a href="/admin/gallery" class="action-btn primary">
                                <i class="fas fa-images"></i>
                                Spravovať galériu
                            </a>
                            <a href="/admin/gallery/add-category" class="action-btn secondary">
                                <i class="fas fa-plus"></i>
                                Pridať kategóriu
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Štatistiky -->
                <div class="admin-card">
                    <div class="card-header">
                        <i class="fas fa-chart-bar"></i>
                        <h2>Štatistiky</h2>
                    </div>
                    <div class="card-content">
                        <p>Prehľad návštevnosti a popularity obsahu</p>
                        <div class="card-actions">
                            <a href="/admin/analytics" class="action-btn primary">
                                <i class="fas fa-chart-bar"></i>
                                Zobraziť štatistiky
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Nastavenia -->
                <div class="admin-card">
                    <div class="card-header">
                        <i class="fas fa-cog"></i>
                        <h2>Nastavenia</h2>
                    </div>
                    <div class="card-content">
                        <p>Všeobecné nastavenia webu a administrácie</p>
                        <div class="card-actions">
                            <a href="/admin/settings" class="action-btn primary">
                                <i class="fas fa-wrench"></i>
                                Nastavenia
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Rýchle akcie -->
                <div class="admin-card quick-actions">
                    <div class="card-header">
                        <i class="fas fa-bolt"></i>
                        <h2>Rýchle akcie</h2>
                    </div>
                    <div class="card-content">
                        <div class="quick-action-grid">
                            <button class="quick-btn">
                                <i class="fas fa-eye"></i>
                                Náhľad webu
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-database"></i>
                                Záloha DB
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-broom"></i>
                                Vyčistiť cache
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-upload"></i>
                                Nahrať súbory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
{:else}
    <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Kontrolujem prihlásenie...
    </div>
{/if}

<style>
    .admin-page {
        min-height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
    }

    .admin-header {
        background: linear-gradient(135deg, var(--primary-color), rgba(138, 3, 3, 0.8));
        padding: var(--spacing-xl) 0;
        border-bottom: 3px solid var(--secondary-color);
        margin-bottom: var(--spacing-xxl);
        box-shadow: var(--shadow-md);
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }

    .welcome-section h1 {
        color: var(--secondary-color);
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .welcome-text {
        color: var(--text-color);
        font-size: var(--font-size-lg);
        margin: 0;
        opacity: 0.9;
    }

    .logout-btn {
        background-color: var(--error-color);
        color: var(--text-color);
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: var(--font-size-sm);
        font-weight: 600;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        box-shadow: var(--shadow-sm);
    }

    .logout-btn:hover {
        background-color: #c0392b;
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--spacing-xl);
    }

    .admin-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius-large);
        padding: var(--spacing-lg);
        border: 2px solid transparent;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-md);
    }

    .admin-card:hover {
        border-color: var(--secondary-color);
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-md);
        border-bottom: 2px solid var(--border-color);
    }

    .card-header i {
        font-size: var(--font-size-lg);
        color: var(--secondary-color);
    }

    .card-header h2 {
        color: var(--text-color);
        font-size: var(--font-size-lg);
        margin: 0;
    }

    .card-content p {
        color: var(--text-color);
        opacity: 0.8;
        margin-bottom: 20px;
        line-height: 1.6;
    }

    .card-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: var(--font-size-sm);
    }

    .action-btn.primary {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    .action-btn.primary:hover {
        background-color: var(--button-hover-color);
        transform: translateX(5px);
    }

    .action-btn.secondary {
        background-color: var(--button-color);
        color: var(--text-color);
        border: 1px solid var(--secondary-color);
    }

    .action-btn.secondary:hover {
        background-color: var(--button-hover-color);
        color: var(--text-color);
    }

    .quick-actions {
        grid-column: 1 / -1;
    }

    .quick-action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .quick-btn {
        background-color: var(--button-color);
        color: var(--text-color);
        border: 1px solid var(--secondary-color);
        padding: 15px 10px;
        border-radius: 8px;
        cursor: pointer;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .quick-btn:hover {
        background-color: var(--secondary-color);
        color: var(--background-color);
        transform: scale(1.05);
    }

    .quick-btn i {
        font-size: 20px;
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-size: var(--font-size-me);
        color: var(--text-color);
        gap: 15px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .admin-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .header-content {
            flex-direction: column;
            text-align: center;
        }

        .card-actions {
            flex-direction: column;
        }

        .quick-action-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .admin-card {
            padding: 20px;
        }

        .quick-action-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
