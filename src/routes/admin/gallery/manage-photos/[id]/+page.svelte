<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let categoryId = $page.params.id;
    let category = null;
    let photos = [];
    let isLoading = true;
    let showDeleteModal = false;
    let photoToDelete = null;
    let editingPhoto = null;
    let showEditModal = false;

    onMount(async () => {
        await loadCategoryAndPhotos();
    });

    async function loadCategoryAndPhotos() {
        try {
            const response = await fetch(`/api/gallery-categories/${categoryId}`);
            if (response.ok) {
                category = await response.json();
                photos = category.photos || [];
            } else {
                alert('Kategória sa nenašla');
                goto('/admin/gallery');
            }
        } catch (error) {
            console.error('Error loading category:', error);
            alert('Chyba pri načítaní kategórie');
        } finally {
            isLoading = false;
        }
    }

    function confirmDelete(photo) {
        photoToDelete = photo;
        showDeleteModal = true;
    }

    function cancelDelete() {
        showDeleteModal = false;
        photoToDelete = null;
    }

    async function deletePhoto() {
        if (!photoToDelete) return;

        try {
            const response = await fetch(`/api/gallery-photos/${photoToDelete.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadCategoryAndPhotos();
                showDeleteModal = false;
                photoToDelete = null;
            } else {
                alert('Chyba pri mazaní fotografie');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            alert('Chyba pri mazaní fotografie');
        }
    }

    function editPhoto(photo) {
        editingPhoto = { ...photo };
        showEditModal = true;
    }

    function cancelEdit() {
        showEditModal = false;
        editingPhoto = null;
    }

    async function savePhotoEdit() {
        if (!editingPhoto) return;

        try {
            const response = await fetch(`/api/gallery-photos/${editingPhoto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editingPhoto.title,
                    description: editingPhoto.description,
                    alt_text: editingPhoto.alt_text,
                    sort_order: editingPhoto.sort_order
                })
            });

            if (response.ok) {
                await loadCategoryAndPhotos();
                showEditModal = false;
                editingPhoto = null;
            } else {
                alert('Chyba pri ukladaní zmien');
            }
        } catch (error) {
            console.error('Error updating photo:', error);
            alert('Chyba pri ukladaní zmien');
        }
    }
</script>

<svelte:head>
    <title>Správa fotiek - {category?.name || 'Kategória'} - Admin</title>
</svelte:head>

