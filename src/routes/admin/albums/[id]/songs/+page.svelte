<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let albumId = $page.params.id;
    let album = null;
    let songs = [];
    let isLoading = true;

    onMount(async () => {
        await loadAlbumAndSongs();
    });

    async function loadAlbumAndSongs() {
        try {
            // Load album info
            const albumResponse = await fetch(`/api/albums/${albumId}`);
            if (albumResponse.ok) {
                album = await albumResponse.json();
            }

            // Load songs
            const songsResponse = await fetch(`/api/albums/${albumId}/songs`);
            if (songsResponse.ok) {
                songs = await songsResponse.json();
            }
        } catch (error) {
            console.error('Error loading album and songs:', error);
        } finally {
            isLoading = false;
        }
    }

    async function deleteSong(id, title) {
        if (!confirm(`Naozaj chcete vymazať skladbu "${title}"? Táto akcia je nevratná.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/songs/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadAlbumAndSongs();
                alert('Skladba bola úspešne vymazaná');
            } else {
                alert('Chyba pri mazaní skladby');
            }
        } catch (error) {
            console.error('Error deleting song:', error);
            alert('Chyba pri mazaní skladby');
        }
    }

    async function togglePublished(song) {
        try {
            const response = await fetch(`/api/songs/${song.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: song.title,
                    filename: song.filename,
                    duration: song.duration,
                    track_number: song.trackNumber,
                    lyrics: song.lyrics,
                    youtube_url: song.youtubeUrl,
                    spotify_url: song.spotifyUrl,
                    is_published: !song.isPublished
                })
            });

            if (response.ok) {
                await loadAlbumAndSongs();
            } else {
                alert('Chyba pri zmene stavu skladby');
            }
        } catch (error) {
            console.error('Error toggling song status:', error);
            alert('Chyba pri zmene stavu skladby');
        }
    }

    function formatDuration(seconds) {
        if (!seconds) return 'Neznáma';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function getYouTubeVideoId(url) {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    }
</script>

<svelte:head>
    <title>Skladby - {album?.title || 'Album'} - Admin</title>
</svelte:head>

<div class="admin-container">
    <header class="admin-header">
        <div class="header-info">
            <h1>
                <i class="fas fa-music"></i>
                Skladby
            </h1>
            {#if album}
                <div class="album-info">
                    <h2>{album.title}</h2>
                    {#if album.cover_image}
                        <img src="/uploads/albums/{album.coverImage}" alt="{album.title}" class="album-cover-small" />
                    {/if}
                </div>
            {/if}
        </div>
        <div class="header-actions">
            <button class="btn btn-primary" on:click={() => goto(`/admin/albums/${albumId}/songs/add`)}>
                <i class="fas fa-plus"></i>
                Pridať skladbu
            </button>
            <a href="/admin/albums/edit/{albumId}" class="btn btn-info">
                <i class="fas fa-edit"></i>
                Upraviť album
            </a>
            <a href="/admin/albums" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Späť na albumy
            </a>
        </div>
    </header>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam skladby...</p>
        </div>
    {:else if songs.length === 0}
        <div class="no-data">
            <i class="fas fa-music"></i>
            <h2>Žiadne skladby</h2>
            <p>V tomto albume zatiaľ nie sú žiadne skladby.</p>
            <button class="btn btn-primary" on:click={() => goto(`/admin/albums/${albumId}/songs/add`)}>
                <i class="fas fa-plus"></i>
                Pridať prvú skladbu
            </button>
        </div>
    {:else}
        <div class="songs-list">
            {#each songs as song, index}
                <div class="song-card">
                    <div class="song-number">
                        {song.trackNumber || index + 1}
                    </div>
                    
                    <div class="song-info">
                        <h3>{song.title}</h3>
                        <div class="song-meta">
                            <span class="duration">
                                <i class="fas fa-clock"></i>
                                {formatDuration(song.duration)}
                            </span>
                            {#if song.youtube_url}
                                <span class="youtube">
                                    <i class="fab fa-youtube"></i>
                                    YouTube
                                </span>
                            {/if}
                            {#if song.spotify_url}
                                <span class="spotify">
                                    <i class="fab fa-spotify"></i>
                                    Spotify
                                </span>
                            {/if}
                            {#if song.filename}
                                <span class="audio-file">
                                    <i class="fas fa-file-audio"></i>
                                    Audio súbor
                                </span>
                            {/if}
                            {#if song.lyrics}
                                <span class="lyrics">
                                    <i class="fas fa-align-left"></i>
                                    Text
                                </span>
                            {/if}
                        </div>
                    </div>

                    <div class="song-preview">
                        {#if song.youtube_url}
                            {@const videoId = getYouTubeVideoId(song.youtube_url)}
                            {#if videoId}
                                <div class="youtube-thumbnail">
                                    <img src="https://img.youtube.com/vi/{videoId}/mqdefault.jpg" alt="YouTube thumbnail" />
                                    <div class="play-overlay">
                                        <i class="fab fa-youtube"></i>
                                    </div>
                                </div>
                            {/if}
                        {:else if song.filename}
                            <div class="audio-preview">
                                <i class="fas fa-file-audio"></i>
                                <span>Audio súbor</span>
                            </div>
                        {:else}
                            <div class="no-preview">
                                <i class="fas fa-music"></i>
                            </div>
                        {/if}
                    </div>

                    <div class="song-status">
                        <button 
                            class="status-toggle {song.isPublished ? 'published' : 'unpublished'}"
                            on:click={() => togglePublished(song)}
                            title="{song.isPublished ? 'Publikovaná' : 'Nepublikovaná'}"
                        >
                            <i class="fas {song.isPublished ? 'fa-eye' : 'fa-eye-slash'}"></i>
                        </button>
                    </div>

                    <div class="song-actions">
                        <button class="btn btn-sm btn-primary" on:click={() => goto(`/admin/albums/${albumId}/songs/edit/${song.id}`)}>
                            <i class="fas fa-edit"></i>
                            Upraviť
                        </button>
                        <button class="btn btn-sm btn-danger" on:click={() => deleteSong(song.id, song.title)}>
                            <i class="fas fa-trash"></i>
                            Vymazať
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: var(--bg-color);
        min-height: 100vh;
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--secondary-color);
    }

    .header-info h1 {
        color: var(--secondary-color);
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .album-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .album-info h2 {
        color: var(--text-color);
        margin: 0;
        font-size: 1.2rem;
    }

    .album-cover-small {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
    }

    .header-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .loading, .no-data {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-color);
    }

    .loading i, .no-data i {
        font-size: 3rem;
        color: var(--button-color);
        margin-bottom: 20px;
        display: block;
    }

    .songs-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .song-card {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        display: grid;
        grid-template-columns: auto 1fr auto auto auto;
        gap: 20px;
        align-items: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .song-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .song-number {
        background: var(--button-color);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.1rem;
    }

    .song-info h3 {
        color: var(--secondary-color);
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }

    .song-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        font-size: 0.9rem;
    }

    .song-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-color);
    }

    .song-meta .youtube i { color: #ff0000; }
    .song-meta .spotify i { color: #1db954; }
    .song-meta .audio-file i { color: var(--button-color); }
    .song-meta .lyrics i { color: var(--secondary-color); }

    .song-preview {
        width: 80px;
        height: 60px;
    }

    .youtube-thumbnail {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
    }

    .youtube-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .play-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
    }

    .audio-preview, .no-preview {
        width: 100%;
        height: 100%;
        background: var(--border-color);
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-color);
        font-size: 0.8rem;
    }

    .audio-preview i, .no-preview i {
        font-size: 1.5rem;
        margin-bottom: 5px;
        color: var(--button-color);
    }

    .status-toggle {
        background: rgba(0,0,0,0.7);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .status-toggle.published {
        background: rgba(34, 197, 94, 0.8);
    }

    .status-toggle.unpublished {
        background: rgba(239, 68, 68, 0.8);
    }

    .song-actions {
        display: flex;
        gap: 8px;
    }

    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .btn-sm {
        padding: 6px 12px;
        font-size: 0.8rem;
    }

    .btn-primary {
        background: var(--button-color);
        color: white;
    }

    .btn-secondary {
        background: var(--secondary-color);
        color: white;
    }

    .btn-info {
        background: #3b82f6;
        color: white;
    }

    .btn-danger {
        background: #ef4444;
        color: white;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
        }

        .header-actions {
            justify-content: center;
        }

        .song-card {
            grid-template-columns: 1fr;
            gap: 15px;
            text-align: center;
        }

        .song-preview {
            justify-self: center;
        }

        .song-actions {
            justify-content: center;
        }
    }
</style>
