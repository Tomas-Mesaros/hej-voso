<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let albums = [];
    let isLoading = true;

    onMount(async () => {
        await loadAlbums();
    });

    async function loadAlbums() {
        try {
            const response = await fetch('/api/albums');
            if (response.ok) {
                albums = await response.json();
            } else {
                console.error('Failed to load albums');
            }
        } catch (error) {
            console.error('Error loading albums:', error);
        } finally {
            isLoading = false;
        }
    }

    async function deleteAlbum(id, title) {
        if (!confirm(`Naozaj chcete vymazať album "${title}"? Táto akcia je nevratná a vymaže aj všetky skladby v albume.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/albums/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadAlbums();
                alert('Album bol úspešne vymazaný');
            } else {
                alert('Chyba pri mazaní albumu');
            }
        } catch (error) {
            console.error('Error deleting album:', error);
            alert('Chyba pri mazaní albumu');
        }
    }

    async function togglePublished(album) {
        try {
            const response = await fetch(`/api/albums/${album.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...album,
                    is_published: !album.is_published
                })
            });

            if (response.ok) {
                await loadAlbums();
            } else {
                alert('Chyba pri zmene stavu albumu');
            }
        } catch (error) {
            console.error('Error toggling album status:', error);
            alert('Chyba pri zmene stavu albumu');
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'Neurčený';
        return new Date(dateString).toLocaleDateString('sk-SK');
    }
</script>

<svelte:head>
    <title>Správa albumov - Admin</title>
</svelte:head>

<div class="admin-container">
    <header class="admin-header">
        <h1>
            <i class="fas fa-compact-disc"></i>
            Správa albumov
        </h1>
        <div class="header-actions">
            <button class="btn btn-primary" on:click={() => goto('/admin/albums/add')}>
                <i class="fas fa-plus"></i>
                Pridať album
            </button>
            <a href="/admin" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Späť do admin panelu
            </a>
        </div>
    </header>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam albumy...</p>
        </div>
    {:else if albums.length === 0}
        <div class="no-data">
            <i class="fas fa-compact-disc"></i>
            <h2>Žiadne albumy</h2>
            <p>Zatiaľ neboli pridané žiadne albumy.</p>
            <button class="btn btn-primary" on:click={() => goto('/admin/albums/add')}>
                <i class="fas fa-plus"></i>
                Pridať prvý album
            </button>
        </div>
    {:else}
        <div class="albums-grid">
            {#each albums as album}
                <div class="album-card">
                    <div class="album-cover">
                        {#if album.coverImage}
                            <img src="/uploads/albums/{album.coverImage}" alt="{album.title}" />
                        {:else}
                            <img src="/img/default-album.svg" alt="Predvolený obrázok albumu" class="default-album-image" />
                        {/if}
                        <div class="album-status">
                            <button 
                                class="status-toggle {album.is_published ? 'published' : 'unpublished'}"
                                on:click={() => togglePublished(album)}
                                title="{album.is_published ? 'Publikovaný' : 'Nepublikovaný'}"
                            >
                                <i class="fas {album.is_published ? 'fa-eye' : 'fa-eye-slash'}"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="album-info">
                        <h3>{album.title}</h3>
                        <div class="album-meta">
                            <span class="release-date">
                                <i class="fas fa-calendar"></i>
                                {formatDate(album.release_date)}
                            </span>
                            {#if album.genre}
                                <span class="genre">
                                    <i class="fas fa-music"></i>
                                    {album.genre}
                                </span>
                            {/if}
                            <span class="songs-count">
                                <i class="fas fa-list"></i>
                                {album.songs?.length || 0} skladieb
                            </span>
                        </div>
                        {#if album.description}
                            <p class="album-description">{album.description}</p>
                        {/if}
                    </div>

                    <div class="album-actions">
                        <button class="btn btn-sm btn-primary" on:click={() => goto(`/admin/albums/edit/${album.id}`)}>
                            <i class="fas fa-edit"></i>
                            Upraviť
                        </button>
                        <button class="btn btn-sm btn-info" on:click={() => goto(`/admin/albums/${album.id}/songs`)}>
                            <i class="fas fa-music"></i>
                            Skladby ({album.songs?.length || 0})
                        </button>
                        <button class="btn btn-sm btn-danger" on:click={() => deleteAlbum(album.id, album.title)}>
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
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--secondary-color);
    }

    .admin-header h1 {
        color: var(--secondary-color);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header-actions {
        display: flex;
        gap: 10px;
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

    .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 25px;
    }

    .album-card {
        background: var(--card-bg);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .album-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .album-cover {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
    }

    .album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .default-album-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .album-status {
        position: absolute;
        top: 10px;
        right: 10px;
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

    .album-info {
        padding: 20px;
    }

    .album-info h3 {
        color: var(--secondary-color);
        margin: 0 0 15px 0;
        font-size: 1.3rem;
    }

    .album-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: var(--text-color);
    }

    .album-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .album-meta i {
        color: var(--button-color);
    }

    .album-description {
        color: var(--text-color);
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .album-actions {
        padding: 15px 20px;
        background: rgba(0,0,0,0.02);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
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
</style>
