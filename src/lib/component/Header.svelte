<script>

</script>

<header class="hero-section">
    <div class="hero-content">
        <div class="logo-container">
            <img src="/img/default-logo.svg" alt="Logo kapely" class="logo zoom-in" />
        </div>

        <h1 class="artist-name wave-line">
            <span style="--i:0">H</span>
            <span style="--i:1">e</span>
            <span style="--i:2">j</span>
            <span style="--i:3">-</span>
            <span style="--i:4">V</span>
            <span style="--i:5">o</span>
            <span style="--i:6">s</span>
            <span style="--i:7">o</span>
        </h1>

        <div class="subtitle fade-in">
            <p>Slovenská hudobná skupina</p>
        </div>
    </div>
</header>

<style>
    .hero-section {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--spacing-xxl) var(--spacing-md);
        background: linear-gradient(135deg, var(--background-color) 0%, rgba(138, 3, 3, 0.1) 100%);
    }

    .hero-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xl);
        max-width: 800px;
        width: 100%;
    }

    .logo-container {
        margin-bottom: var(--spacing-md);
    }

    .logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: var(--shadow-lg);
        border: 4px solid var(--secondary-color);
        transition: transform var(--transition-normal);
        object-fit: cover;
    }

    .logo:hover {
        transform: scale(1.05) rotate(5deg);
    }

    .artist-name {
        font-size: clamp(3rem, 8vw, 6rem);
        margin: 0;
        color: var(--secondary-color);
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-weight: bold;
        line-height: var(--line-height-tight);
    }

    .subtitle {
        margin-top: var(--spacing-sm);
    }

    .subtitle p {
        font-size: clamp(var(--font-size-md), 3vw, var(--font-size-lg));
        color: var(--text-color);
        margin: 0;
        opacity: 0.9;
        font-style: italic;
        line-height: var(--line-height-normal);
    }
    /******** Animácie *********/
    .zoom-in {
        opacity: 0;
        transform: scale(0.3) rotate(-180deg);
        animation: zoomIn 2s ease-out forwards;
    }

    @keyframes zoomIn {
        0% {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
        }
        70% {
            transform: scale(1.1) rotate(10deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    .wave-line span {
        display: inline-block;
        animation: wave-letter 1.5s ease-in-out 2;
        animation-delay: calc(var(--i) * 0.1s + 1s);
        opacity: 0;
        animation-fill-mode: forwards;
    }

    @keyframes wave-letter {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        50% {
            opacity: 1;
            transform: translateY(-15px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeIn 1.5s ease-out forwards;
        animation-delay: 2.5s;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responzívne úpravy */
    @media (max-width: 1000px) {
        .hero-section {
            min-height: 70vh;
            padding: var(--spacing-xl) var(--spacing-sm);
        }

        .logo {
            width: 100px;
            height: 100px;
        }

        .artist-name {
            font-size: clamp(2.5rem, 7vw, 5rem);
        }

        .subtitle p {
            font-size: clamp(var(--font-size-sm), 2.5vw, var(--font-size-md));
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            min-height: 60vh;
            padding: var(--spacing-lg) var(--spacing-xs);
        }

        .hero-content {
            gap: var(--spacing-md);
        }

        .logo {
            width: 80px;
            height: 80px;
        }

        .artist-name {
            font-size: clamp(2rem, 6vw, 3.5rem);
        }

        .subtitle p {
            font-size: clamp(var(--font-size-xs), 2vw, var(--font-size-sm));
        }
    }

</style>