<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let albumId = $page.params.id;
    let album = null;
    let formData = {
        album_id: albumId,
        title: '',
        filename: '',
        duration: null,
        track_number: 1,
        lyrics: '',
        youtube_url: '',
        spotify_url: '',
        is_published: true
    };

    let isSubmitting = false;
    let audioFile = null;
    let isLoadingAlbum = true;

    onMount(async () => {
        await loadAlbum();
        await getNextTrackNumber();
    });

    async function loadAlbum() {
        try {
            const response = await fetch(`/api/albums/${albumId}`);
            if (response.ok) {
                album = await response.json();
            } else {
                alert('Album sa nenašiel');
                goto('/admin/albums');
            }
        } catch (error) {
            console.error('Error loading album:', error);
            alert('Chyba pri načítaní albumu');
        } finally {
            isLoadingAlbum = false;
        }
    }

    async function getNextTrackNumber() {
        try {
            const response = await fetch(`/api/albums/${albumId}/songs`);
            if (response.ok) {
                const songs = await response.json();
                const maxTrackNumber = Math.max(...songs.map(s => s.track_number || 0), 0);
                formData.track_number = maxTrackNumber + 1;
            }
        } catch (error) {
            console.error('Error getting track number:', error);
        }
    }

    async function handleAudioUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            alert('Prosím vyberte audio súbor');
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('Audio súbor je príliš veľký. Maximálna veľkosť je 50MB.');
            return;
        }

        audioFile = file;

        // Try to get duration
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            formData.duration = Math.round(audio.duration);
        };
        audio.src = URL.createObjectURL(file);
    }

    async function uploadAudioFile() {
        if (!audioFile) return null;

        const uploadFormData = new FormData();
        uploadFormData.append('audio', audioFile);
        uploadFormData.append('type', 'songs');

        try {
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                body: uploadFormData
            });

            if (response.ok) {
                const result = await response.json();
                return result.filename;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading audio file:', error);
            throw error;
        }
    }

    async function handleSubmit() {
        if (isSubmitting) return;

        // Validate required fields
        if (!formData.title.trim()) {
            alert('Názov skladby je povinný');
            return;
        }


        isSubmitting = true;

        try {
            // Upload audio file if selected
            if (audioFile) {
                formData.filename = await uploadAudioFile();
            }

            // Clean up empty strings to null
            const cleanedData = { ...formData };
            if (!cleanedData.youtube_url || cleanedData.youtube_url.trim() === '') {
                cleanedData.youtube_url = null;
            }
            if (!cleanedData.spotify_url || cleanedData.spotify_url.trim() === '') {
                cleanedData.spotify_url = null;
            }
            if (!cleanedData.lyrics || cleanedData.lyrics.trim() === '') {
                cleanedData.lyrics = null;
            }
            if (!cleanedData.filename || cleanedData.filename.trim() === '') {
                cleanedData.filename = null;
            }

            const response = await fetch('/api/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
            });

            if (response.ok) {
                alert('Skladba bola úspešne vytvorená');
                goto(`/admin/albums/${albumId}/songs`);
            } else {
                const error = await response.json();
                console.error('API Error:', error);
                let errorMessage = 'Chyba pri vytváraní skladby: ';
                if (error.errors) {
                    errorMessage += Object.values(error.errors).flat().join(', ');
                } else {
                    errorMessage += error.error || error.message || 'Neznáma chyba';
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error creating song:', error);
            alert('Chyba pri vytváraní skladby');
        } finally {
            isSubmitting = false;
        }
    }

    function validateYouTubeUrl(url) {
        if (!url) return true;
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    }

    function validateSpotifyUrl(url) {
        if (!url) return true;
        const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[\w]+/;
        return spotifyRegex.test(url);
    }

    function formatDuration(seconds) {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
</script>

<svelte:head>
    <title>Pridať skladbu - {album?.title || 'Album'} - Admin</title>
</svelte:head>

<div class="admin-container">
    <header class="admin-header">
        <div class="header-info">
            <h1>
                <i class="fas fa-plus"></i>
                Pridať skladbu
            </h1>
            {#if album}
                <div class="album-info">
                    <span>do albumu:</span>
                    <strong>{album.title}</strong>
                </div>
            {/if}
        </div>
        <a href="/admin/albums/{albumId}/songs" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Späť na skladby
        </a>
    </header>

    {#if isLoadingAlbum}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam album...</p>
        </div>
    {:else}
        <form on:submit|preventDefault={handleSubmit} class="song-form">
            <div class="form-grid">
                <div class="form-section">
                    <h3>Základné informácie</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="title">Názov skladby *</label>
                            <input 
                                type="text" 
                                id="title" 
                                bind:value={formData.title}
                                required
                                placeholder="Zadajte názov skladby"
                            />
                        </div>

                        <div class="form-group">
                            <label for="track_number">Číslo skladby</label>
                            <input 
                                type="number" 
                                id="track_number" 
                                bind:value={formData.track_number}
                                min="1"
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="duration">Dĺžka (sekundy)</label>
                            <input 
                                type="number" 
                                id="duration" 
                                bind:value={formData.duration}
                                min="0"
                                placeholder="Automaticky z audio súboru"
                            />
                            {#if formData.duration}
                                <small>Formátovaná dĺžka: {formatDuration(formData.duration)}</small>
                            {/if}
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    bind:checked={formData.is_published}
                                />
                                <span class="checkmark"></span>
                                Publikovať skladbu
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Audio súbor</h3>
                    
                    <div class="audio-upload">
                        {#if audioFile}
                            <div class="audio-preview">
                                <i class="fas fa-file-audio"></i>
                                <span>{audioFile.name}</span>
                                <small>{(audioFile.size / 1024 / 1024).toFixed(2)} MB</small>
                            </div>
                        {:else}
                            <div class="audio-placeholder">
                                <i class="fas fa-file-audio"></i>
                                <p>Žiadny audio súbor</p>
                            </div>
                        {/if}

                        <div class="upload-controls">
                            <input 
                                type="file" 
                                accept="audio/*" 
                                on:change={handleAudioUpload}
                                id="audio-upload"
                                style="display: none;"
                            />
                            <label for="audio-upload" class="btn btn-outline">
                                <i class="fas fa-upload"></i>
                                {audioFile ? 'Zmeniť súbor' : 'Nahrať audio'}
                            </label>
                            <small>Podporované formáty: MP3, WAV, OGG (max. 50MB)</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Externé odkazy</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="youtube_url">YouTube URL</label>
                        <input 
                            type="url" 
                            id="youtube_url" 
                            bind:value={formData.youtube_url}
                            placeholder="https://www.youtube.com/watch?v=..."
                            class:invalid={formData.youtube_url && !validateYouTubeUrl(formData.youtube_url)}
                        />
                        {#if formData.youtube_url && !validateYouTubeUrl(formData.youtube_url)}
                            <small class="error">Neplatná YouTube URL</small>
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="spotify_url">Spotify URL</label>
                        <input 
                            type="url" 
                            id="spotify_url" 
                            bind:value={formData.spotify_url}
                            placeholder="https://open.spotify.com/track/..."
                            class:invalid={formData.spotify_url && !validateSpotifyUrl(formData.spotify_url)}
                        />
                        {#if formData.spotify_url && !validateSpotifyUrl(formData.spotify_url)}
                            <small class="error">Neplatná Spotify URL</small>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Text skladby</h3>
                
                <div class="form-group">
                    <label for="lyrics">Text (lyrics)</label>
                    <textarea 
                        id="lyrics" 
                        bind:value={formData.lyrics}
                        rows="10"
                        placeholder="Zadajte text skladby..."
                    ></textarea>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                    {#if isSubmitting}
                        <i class="fas fa-spinner fa-spin"></i>
                        Vytváram skladbu...
                    {:else}
                        <i class="fas fa-save"></i>
                        Vytvoriť skladbu
                    {/if}
                </button>
                <a href="/admin/albums/{albumId}/songs" class="btn btn-secondary">
                    <i class="fas fa-times"></i>
                    Zrušiť
                </a>
            </div>
        </form>
    {/if}
</div>

<style>
    .admin-container {
        max-width: 1000px;
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
        color: var(--text-color);
        font-size: 1rem;
    }

    .album-info strong {
        color: var(--secondary-color);
    }

    .loading {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-color);
    }

    .loading i {
        font-size: 3rem;
        color: var(--button-color);
        margin-bottom: 20px;
        display: block;
    }

    .song-form {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        margin-bottom: 30px;
    }

    .form-section {
        margin-bottom: 30px;
    }

    .form-section h3 {
        color: var(--secondary-color);
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: var(--text-color);
        font-weight: 500;
    }

    input, textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--border-color);
        border-radius: 6px;
        background: var(--input-bg);
        color: var(--text-color);
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: var(--button-color);
    }

    input.invalid {
        border-color: #ef4444;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        margin-top: 25px;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .audio-upload {
        text-align: center;
    }

    .audio-preview {
        background: var(--border-color);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .audio-preview i {
        font-size: 2rem;
        color: var(--button-color);
    }

    .audio-placeholder {
        width: 100%;
        height: 120px;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        color: var(--text-color);
    }

    .audio-placeholder i {
        font-size: 3rem;
        margin-bottom: 10px;
        color: var(--button-color);
    }

    .upload-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .upload-controls small {
        color: var(--text-color);
        opacity: 0.7;
    }

    small.error {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 5px;
        display: block;
    }

    .form-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }

    .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--button-color);
        color: white;
    }

    .btn-secondary {
        background: var(--secondary-color);
        color: white;
    }

    .btn-outline {
        background: transparent;
        color: var(--button-color);
        border: 2px solid var(--button-color);
    }

    .btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }

        .form-grid {
            grid-template-columns: 1fr;
            gap: 30px;
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .form-actions {
            flex-direction: column;
        }
    }
</style>