<main class="admin-container">
    <header class="admin-header">
        <div class="header-info">
            <h1>
                <i class="fas fa-images"></i>
                Správa fotiek
            </h1>
            {#if category}
                <div class="category-info">
                    <span>Kategória:</span>
                    <strong>{category.name}</strong>
                </div>
            {/if}
        </div>
        <div class="header-actions">
            <a href="/admin/gallery/add-photos/{categoryId}" class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Pridať fotky
            </a>
            <a href="/admin/gallery" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Späť na galériu
            </a>
        </div>
    </header>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam fotografie...</p>
        </div>
    {:else if photos.length === 0}
        <div class="empty-state">
            <i class="fas fa-image"></i>
            <h2>Žiadne fotografie</h2>
            <p>V tejto kategórii zatiaľ nie sú žiadne fotografie.</p>
            <a href="/admin/gallery/add-photos/{categoryId}" class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Pridať prvé fotky
            </a>
        </div>
    {:else}
        <div class="photos-grid">
            {#each photos as photo}
                <div class="photo-card">
                    <div class="photo-preview">
                        <img src="/uploads/gallery/{photo.filename}" alt={photo.alt_text || photo.title || 'Fotka'}>
                        <div class="photo-overlay">
                            <button class="action-btn edit-btn" on:click={() => editPhoto(photo)} title="Upraviť">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" on:click={() => confirmDelete(photo)} title="Vymazať">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="photo-info">
                        <h3 class="photo-title">{photo.title || 'Bez názvu'}</h3>
                        {#if photo.description}
                            <p class="photo-description">{photo.description}</p>
                        {/if}
                        <div class="photo-meta">
                            <span class="sort-order">Poradie: {photo.sort_order || 0}</span>
                            <span class="filename">{photo.filename}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Delete Modal -->
    {#if showDeleteModal && photoToDelete}
        <div class="modal-overlay" on:click={cancelDelete}>
            <div class="modal" on:click|stopPropagation>
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Vymazať fotografiu</h3>
                </div>
                <div class="modal-content">
                    <div class="photo-preview-small">
                        <img src="/uploads/gallery/{photoToDelete.filename}" alt="Náhľad">
                    </div>
                    <p>Naozaj chcete vymazať túto fotografiu?</p>
                    <p class="warning">Táto akcia sa nedá vrátiť späť!</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-danger" on:click={deletePhoto}>
                        <i class="fas fa-trash"></i>
                        Vymazať
                    </button>
                    <button class="btn btn-secondary" on:click={cancelDelete}>
                        Zrušiť
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Edit Modal -->
    {#if showEditModal && editingPhoto}
        <div class="modal-overlay" on:click={cancelEdit}>
            <div class="modal edit-modal" on:click|stopPropagation>
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Upraviť fotografiu</h3>
                </div>
                <div class="modal-content">
                    <div class="photo-preview-small">
                        <img src="/uploads/gallery/{editingPhoto.filename}" alt="Náhľad">
                    </div>
                    
                    <form class="edit-form" on:submit|preventDefault={savePhotoEdit}>
                        <div class="form-group">
                            <label for="title">Názov</label>
                            <input type="text" id="title" bind:value={editingPhoto.title} placeholder="Názov fotografie">
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Popis</label>
                            <textarea id="description" bind:value={editingPhoto.description} rows="3" placeholder="Popis fotografie"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="alt_text">Alt text</label>
                            <input type="text" id="alt_text" bind:value={editingPhoto.alt_text} placeholder="Alternatívny text pre čítačky obrazovky">
                        </div>
                        
                        <div class="form-group">
                            <label for="sort_order">Poradie</label>
                            <input type="number" id="sort_order" bind:value={editingPhoto.sort_order} min="0">
                        </div>
                    </form>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" on:click={savePhotoEdit}>
                        <i class="fas fa-save"></i>
                        Uložiť
                    </button>
                    <button class="btn btn-secondary" on:click={cancelEdit}>
                        Zrušiť
                    </button>
                </div>
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
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        gap: 2rem;
    }

    .header-info h1 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .category-info {
        color: #7f8c8d;
        font-size: 1rem;
    }

    .category-info strong {
        color: #2c3e50;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
    }

    .loading, .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
    }

    .empty-state i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }

    .photo-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .photo-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .photo-preview {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
    }

    .photo-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .photo-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .photo-preview:hover .photo-overlay {
        opacity: 1;
    }

    .action-btn {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: transform 0.2s;
    }

    .action-btn:hover {
        transform: scale(1.1);
    }

    .edit-btn {
        background: #3498db;
        color: white;
    }

    .delete-btn {
        background: #e74c3c;
        color: white;
    }

    .photo-info {
        padding: 1.5rem;
    }

    .photo-title {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .photo-description {
        margin: 0 0 1rem 0;
        color: #7f8c8d;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .photo-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #95a5a6;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
    }

    .btn-primary {
        background: #3498db;
        color: white;
    }

    .btn-secondary {
        background: #95a5a6;
        color: white;
    }

    .btn-danger {
        background: #e74c3c;
        color: white;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .edit-modal {
        max-width: 600px;
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #ecf0f1;
    }

    .modal-header h3 {
        margin: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .modal-content {
        padding: 1.5rem;
    }

    .photo-preview-small {
        width: 150px;
        height: 100px;
        margin: 0 auto 1rem;
        border-radius: 8px;
        overflow: hidden;
    }

    .photo-preview-small img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .warning {
        color: #e74c3c;
        font-weight: 500;
        margin-top: 1rem;
    }

    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-weight: 500;
        color: #2c3e50;
    }

    .form-group input,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
    }

    .modal-actions {
        padding: 1rem 1.5rem;
        border-top: 1px solid #ecf0f1;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            align-items: stretch;
        }

        .photos-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        }

        .modal {
            margin: 1rem;
            width: calc(100% - 2rem);
        }
    }
</style>