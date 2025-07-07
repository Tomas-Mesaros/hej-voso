<script>
    import AudioPlayer from '$lib/component/AudioPlayer.svelte';

    export let data;
    let albums = data.albums || [];
    let selectedSong = null;
    let showLyrics = {};

    function playSong(song, album) {
        selectedSong = { ...song, album };

    }

    function toggleLyrics(songId) {
        showLyrics[songId] = !showLyrics[songId];
        showLyrics = { ...showLyrics }; // Trigger reactivity
    }

    function formatDuration(seconds) {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
</script>

<svelte:head>
    <title>Albumy - Hej-Voso</title>
    <meta name="description" content="Albumy a skladby kapely Hej-Voso. Počúvajte našu hudbu a čítajte texty piesní." />
</svelte:head>

<main class="music-page">
    <div class="container">
        <header class="music-header">
            <div class="header-content">
                <div class="title-section">
                    <h1><i class="fas fa-music"></i> Naša hudba</h1>
                    <p class="subtitle">Objavte naše albumy a skladby</p>
                </div>
                
                <!-- Audio Player -->
                {#if selectedSong}
                    <div class="header-player">
                        <AudioPlayer song={selectedSong} mini={true} />
                    </div>
                {/if}
            </div>
        </header>

        {#if albums && albums.length > 0}
            <section class="albums-section">
                {#each albums as album}
                    <article class="album-card">
                        <div class="album-header">
                            <div class="album-cover">
                                {#if album.coverImage}
                                    <img src="/uploads/albums/{album.coverImage}" alt="{album.title}" loading="lazy" />
                                {:else}
                                    <img src="/img/default-album.svg" alt="Predvolený obrázok albumu" class="default-album-image" loading="lazy" />
                                {/if}
                            </div>
                            <div class="album-info">
                                <h2>{album.title}</h2>
                                {#if album.releaseDate}
                                    <p class="release-date">
                                        <i class="fas fa-calendar"></i>
                                        {new Date(album.releaseDate).getFullYear()}
                                    </p>
                                {/if}

                                {#if album.description}
                                    <p class="album-description">{album.description}</p>
                                {/if}
                            </div>
                            

                        </div>

                        {#if album.songs && album.songs.length > 0}
                            <div class="songs-list">
                                <h3><i class="fas fa-list"></i> Skladby</h3>

                                {#each album.songs as song}
                                    <div class="song-item">
                                        <div class="song-header">
                                            <div class="song-info">
                                                <span class="track-number">{song.trackNumber || '•'}</span>
                                                <h4 class="song-title">{song.title}</h4>
                                                <span class="song-duration">{formatDuration(song.duration)}</span>
                                            </div>

                                            <div class="song-actions">
                                                {#if song.filename}
                                                    <button class="play-btn" on:click={() => playSong(song, album)} title="Prehrať skladbu">
                                                        <i class="fas fa-play"></i>
                                                    </button>
                                                {/if}

                                                {#if song.lyrics}
                                                    <button class="lyrics-btn" on:click={() => toggleLyrics(song.id)} title="Zobraziť/skryť text">
                                                        <i class="fas {showLyrics[song.id] ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                                        Text
                                                    </button>
                                                {/if}

                                                {#if song.youtubeUrl}
                                                    <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" class="youtube-link" title="Pozrieť na YouTube">
                                                        <i class="fab fa-youtube"></i>
                                                    </a>
                                                {/if}

                                                {#if song.spotifyUrl}
                                                    <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" class="spotify-link" title="Počúvať na Spotify">
                                                        <i class="fab fa-spotify"></i>
                                                    </a>
                                                {/if}
                                            </div>
                                        </div>

                                        {#if showLyrics[song.id] && song.lyrics}
                                            <div class="lyrics-container">
                                                <div class="lyrics-content">
                                                    <h5><i class="fas fa-quote-left"></i> Text piesne</h5>
                                                    <pre class="lyrics-text">{song.lyrics}</pre>
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="no-songs">
                                <p><i class="fas fa-info-circle"></i> Tento album zatiaľ neobsahuje žiadne publikované skladby</p>
                            </div>
                        {/if}
                    </article>
                {/each}
            </section>
        {:else}
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <h2>Zatiaľ tu nie sú žiadne albumy</h2>
                <p>Albumy budú pridané čoskoro!</p>
            </div>
        {/if}


    </div>
</main>

<style>
    /* Loading state */
    .loading {
        text-align: center;
        padding: 40px;
        color: var(--text-color);
    }

    /* Header */
    .music-header {
        margin-bottom: 40px;
    }
    
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .title-section {
        text-align: left;
    }
    
    .header-player {
        max-width: 400px;
    }

    .music-header h1 {
        color: var(--secondary-color);
        font-size: var(--font-size-lg);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    .subtitle {
        color: var(--text-color);
        font-size: var(--font-size-me);
        opacity: 0.8;
    }

    /* Albums section */
    .albums-section {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    /* Album card */
    .album-card {
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border: 1px solid #333;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .album-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(139, 69, 19, 0.2);
    }

    /* Album header */
    .album-header {
        display: flex;
        gap: 25px;
        margin-bottom: 30px;
        align-items: flex-start;
        position: relative;
    }
    


    .album-cover {
        flex-shrink: 0;
        width: 150px;
        height: 150px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .album-cover:hover img {
        transform: scale(1.05);
    }

    .default-album-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius);
        transition: transform var(--transition-normal);
    }

    .default-album-image:hover {
        transform: scale(1.05);
    }

    .album-info h2 {
        color: var(--secondary-color);
        font-size: var(--font-size-lg);
        margin-bottom: 10px;
        font-weight: bold;
    }

    .release-date {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        margin-bottom: 15px;
        opacity: 0.8;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .album-description {
        color: var(--text-color);
        font-size: var(--font-size-me);
        line-height: 1.6;
        opacity: 0.9;
    }

    /* Songs list */
    .songs-list h3 {
        color: var(--secondary-color);
        font-size: var(--font-size-me);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
    }

    .song-item {
        background: #222;
        border-radius: 8px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: background-color 0.3s ease;
    }

    .song-item:hover {
        background: #2a2a2a;
    }

    .song-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
    }

    .song-info {
        display: flex;
        align-items: center;
        gap: 15px;
        flex: 1;
    }

    .track-number {
        color: var(--secondary-color);
        font-weight: bold;
        min-width: 20px;
        text-align: center;
    }

    .song-title {
        color: var(--text-color);
        font-size: var(--font-size-me);
        margin: 0;
        flex: 1;
    }

    .song-duration {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        opacity: 0.7;
        min-width: 50px;
        text-align: right;
    }

    /* Song actions */
    .song-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .play-btn, .lyrics-btn {
        background: var(--secondary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .lyrics-btn {
        background: #666;
        border-radius: 20px;
        width: auto;
        padding: 8px 12px;
        gap: 5px;
        font-size: 12px;
    }

    .play-btn:hover {
        background: #A0522D;
        transform: scale(1.1);
    }

    .lyrics-btn:hover {
        background: #777;
    }

    .youtube-link, .spotify-link {
        color: #ff0000;
        font-size: 20px;
        transition: transform 0.3s ease;
        text-decoration: none;
    }

    .spotify-link {
        color: #1db954;
    }

    .youtube-link:hover, .spotify-link:hover {
        transform: scale(1.2);
    }

    /* Lyrics */
    .lyrics-container {
        background: #1a1a1a;
        border-top: 1px solid #333;
    }

    .lyrics-content {
        padding: 20px;
    }

    .lyrics-content h5 {
        color: var(--secondary-color);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .lyrics-text {
        color: var(--text-color);
        font-family: inherit;
        font-size: var(--font-size-sm);
        line-height: 1.8;
        white-space: pre-wrap;
        margin: 0;
        opacity: 0.9;
    }

    /* Empty states */
    .empty-state, .no-songs {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-color);
        opacity: 0.7;
    }

    .empty-state i {
        font-size: 4rem;
        color: var(--secondary-color);
        margin-bottom: 20px;
        display: block;
    }

    .empty-state h2 {
        color: var(--text-color);
        margin-bottom: 10px;
    }

    .no-songs p {
        color: var(--text-color);
        font-style: italic;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .album-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .header-content {
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        
        .title-section {
            text-align: center;
        }
        
        .header-player {
            max-width: 100%;
        }

        .album-cover {
            width: 120px;
            height: 120px;
        }

        .song-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }

        .song-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .song-actions {
            align-self: flex-end;
        }
    }
</style>
