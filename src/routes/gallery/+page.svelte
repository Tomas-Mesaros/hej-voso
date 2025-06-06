<script>
    import { onMount } from 'svelte';
	import lightGallery from 'lightgallery';
	import lgThumbnail from 'lightgallery/plugins/thumbnail';
	import lgZoom from 'lightgallery/plugins/zoom';

	import 'lightgallery/css/lightgallery.css';
	import 'lightgallery/css/lg-thumbnail.css';
	import 'lightgallery/css/lg-zoom.css';

	export let data;
	let galleryEl;

	onMount(() => {
		lightGallery(galleryEl, {
			plugins: [lgThumbnail, lgZoom],
			speed: 500
		});
	});
</script>

<section>
    <div bind:this={galleryEl} class="gallery-grid">
        {#each data.images as img}
            <a href={img}>
                <img src={img} alt="Galéria obrázok" />
            </a>
        {/each}
    </div>
</section>

<style>
    .gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 10px;
	}
	img {
		width: 100%;
		border-radius: 6px;
		cursor: pointer;
	}

</style>