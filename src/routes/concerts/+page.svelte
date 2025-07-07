<script>
    import { onMount } from 'svelte';

    let concerts = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch('/api/concerts');
            if (!response.ok) {
                throw new Error('Nepodarilo sa načítať koncerty');
            }
            concerts = await response.json();
        } catch (e) {
            error = e.message;
            console.error('Chyba pri načítavaní koncertov:', e);
        } finally {
            loading = false;
        }
    });

    function getImageUrl(imageName) {
        return imageName ? `/uploads/concerts/${imageName}` : null;
    }

    function hasImage(imageName) {
        return imageName && imageName.trim() !== '';
    }

    function formatPrice(price) {
        return price ? `${price}€` : 'Vstup voľný';
    }
</script>

<section class="concerts-section">
    <div class="header">
        <h1>Koncerty a vystúpenia</h1>
        <p class="subtitle">Príďte si užiť našu hudbu naživo</p>
    </div>

    {#if loading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam koncerty...</p>
        </div>
    {:else if error}
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Chyba: {error}</p>
        </div>
    {:else if concerts.length === 0}
        <div class="no-concerts">
            <i class="fas fa-calendar-times"></i>
            <p>Momentálne nemáme naplánované žiadne koncerty.</p>
            <p>Sledujte naše sociálne siete pre najnovšie informácie!</p>
        </div>
    {:else}
        <div class="concerts-grid">
            {#each concerts as concert}
                <article class="concert-card">
                    <div class="concert-image">
                        {#if hasImage(concert.image)}
                            <img
                                src={getImageUrl(concert.image)}
                                alt="Obrázok koncertu {concert.title}"
                                loading="lazy"
                            />
                        {:else}
                            <img src="/img/default-concert.svg" alt="Predvolený obrázok koncertu" class="default-concert-image" loading="lazy" />
                        {/if}
                        {#if concert.is_featured}
                            <div class="featured-badge">
                                <i class="fas fa-star"></i>
                                Odporúčané
                            </div>
                        {/if}
                    </div>

                    <div class="concert-content">
                        <header class="concert-header">
                            <h2 class="concert-title">{concert.title}</h2>
                            <div class="concert-date">
                                <i class="fas fa-calendar-alt"></i>
                                <time datetime={concert.event_date}>
                                    {concert.formatted_date_time}
                                </time>
                            </div>
                        </header>

                        <div class="concert-location">
                            <div class="venue">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="venue-info">
                                    <a
                                        href={concert.google_maps_view_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="venue-link"
                                        title="Zobraziť {concert.venue} na mape"
                                    >
                                        <strong>{concert.venue}</strong>
                                    </a>
                                    <span class="city">{concert.city}</span>
                                </div>
                            </div>

                            <div class="address">
                                <a
                                    href={concert.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="maps-link navigation-link"
                                    title="Navigovať do {concert.venue}"
                                >
                                    <i class="fas fa-route"></i>
                                    <span class="address-text">{concert.address}</span>
                                    <span class="navigation-text">Navigovať</span>
                                </a>
                            </div>
                        </div>

                        <div class="concert-description">
                            <p>{concert.description}</p>
                        </div>

                        <footer class="concert-footer">
                            <div class="price">
                                <i class="fas fa-ticket-alt"></i>
                                <span>{formatPrice(concert.ticket_price)}</span>
                            </div>

                            {#if concert.ticket_url}
                                <a
                                    href={concert.ticket_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="ticket-btn"
                                >
                                    <i class="fas fa-external-link-alt"></i>
                                    Kúpiť lístky
                                </a>
                            {/if}
                        </footer>
                    </div>
                </article>
            {/each}
        </div>
    {/if}
</section>

<style>
    .concerts-section {
        padding: 40px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        margin-bottom: 50px;
    }

    .header h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        color: var(--secondary-color);
        margin-bottom: 10px;
        font-weight: bold;
    }

    .subtitle {
        font-size: clamp(1rem, 2.5vw, 1.3rem);
        color: var(--text-color);
        opacity: 0.8;
        font-style: italic;
    }

    .loading, .error, .no-concerts {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-color);
    }

    .loading i, .error i, .no-concerts i {
        font-size: 3rem;
        margin-bottom: 20px;
        display: block;
    }

    .loading i {
        color: var(--secondary-color);
    }

    .error i {
        color: #e74c3c;
    }

    .no-concerts i {
        color: var(--button-color);
    }

    .concerts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }

    .concert-card {
        background: var(--background-color);
        border: 2px solid var(--button-color);
        border-radius: 15px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .concert-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        border-color: var(--secondary-color);
    }

    .concert-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }

    .concert-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .concert-card:hover .concert-image img {
        transform: scale(1.05);
    }

    .default-concert-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius);
        transition: transform var(--transition-normal);
    }

    .default-concert-image:hover {
        transform: scale(1.05);
    }

    .featured-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .concert-content {
        padding: 25px;
    }

    .concert-header {
        margin-bottom: 20px;
    }

    .concert-title {
        font-size: 1.4rem;
        color: var(--secondary-color);
        margin-bottom: 10px;
        font-weight: bold;
        line-height: 1.3;
    }

    .concert-date {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-color);
        font-weight: 500;
    }

    .concert-date i {
        color: var(--button-hover-color);
    }

    .concert-location {
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(138, 3, 3, 0.05);
        border-radius: 10px;
        border-left: 4px solid var(--secondary-color);
    }

    .venue {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .venue i {
        color: var(--secondary-color);
        font-size: 1.1rem;
    }

    .venue-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .venue-link {
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .venue-link strong {
        display: block;
        color: var(--secondary-color);
        font-size: 1.1rem;
        font-weight: bold;
        transition: color 0.3s ease;
    }

    .venue-link:hover strong {
        color: var(--button-hover-color);
        text-decoration: underline;
    }

    .city {
        color: var(--text-color);
        opacity: 0.8;
        font-size: 0.9rem;
    }

    .address {
        margin-left: 30px;
        margin-top: 8px;
    }

    .maps-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .navigation-link {
        background: linear-gradient(135deg, var(--button-hover-color), var(--secondary-color));
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(138, 3, 3, 0.3);
    }

    .navigation-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(138, 3, 3, 0.4);
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
    }

    .navigation-link i {
        color: white;
    }

    .address-text {
        display: none;
    }

    .navigation-text {
        font-weight: bold;
    }

    /* Na väčších obrazovkách zobraz adresu namiesto "Navigovať" */
    @media (min-width: 769px) {
        .address-text {
            display: inline;
        }

        .navigation-text {
            display: none;
        }

        .navigation-link {
            background: transparent;
            color: var(--button-hover-color);
            padding: 5px 0;
            border-radius: 0;
            box-shadow: none;
            font-weight: normal;
        }

        .navigation-link:hover {
            transform: none;
            box-shadow: none;
            background: transparent;
            color: var(--secondary-color);
            text-decoration: underline;
        }

        .navigation-link i {
            color: var(--button-hover-color);
        }

        .navigation-link:hover i {
            color: var(--secondary-color);
        }
    }

    .concert-description {
        margin-bottom: 25px;
        line-height: 1.6;
        color: var(--text-color);
    }

    .concert-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        border-top: 1px solid var(--button-color);
    }

    .price {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        color: var(--secondary-color);
        font-size: 1.1rem;
    }

    .price i {
        color: var(--button-hover-color);
    }

    .ticket-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(138, 3, 3, 0.3);
    }

    .ticket-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(138, 3, 3, 0.4);
        background: linear-gradient(135deg, var(--button-hover-color), var(--secondary-color));
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .concerts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .concert-content {
            padding: 20px;
        }

        .concert-footer {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }

        .ticket-btn {
            text-align: center;
            justify-content: center;
        }

        .venue {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .address {
            margin-left: 0;
            margin-top: 15px;
        }

        .navigation-link {
            width: 100%;
            justify-content: center;
            padding: 12px 20px;
        }
    }

    @media (max-width: 480px) {
        .concerts-section {
            padding: 20px 10px;
        }

        .concert-image {
            height: 200px;
        }



        .concert-title {
            font-size: 1.2rem;
        }
    }
</style>