<script>
    import { onMount } from 'svelte';

    let stats = {
        pageViews: [],
        songPlays: [],
        topSongs: [],
        totalViews: 0,
        totalPlays: 0
    };
    let isLoading = true;

    onMount(async () => {
        await loadStats();
    });

    async function loadStats() {
        try {
            const response = await fetch('/api/analytics/stats');
            if (response.ok) {
                stats = await response.json();
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            isLoading = false;
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('sk-SK');
    }

    function getPlayPercentage(playedTime, duration) {
        if (!duration) return 0;
        return Math.round((playedTime / duration) * 100);
    }
</script>

<svelte:head>
    <title>Štatistiky - Admin</title>
</svelte:head>

<main class="admin-container">
    <header class="admin-header">
        <h1><i class="fas fa-chart-bar"></i> Štatistiky</h1>
        <p>Prehľad návštevnosti a prehrávania skladieb</p>
    </header>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam štatistiky...</p>
        </div>
    {:else}
        <div class="stats-grid">
            <!-- Súhrn -->
            <div class="stats-card">
                <h3><i class="fas fa-eye"></i> Celkové návštevy</h3>
                <div class="stat-number">{stats.totalViews}</div>
            </div>

            <div class="stats-card">
                <h3><i class="fas fa-play"></i> Celkové prehrávania</h3>
                <div class="stat-number">{stats.totalPlays}</div>
            </div>

            <!-- Top skladby -->
            <div class="stats-section">
                <h3><i class="fas fa-trophy"></i> Najhranejšie skladby</h3>
                {#if stats.topSongs.length > 0}
                    <div class="top-songs">
                        {#each stats.topSongs as song, index}
                            <div class="song-stat">
                                <div class="rank">#{index + 1}</div>
                                <div class="song-info">
                                    <strong>{song.title}</strong>
                                    <small>{song.album?.title || 'Neznámy album'}</small>
                                </div>
                                <div class="play-count">{song.playCount} prehratí</div>
                                <div class="completion-rate">
                                    {Math.round((song.completed70Count / song.playCount) * 100)}% dokončených
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">Zatiaľ žiadne prehrávania</p>
                {/if}
            </div>

            <!-- Posledné návštevy -->
            <div class="stats-section">
                <h3><i class="fas fa-clock"></i> Posledné návštevy stránok</h3>
                {#if stats.pageViews.length > 0}
                    <div class="page-views">
                        {#each stats.pageViews.slice(0, 10) as view}
                            <div class="view-item">
                                <span class="page">{view.page}</span>
                                <span class="date">{formatDate(view.createdAt)}</span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">Zatiaľ žiadne návštevy</p>
                {/if}
            </div>

            <!-- Posledné prehrávania -->
            <div class="stats-section">
                <h3><i class="fas fa-music"></i> Posledné prehrávania</h3>
                {#if stats.songPlays.length > 0}
                    <div class="song-plays">
                        {#each stats.songPlays.slice(0, 10) as play}
                            <div class="play-item">
                                <div class="song-title">{play.song.title}</div>
                                <div class="play-info">
                                    <span class="percentage">{getPlayPercentage(play.playedTime, play.duration)}%</span>
                                    <span class="completed {play.completed70 ? 'yes' : 'no'}">
                                        {play.completed70 ? '✓' : '✗'}
                                    </span>
                                    <span class="date">{formatDate(play.createdAt)}</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">Zatiaľ žiadne prehrávania</p>
                {/if}
            </div>
        </div>
    {/if}
</main>

<style>
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .admin-header {
        margin-bottom: 2rem;
        text-align: center;
    }

    .admin-header h1 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .loading {
        text-align: center;
        padding: 4rem;
        color: #7f8c8d;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .stats-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .stats-card h3 {
        color: #3498db;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .stat-number {
        font-size: 3rem;
        font-weight: bold;
        color: #2c3e50;
    }

    .stats-section {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        grid-column: 1 / -1;
    }

    .stats-section h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .top-songs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .song-stat {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .rank {
        font-size: 1.5rem;
        font-weight: bold;
        color: #e74c3c;
        min-width: 40px;
    }

    .song-info strong {
        display: block;
        color: #2c3e50;
    }

    .song-info small {
        color: #7f8c8d;
    }

    .play-count {
        font-weight: bold;
        color: #3498db;
    }

    .completion-rate {
        color: #27ae60;
        font-size: 0.9rem;
    }

    .page-views, .song-plays {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .view-item, .play-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .play-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
    }

    .play-info {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .percentage {
        font-weight: bold;
        color: #3498db;
    }

    .completed.yes {
        color: #27ae60;
    }

    .completed.no {
        color: #e74c3c;
    }

    .date {
        color: #7f8c8d;
        font-size: 0.9rem;
    }

    .no-data {
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        padding: 2rem;
    }

    @media (max-width: 768px) {
        .song-stat {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .play-item {
            grid-template-columns: 1fr;
        }

        .play-info {
            justify-content: center;
        }
    }
</style>