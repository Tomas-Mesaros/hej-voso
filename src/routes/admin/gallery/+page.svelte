<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let categories = [];
    let isLoading = true;
    let showDeleteModal = false;
    let categoryToDelete = null;

    onMount(async () => {
        await loadCategories();
    });

    async function loadCategories() {
        try {
            const response = await fetch('/api/gallery-categories/all');
            if (response.ok) {
                categories = await response.json();

            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Chyba pri načítaní kategórií:', error);
        } finally {
            isLoading = false;
        }
    }

    function addCategory() {
        goto('/admin/gallery/add-category');
    }

    function editCategory(categoryId) {
        goto(`/admin/gallery/edit-category/${categoryId}`);
    }

    function addPhotos(categoryId) {
        goto(`/admin/gallery/add-photos/${categoryId}`);
    }

    function confirmDelete(category) {
        categoryToDelete = category;
        showDeleteModal = true;
    }

    function cancelDelete() {
        showDeleteModal = false;
        categoryToDelete = null;
    }

    async function deleteCategory() {
        if (!categoryToDelete) return;

        try {
            const response = await fetch(`/api/gallery-categories/${categoryToDelete.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadCategories();
                showDeleteModal = false;
                categoryToDelete = null;
            } else {
                alert('Chyba pri mazaní kategórie');
            }
        } catch (error) {
            console.error('Chyba pri mazaní kategórie:', error);
            alert('Chyba pri mazaní kategórie');
        }
    }

    async function deletePhoto(photoId, categoryId) {
        if (!confirm('Naozaj chcete vymazať túto fotografiu?')) return;

        try {
            const response = await fetch(`/api/gallery-photos/${photoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadCategories();
            } else {
                alert('Chyba pri mazaní fotografie');
            }
        } catch (error) {
            console.error('Chyba pri mazaní fotografie:', error);
            alert('Chyba pri mazaní fotografie');
        }
    }
</script>

<svelte:head>
    <title>Správa galérie - Admin</title>
</svelte:head>

<main class="admin-container">
    <div class="admin-header">
        <div class="header-content">
            <h1><i class="fas fa-images"></i> Správa galérie</h1>
            <p>Organizujte fotografie do kategórií a sekcií</p>
        </div>
        <div class="header-actions">
            <button class="btn btn-primary" on:click={addCategory}>
                <i class="fas fa-plus"></i>
                Pridať kategóriu
            </button>
        </div>
    </div>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam kategórie...</p>
        </div>
    {:else if categories.length === 0}
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-images"></i>
            </div>
            <h2>Žiadne kategórie</h2>
            <p>Zatiaľ nie sú vytvorené žiadne kategórie galérie.</p>
            <button class="btn btn-primary" on:click={addCategory}>
                <i class="fas fa-plus"></i>
                Vytvoriť prvú kategóriu
            </button>
        </div>
    {:else}
        <div class="categories-grid">
            {#each categories as category}
                <div class="category-card" class:inactive={!category.is_active}>
                    <div class="category-header">
                        <div class="category-info">
                            <h3 class="category-name">{category.name}</h3>
                            {#if category.event_date}
                                <span class="category-date">
                                    <i class="fas fa-calendar"></i>
                                    {category.event_date}
                                </span>
                            {/if}
                            {#if category.description}
                                <p class="category-description">{category.description}</p>
                            {/if}
                        </div>
                        <div class="category-status">
                            <span class="status-badge" class:active={category.is_active} class:inactive={!category.is_active}>
                                {category.is_active ? 'Aktívna' : 'Neaktívna'}
                            </span>
                        </div>
                    </div>

                    <div class="photos-preview">
                        {#if category.photos && category.photos.length > 0}
                            <div class="photos-grid">
                                {#each category.photos.slice(0, 4) as photo}
                                    <div class="photo-thumbnail">
                                        <img src="/uploads/gallery/{photo.filename}" alt={photo.alt_text || photo.title || 'Fotka'}>
                                        <button class="delete-photo-btn" on:click={() => deletePhoto(photo.id, category.id)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                {/each}
                                {#if category.photos.length > 4}
                                    <div class="more-photos">
                                        +{category.photos.length - 4}
                                    </div>
                                {/if}
                            </div>
                            <div class="photos-count">
                                <i class="fas fa-image"></i>
                                {category.photos.length} {category.photos.length === 1 ? 'fotka' : category.photos.length < 5 ? 'fotky' : 'fotiek'}
                            </div>
                        {:else}
                            <div class="no-photos">
                                <i class="fas fa-image"></i>
                                <p>Žiadne fotografie</p>
                            </div>
                        {/if}
                    </div>

                    <div class="category-actions">
                        <button class="btn-action primary" on:click={() => addPhotos(category.id)}>
                            <i class="fas fa-plus"></i>
                            Pridať fotky
                        </button>
                        <button class="btn-action secondary" on:click={() => editCategory(category.id)}>
                            <i class="fas fa-edit"></i>
                            Upraviť
                        </button>
                        <button class="btn-action danger" on:click={() => confirmDelete(category)}>
                            <i class="fas fa-trash"></i>
                            Vymazať
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Delete confirmation modal -->
    {#if showDeleteModal && categoryToDelete}
        <div class="modal-overlay" on:click={cancelDelete}>
            <div class="modal" on:click|stopPropagation>
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Potvrdiť vymazanie</h3>
                </div>
                <div class="modal-content">
                    <p>Naozaj chcete vymazať kategóriu <strong>"{categoryToDelete.name}"</strong>?</p>
                    <p class="warning">Táto akcia vymaže aj všetky fotografie v tejto kategórii a nedá sa vrátiť späť!</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-danger" on:click={deleteCategory}>
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

    .header-content h1 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
    }

    .header-content p {
        color: #7f8c8d;
        margin: 0;
    }

    .loading, .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
    }

    .category-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .category-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .category-card.inactive {
        opacity: 0.7;
    }

    .category-header {
        padding: 1.5rem;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .category-name {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.25rem;
    }

    .category-date {
        color: #7f8c8d;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .category-description {
        margin: 0.5rem 0 0 0;
        color: #7f8c8d;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .status-badge.active {
        background: #d4edda;
        color: #155724;
    }

    .status-badge.inactive {
        background: #f8d7da;
        color: #721c24;
    }

    .photos-preview {
        padding: 1.5rem;
    }

    .photos-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .photo-thumbnail {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
    }

    .photo-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .delete-photo-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(220, 53, 69, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .photo-thumbnail:hover .delete-photo-btn {
        opacity: 1;
    }

    .more-photos {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        color: #6c757d;
        font-weight: 500;
        border-radius: 8px;
    }

    .photos-count {
        color: #7f8c8d;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .no-photos {
        text-align: center;
        padding: 2rem;
        color: #bdc3c7;
    }

    .no-photos i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .category-actions {
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        display: flex;
        gap: 0.5rem;
    }

    .btn-action {
        flex: 1;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .btn-action.primary {
        background: #3498db;
        color: white;
    }

    .btn-action.primary:hover {
        background: #2980b9;
    }

    .btn-action.secondary {
        background: #95a5a6;
        color: white;
    }

    .btn-action.secondary:hover {
        background: #7f8c8d;
    }

    .btn-action.danger {
        background: #e74c3c;
        color: white;
    }

    .btn-action.danger:hover {
        background: #c0392b;
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

    .btn-primary:hover {
        background: #2980b9;
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

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #ecf0f1;
    }

    .modal-header h3 {
        margin: 0;
        color: #e74c3c;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .modal-content {
        padding: 1.5rem;
    }

    .warning {
        color: #e74c3c;
        font-weight: 500;
        margin-top: 1rem;
    }

    .modal-actions {
        padding: 1rem 1.5rem;
        border-top: 1px solid #ecf0f1;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
</style>
