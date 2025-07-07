<script>
    import { onMount } from 'svelte';
	import lightGallery from 'lightgallery';
	import lgThumbnail from 'lightgallery/plugins/thumbnail';
	import lgZoom from 'lightgallery/plugins/zoom';

	import 'lightgallery/css/lightgallery.css';
	import 'lightgallery/css/lg-thumbnail.css';
	import 'lightgallery/css/lg-zoom.css';

	let galleryElements = {};
	let galleryData = [];
	let totalImages = 0;
	let isLoading = true;

	onMount(async () => {
		await loadGalleryData();
		initializeLightGallery();
	});

	async function loadGalleryData() {
		try {
			const response = await fetch('/api/gallery/categories');

			if (!response.ok) {
				console.error('Failed to fetch gallery categories, status:', response.status);
				return;
			}

			const categories = await response.json();


			// Transformuj databázové dáta na formát očakávaný frontend komponentom
			const processedGalleryData = [];
			let processedTotalImages = 0;

			categories.forEach(category => {
				if (category.photos && category.photos.length > 0) {
					// Extrahuj rok z event_date alebo použij aktuálny rok
					let year = new Date().getFullYear();
					if (category.event_date) {
						const yearMatch = category.event_date.match(/(\d{4})/);
						if (yearMatch) {
							year = parseInt(yearMatch[1]);
						}
					}

					// Nájdi existujúcu skupinu pre tento rok alebo vytvor novú
					let yearGroup = processedGalleryData.find(g => g.year === year);
					if (!yearGroup) {
						yearGroup = {
							year: year,
							sections: {}
						};
						processedGalleryData.push(yearGroup);
					}

					// Pridaj sekciu pre túto kategóriu
					yearGroup.sections[category.name] = {
						type: category.name,
						location: category.description || 'Galéria',
						images: category.photos.map(photo => ({
							src: `/uploads/gallery/${photo.filename}`,
							filename: photo.filename,
							year: year,
							type: category.name,
							location: category.description || 'Galéria',
							alt: photo.altText || photo.title || `Fotka z ${category.name}`
						}))
					};

					processedTotalImages += category.photos.length;
				}
			});

			// Zoraď podľa roku (najnovšie prvé)
			processedGalleryData.sort((a, b) => {
				if (typeof a.year === 'number' && typeof b.year === 'number') {
					return b.year - a.year;
				}
				if (typeof a.year === 'number') return -1;
				if (typeof b.year === 'number') return 1;
				return a.year.toString().localeCompare(b.year.toString());
			});



			galleryData = processedGalleryData;
			totalImages = processedTotalImages;

		} catch (error) {
			console.error('Chyba pri načítaní galérie:', error);
		} finally {
			isLoading = false;
		}
	}

	function initializeLightGallery() {
		// Počkaj na renderovanie komponentov
		setTimeout(() => {
			Object.keys(galleryElements).forEach(key => {
				if (galleryElements[key]) {
					lightGallery(galleryElements[key], {
						plugins: [lgThumbnail, lgZoom],
						speed: 500,
						selector: '.gallery-item'
					});
				}
			});
		}, 100);
	}

	function getSectionId(year, type) {
		return `gallery-${year}-${type.replace(/\s+/g, '-').toLowerCase()}`;
	}

	// Reinicializuj lightGallery keď sa dáta zmenia
	$: if (galleryData.length > 0) {
		setTimeout(() => initializeLightGallery(), 100);
	}
</script>

<svelte:head>
    <title>Galéria - Hej-Voso</title>
    <meta name="description" content="Fotogaléria kapely Hej-Voso - koncerty, vystúpenia a zákulisie" />
</svelte:head>

