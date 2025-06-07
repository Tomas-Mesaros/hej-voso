<script>
	import { onMount } from 'svelte';
	
	export let data;
	let selectedAlbum = null;
	let songs = [];
	let activeSong = null; // Pridáme premennú pre aktívnu skladbu
	
	onMount(() => {
		console.log('Data v +page.svelte:', data);
	});
	
	async function loadSongs(album) {
		try {
			console.log('Načítavam skladby pre album:', album);
			const res = await fetch(`/api/songs?album=${album}`);
			const songData = await res.json();
			console.log('Načítané skladby:', songData);
			songs = songData.songs;
		} catch (err) {
			console.error('Chyba pri načítaní skladieb:', err);
			songs = [];
		}
	};

	function handlePlay(event) {
		event.target.volume = 0.5;
		const allAudio = document.querySelectorAll('audio');
		allAudio.forEach((el) => {
			if (el !== event.target) {
				el.pause();
				el.currentTime = 0;
			};
		});
	};

	let showPlayer = false;
	let song = "";
	let songName = ""; // Pridáme premennú pre názov skladby

	function playSong(s, fullName) {
		song = s;
		songName = fullName; // Nastavíme názov skladby
		activeSong = fullName; // Nastavíme aktívnu skladbu
		showPlayer = true;
	}
	
</script>

<section>
	<h2>Albumy skladieb</h2>
    <div class="playerPanel flex-column">
        {#if showPlayer}
            <h4>{songName}</h4>
            <audio src={song} controls autoplay on:play={handlePlay}></audio>
        {/if}
    </div>
	<ul class="flex-column">
		{#if data && data.albums && data.albums.files}
			{#each data.albums.files as album}
				<li>
					<button
						class="album"
						on:click={() => {selectedAlbum = album; loadSongs(album);}}>
						{album}
					</button>
					{#if selectedAlbum === album}
						<ol class="flex-column">
							{#each songs as song}
								<li class="flex-column songList">
									<button
										class="song"
										class:active={activeSong === song.split('/').pop()}
										on:click={() => playSong(`/albums/${album}/${song}`, song.split('/').pop())}>
										{song.split('/').pop()}
									</button>
								</li>
							{/each}
						</ol>
					{/if}
				</li>
			{/each}
		{:else}
			<li>Žiadne albumy neboli nájdené</li>
		{/if}
	</ul>
</section>

<style>
    .playerPanel{
        margin-bottom: 30px;
        gap: 10px;
        h4{
            margin-left: 10px;
            font-size: var(--font-size-sm);
        }
    }
    ul{
        list-style: none;
        gap: 15px;
        .album{
            border-radius: 50px;
            padding: 3px 15px;
            background-color: var(--background-color);
            color: var(--text-color);
            box-shadow: 5px 5px 10px var(--primary-color);
            border: 2px solid var(--button-color);
            cursor: pointer;
            font-size: var(--font-size-me);
            transition: border 0.3s, color 0.3s, background-color 0.3s linear;
        }

        .album:hover,
        .album:active{
            background-color: var(--text-color);
            color: var(--background-color);
            border-color: var(--secondary-color);
        }
    }

    ol{
        gap: 10px;
        margin: 20px;

        li{
            gap: 10px;

        }
        .song{
            all: unset;
            display: block;
            border-bottom: 2px solid var(--button-color);
            transition: border 0.1s, color 0.1s linear;
            cursor: pointer;
            font-size: var(--font-size-sm);
            padding: 3px 5px;
            
        }

        .song:hover,
        .song:active{
            border-bottom: 2px solid var(--button-hover-color);
            color: var(--secondary-color);
        }
        
        /* Pridáme štýl pre aktívnu skladbu */
        .song.active {
            border-bottom: 2px solid var(--secondary-color);
            color: var(--secondary-color);
            font-weight: bold;
        }
    }
</style>
