<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let albumId = $page.params.id;
    let formData = {
        title: '',
        description: '',
        cover_image: '',
        release_date: '',
        genre: '',
        is_published: true,
        sort_order: 0
    };

    let isLoading = true;
    let isSubmitting = false;
    let coverImageFile = null;
    let coverImagePreview = null;
    let originalCoverImage = '';

    onMount(async () => {
        await loadAlbum();
    });

    async function loadAlbum() {
        try {
            const response = await fetch(`/api/albums/${albumId}`);
            if (response.ok) {
                const album = await response.json();
                formData = {
                    title: album.title || '',
                    description: album.description || '',
                    cover_image: album.cover_image || '',
                    release_date: album.release_date || '',
                    genre: album.genre || '',
                    is_published: album.is_published,
                    sort_order: album.sort_order || 0
                };
                originalCoverImage = album.cover_image || '';
                if (originalCoverImage) {
                    coverImagePreview = `/uploads/albums/${originalCoverImage}`;
                }
            } else {
                alert('Album sa nenašiel');
                goto('/admin/albums');
            }
        } catch (error) {
            console.error('Error loading album:', error);
            alert('Chyba pri načítaní albumu');
        } finally {
            isLoading = false;
        }
    }

    async function handleCoverImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Prosím vyberte obrázok');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Obrázok je príliš veľký. Maximálna veľkosť je 5MB.');
            return;
        }

        coverImageFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            coverImagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async function uploadCoverImage() {
        if (!coverImageFile) return null;

        const uploadFormData = new FormData();
        uploadFormData.append('photo', coverImageFile);
        uploadFormData.append('type', 'albums');

        try {
            const response = await fetch('/api/upload-photo', {
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
            console.error('Error uploading cover image:', error);
            throw error;
        }
    }

    async function handleSubmit() {
        if (isSubmitting) return;

        if (!formData.title.trim()) {
            alert('Názov albumu je povinný');
            return;
        }

        isSubmitting = true;

        try {
            // Upload new cover image if selected
            if (coverImageFile) {
                formData.cover_image = await uploadCoverImage();
            }

            const response = await fetch(`/api/albums/${albumId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Album bol úspešne aktualizovaný');
                goto('/admin/albums');
            } else {
                const error = await response.json();
                alert('Chyba pri aktualizácii albumu: ' + (error.message || 'Neznáma chyba'));
            }
        } catch (error) {
            console.error('Error updating album:', error);
            alert('Chyba pri aktualizácii albumu');
        } finally {
            isSubmitting = false;
        }
    }

    function removeCoverImage() {
        coverImageFile = null;
        coverImagePreview = null;
        formData.cover_image = '';
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    }
</script>

<svelte:head>
    <title>Upraviť album - Admin</title>
</svelte:head>

<div class="admin-container">
    <header class="admin-header">
        <h1>
            <i class="fas fa-edit"></i>
            Upraviť album
        </h1>
        <div class="header-actions">
            <a href="/admin/albums/{albumId}/songs" class="btn btn-info">
                <i class="fas fa-music"></i>
                Skladby
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
            <p>Načítavam album...</p>
        </div>
    {:else}
        <form on:submit|preventDefault={handleSubmit} class="album-form">
            <div class="form-grid">
                <div class="form-section">
                    <h3>Základné informácie</h3>
                    
                    <div class="form-group">
                        <label for="title">Názov albumu *</label>
                        <input 
                            type="text" 
                            id="title" 
                            bind:value={formData.title}
                            required
                            placeholder="Zadajte názov albumu"
                        />
                    </div>

                    <div class="form-group">
                        <label for="description">Popis albumu</label>
                        <textarea 
                            id="description" 
                            bind:value={formData.description}
                            rows="4"
                            placeholder="Zadajte popis albumu"
                        ></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="release_date">Dátum vydania</label>
                            <input 
                                type="date" 
                                id="release_date" 
                                bind:value={formData.release_date}
                            />
                        </div>

                        <div class="form-group">
                            <label for="genre">Žáner</label>
                            <input 
                                type="text" 
                                id="genre" 
                                bind:value={formData.genre}
                                placeholder="napr. Rock, Pop, Folk"
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="sort_order">Poradie</label>
                            <input 
                                type="number" 
                                id="sort_order" 
                                bind:value={formData.sort_order}
                                min="0"
                            />
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    bind:checked={formData.is_published}
                                />
                                <span class="checkmark"></span>
                                Publikovať album
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Obal albumu</h3>
                    
                    <div class="cover-upload">
                        {#if coverImagePreview}
                            <div class="cover-preview">
                                <img src={coverImagePreview} alt="Náhľad obalu" />
                                <button type="button" class="remove-cover" on:click={removeCoverImage}>
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        {:else}
                            <div class="cover-placeholder">
                                <i class="fas fa-compact-disc"></i>
                                <p>Žiadny obal</p>
                            </div>
                        {/if}

                        <div class="upload-controls">
                            <input 
                                type="file" 
                                accept="image/*" 
                                on:change={handleCoverImageUpload}
                                id="cover-upload"
                                style="display: none;"
                            />
                            <label for="cover-upload" class="btn btn-outline">
                                <i class="fas fa-upload"></i>
                                {coverImagePreview ? 'Zmeniť obal' : 'Nahrať obal'}
                            </label>
                            <small>Podporované formáty: JPG, PNG, GIF (max. 5MB)</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                    {#if isSubmitting}
                        <i class="fas fa-spinner fa-spin"></i>
                        Aktualizujem album...
                    {:else}
                        <i class="fas fa-save"></i>
                        Uložiť zmeny
                    {/if}
                </button>
                <a href="/admin/albums" class="btn btn-secondary">
                    <i class="fas fa-times"></i>
                    Zrušiť
                </a>
            </div>
        </form>
    {/if}
</div>

<style>
    /* Rovnaké štýly ako v add/+page.svelte */
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

    .album-form {
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

    .cover-upload {
        text-align: center;
    }

    .cover-preview {
        position: relative;
        display: inline-block;
        margin-bottom: 20px;
    }

    .cover-preview img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .remove-cover {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cover-placeholder {
        width: 200px;
        height: 200px;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: var(--text-color);
    }

    .cover-placeholder i {
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

    .btn-info {
        background: #3b82f6;
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

        .header-actions {
            flex-direction: column;
            gap: 5px;
        }
    }
</style>
