<script>
    import { onMount, onDestroy } from 'svelte';

    export let song;
    export let mini = false;

    let audio;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let volume = 0.5; // Nastavené na 50% ako požadované
    let isMuted = false;
    let isLoading = false;

    let previousSong = null;
    
    onMount(() => {
        if (audio) {
            audio.volume = volume;
        }
    });
    
    $: if (song && song !== previousSong) {
        previousSong = song;
        if (song.filename) {
            // Počkaj kým sa audio element načíta
            setTimeout(() => {
                if (audio) {
                    audio.load(); // Znovu načítaj audio
                    audio.addEventListener('canplay', () => {
                        audio.play().catch(error => {
                            console.error('Chyba pri automatickom prehrávaní:', error);
                        });
                    }, { once: true });
                }
            }, 50);
        }
    }

    onDestroy(() => {
        if (audio) {
            audio.pause();
        }
    });

    function togglePlay() {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            isLoading = true;
            audio.play().catch(error => {
                console.error('Chyba pri prehrávaní:', error);
                isLoading = false;
            });
        }
    }

    function handleTimeUpdate() {
        if (audio) {
            currentTime = audio.currentTime;
        }
    }

    function handleLoadedMetadata() {
        if (audio) {
            duration = audio.duration;
        }
        isLoading = false;
    }

    function handlePlay() {
        isPlaying = true;
        isLoading = false;
    }

    function handlePause() {
        isPlaying = false;
        isLoading = false;
    }

    function handleEnded() {
        isPlaying = false;
        currentTime = 0;
    }

    function handleCanPlay() {
        isLoading = false;
    }

    function handleWaiting() {
        isLoading = true;
    }

    function seekTo(event) {
        if (!audio || !duration) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * duration;
        
        audio.currentTime = newTime;
        currentTime = newTime;
    }

    function changeVolume(event) {
        volume = parseFloat(event.target.value);
        if (audio) {
            audio.volume = volume;
            isMuted = volume === 0;
        }
    }

    function toggleMute() {
        if (audio) {
            if (isMuted) {
                audio.volume = volume;
                isMuted = false;
            } else {
                audio.volume = 0;
                isMuted = true;
            }
        }
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    $: progressPercentage = duration ? (currentTime / duration) * 100 : 0;
</script>

{#if song}
    <div class="audio-player" class:mini>
        <div class="player-header">
            <div class="song-info">
                <h3 class="song-title">
                    <i class="fas fa-music"></i>
                    {song.title}
                </h3>
                {#if song.album}
                    <p class="album-name">z albumu: {song.album.title}</p>
                {/if}
            </div>
            
            <div class="player-status">
                {#if isLoading}
                    <span class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i>
                        Načítavam...
                    </span>
                {:else if isPlaying}
                    <span class="playing-indicator">
                        <i class="fas fa-play"></i>
                        Prehráva sa
                    </span>
                {:else}
                    <span class="paused-indicator">
                        <i class="fas fa-pause"></i>
                        Pozastavené
                    </span>
                {/if}
            </div>
        </div>

        {#if song.filename}
            <audio
                bind:this={audio}
                src="/uploads/audio/{song.filename}"
                on:timeupdate={handleTimeUpdate}
                on:loadedmetadata={handleLoadedMetadata}
                on:play={handlePlay}
                on:pause={handlePause}
                on:ended={handleEnded}
                on:canplay={handleCanPlay}
                on:waiting={handleWaiting}
                preload="metadata"
            ></audio>
        {/if}

        <div class="player-controls">
            <button 
                class="play-pause-btn" 
                on:click={togglePlay} 
                disabled={!song.filename || isLoading}
                title={isPlaying ? 'Pozastaviť' : 'Prehrať'}
            >
                {#if isLoading}
                    <i class="fas fa-spinner fa-spin"></i>
                {:else if isPlaying}
                    <i class="fas fa-pause"></i>
                {:else}
                    <i class="fas fa-play"></i>
                {/if}
            </button>

            <div class="time-display">
                <span class="current-time">{formatTime(currentTime)}</span>
            </div>

            <div class="progress-container" on:click={seekTo} role="button" tabindex="0">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {progressPercentage}%"></div>
                    <div class="progress-handle" style="left: {progressPercentage}%"></div>
                </div>
            </div>

            <div class="time-display">
                <span class="total-time">{formatTime(duration || song.duration)}</span>
            </div>

            <div class="volume-controls">
                <button class="mute-btn" on:click={toggleMute} title={isMuted ? 'Zapnúť zvuk' : 'Stlmiť'}>
                    <i class="fas {isMuted ? 'fa-volume-mute' : volume > 0.5 ? 'fa-volume-up' : 'fa-volume-down'}"></i>
                </button>
                
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    bind:value={volume}
                    on:input={changeVolume}
                    class="volume-slider"
                    title="Hlasitosť: {Math.round(volume * 100)}%"
                />
                
                <span class="volume-display">{Math.round(volume * 100)}%</span>
            </div>
        </div>

        {#if !song.filename}
            <div class="no-audio">
                <i class="fas fa-exclamation-triangle"></i>
                Audio súbor nie je dostupný
            </div>
        {/if}
    </div>
{/if}

<style>
    .audio-player {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border-radius: 15px;
        padding: 25px;
        border: 2px solid var(--secondary-color);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    .audio-player.mini {
        padding: 15px;
        border-radius: 10px;
        border: 1px solid var(--secondary-color);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.8);
    }

    .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .audio-player.mini .player-header {
        margin-bottom: 10px;
        gap: 10px;
    }

    .song-info {
        flex: 1;
    }

    .song-title {
        color: var(--secondary-color);
        font-size: var(--font-size-me);
        margin: 0 0 5px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .audio-player.mini .song-title {
        font-size: 0.9rem;
        gap: 5px;
    }

    .album-name {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        opacity: 0.8;
        margin: 0;
        font-style: italic;
    }

    .player-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: var(--font-size-sm);
        font-weight: 600;
    }

    .loading-indicator {
        color: var(--button-hover-color);
    }

    .playing-indicator {
        color: #28a745;
    }

    .paused-indicator {
        color: var(--text-color);
        opacity: 0.7;
    }

    .player-controls {
        display: flex;
        align-items: center;
        gap: 15px;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 15px 20px;
        border-radius: 25px;
    }
    
    .audio-player.mini .player-controls {
        gap: 8px;
        padding: 8px 12px;
        border-radius: 15px;
    }
    
    .audio-player.mini .progress-container {
        flex: 1;
        min-width: 100px;
    }
    
    .audio-player.mini .volume-controls {
        display: none;
    }

    .play-pause-btn {
        background-color: var(--secondary-color);
        color: var(--background-color);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .audio-player.mini .play-pause-btn {
        width: 35px;
        height: 35px;
        font-size: 14px;
    }

    .play-pause-btn:hover:not(:disabled) {
        background-color: var(--button-hover-color);
        transform: scale(1.05);
    }

    .play-pause-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .time-display {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        font-weight: 600;
        min-width: 45px;
        text-align: center;
    }

    .progress-container {
        flex: 1;
        cursor: pointer;
        padding: 10px 0;
    }

    .progress-bar {
        position: relative;
        height: 6px;
        background-color: var(--button-color);
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--secondary-color), var(--button-hover-color));
        border-radius: 3px;
        transition: width 0.1s ease;
    }

    .progress-handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background-color: var(--secondary-color);
        border-radius: 50%;
        border: 2px solid var(--background-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: left 0.1s ease;
    }

    .volume-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    .mute-btn {
        background-color: var(--button-color);
        color: var(--text-color);
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mute-btn:hover {
        background-color: var(--button-hover-color);
    }

    .volume-slider {
        width: 80px;
        height: 4px;
        background-color: var(--button-color);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background-color: var(--secondary-color);
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--background-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .volume-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background-color: var(--secondary-color);
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--background-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .volume-display {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        font-weight: 600;
        min-width: 40px;
        text-align: center;
    }

    .no-audio {
        text-align: center;
        padding: 20px;
        color: var(--button-hover-color);
        font-style: italic;
        background-color: rgba(220, 53, 69, 0.1);
        border-radius: 10px;
        border: 1px solid rgba(220, 53, 69, 0.3);
    }

    .no-audio i {
        margin-right: 8px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .audio-player {
            padding: 20px;
        }

        .player-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
        }

        .player-controls {
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .progress-container {
            order: -1;
            width: 100%;
        }

        .volume-controls {
            gap: 8px;
        }

        .volume-slider {
            width: 60px;
        }
    }

    @media (max-width: 480px) {
        .song-title {
            font-size: var(--font-size-sm);
        }

        .play-pause-btn {
            width: 45px;
            height: 45px;
            font-size: 16px;
        }

        .time-display {
            font-size: 0.9rem;
            min-width: 40px;
        }

        .volume-display {
            display: none;
        }

        .volume-slider {
            width: 50px;
        }
    }
</style>
