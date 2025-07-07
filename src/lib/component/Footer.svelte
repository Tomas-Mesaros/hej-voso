<footer class="footer">
    <p>&copy; 2025 Hej-Voso. Všetky práva vyhradené.</p>
</footer>

<style>
    .footer {
        width: 100%;
        padding: var(--spacing-lg) 0;
        text-align: center;
    }

    .footer p {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color);
        opacity: 0.9;
    }

    /* Responzívne úpravy */
    @media (max-width: 768px) {
        .footer {
            padding: var(--spacing-md) 0;
        }

        .footer p {
            font-size: var(--font-size-xs);
        }
    }
</style>