<main class="gallery-container">
    <header class="gallery-header">
        <h1>
            <i class="fas fa-images"></i>
            Fotogaléria
        </h1>
        <p class="gallery-subtitle">
            Zachytené momenty z našich koncertov a vystúpení
        </p>
        <div class="gallery-stats">
            <span class="stat">
                <i class="fas fa-camera"></i>
                {totalImages} fotiek
            </span>
            <span class="stat">
                <i class="fas fa-calendar"></i>
                {galleryData.length} období
            </span>
        </div>
    </header>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <h2>Načítavam galériu...</h2>
            <p>Prosím počkajte, kým sa načítajú fotografie.</p>
        </div>
    {:else if galleryData.length === 0}
        <div class="no-images">
            <i class="fas fa-image"></i>
            <h2>Zatiaľ nie sú pridané žiadne fotky</h2>
            <p>Pracujeme na pridaní fotografií z našich vystúpení.</p>
        </div>
    {:else}
        <div class="gallery-timeline">
            {#each galleryData as yearGroup, yearIndex}
                <div class="year-section">
                    <div class="year-header">
                        <div class="year-badge">
                            <i class="fas fa-calendar-alt"></i>
                            <span class="year-text">{yearGroup.year}</span>
                        </div>
                        <div class="year-line"></div>
                    </div>

                    <div class="sections-container">
                        {#each Object.values(yearGroup.sections) as section, sectionIndex}
                            <div class="section-card">
                                <div class="section-header">
                                    <h3 class="section-title">
                                        <i class="fas fa-music"></i>
                                        {section.type}
                                    </h3>
                                    <p class="section-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        {section.location}
                                    </p>
                                    <div class="section-count">
                                        {section.images.length} {section.images.length === 1 ? 'fotka' : section.images.length < 5 ? 'fotky' : 'fotiek'}
                                    </div>
                                </div>

                                <div
                                    class="gallery-grid"
                                    bind:this={galleryElements[getSectionId(yearGroup.year, section.type)]}
                                >
                                    {#each section.images as img}
                                        <a href={img.src} class="gallery-item">
                                            <div class="image-container">
                                                <img
                                                    src={img.src}
                                                    alt={img.alt}
                                                    loading="lazy"
                                                />
                                                <div class="image-overlay">
                                                    <i class="fas fa-search-plus"></i>
                                                </div>
                                            </div>
                                        </a>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    .gallery-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .gallery-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .gallery-header h1 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        color: var(--secondary-color);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    .gallery-subtitle {
        font-size: clamp(1.1rem, 2.5vw, 1.4rem);
        color: var(--text-color);
        opacity: 0.8;
        margin-bottom: 25px;
        font-style: italic;
    }

    .gallery-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
    }

    .stat {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--button-hover-color);
        font-weight: 500;
        font-size: 1.1rem;
    }

    .stat i {
        color: var(--secondary-color);
    }

    .loading,
    .no-images {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-color);
    }

    .loading i,
    .no-images i {
        font-size: 4rem;
        color: var(--button-color);
        margin-bottom: 20px;
        display: block;
    }

    .loading i.fa-spin {
        animation: spin 1s linear infinite;
    }

    .loading h2,
    .no-images h2 {
        color: var(--secondary-color);
        margin-bottom: 15px;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .gallery-timeline {
        position: relative;
    }

    .year-section {
        margin-bottom: 80px;
        position: relative;
    }

    .year-header {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        position: relative;
    }

    .year-badge {
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        color: white;
        padding: 15px 25px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        font-size: 1.3rem;
        box-shadow: 0 5px 20px rgba(138, 3, 3, 0.3);
        z-index: 2;
        position: relative;
    }

    .year-text {
        font-size: 1.4rem;
    }

    .year-line {
        flex: 1;
        height: 3px;
        background: linear-gradient(90deg, var(--secondary-color), transparent);
        margin-left: 20px;
        border-radius: 2px;
    }

    .sections-container {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .section-card {
        background: rgba(255, 255, 255, 0.03);
        border: 2px solid var(--button-color);
        border-radius: 20px;
        padding: 30px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .section-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--secondary-color), var(--button-hover-color));
    }

    .section-card:hover {
        border-color: var(--secondary-color);
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }

    .section-header {
        margin-bottom: 25px;
        text-align: center;
    }

    .section-title {
        color: var(--secondary-color);
        font-size: 1.8rem;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .section-location {
        color: var(--text-color);
        opacity: 0.8;
        font-size: 1.1rem;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .section-count {
        color: var(--button-hover-color);
        font-weight: 500;
        font-size: 0.95rem;
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .gallery-item {
        display: block;
        text-decoration: none;
        border-radius: 15px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .image-container {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(138, 3, 3, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .image-overlay i {
        color: white;
        font-size: 2rem;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .gallery-item:hover .image-container img {
        transform: scale(1.1);
    }

    .gallery-item:hover .image-overlay {
        opacity: 1;
    }

    .gallery-item:hover .image-overlay i {
        transform: scale(1);
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .gallery-container {
            padding: 20px 15px;
        }

        .gallery-header {
            margin-bottom: 40px;
        }

        .gallery-stats {
            gap: 20px;
        }

        .year-section {
            margin-bottom: 50px;
        }

        .year-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }

        .year-line {
            width: 100%;
            margin-left: 0;
        }

        .section-card {
            padding: 20px;
        }

        .sections-container {
            gap: 30px;
        }

        .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .section-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 8px;
        }
    }

    @media (max-width: 480px) {
        .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }

        .year-badge {
            padding: 12px 20px;
            font-size: 1.1rem;
        }

        .year-text {
            font-size: 1.2rem;
        }

        .section-title {
            font-size: 1.3rem;
        }
    }
</style>