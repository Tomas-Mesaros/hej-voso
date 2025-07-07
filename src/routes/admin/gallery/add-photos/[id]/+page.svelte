<script>
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let categoryId = $page.params.id;
    let category = null;
    let selectedFiles = [];
    let isLoading = true;
    let isUploading = false;
    let uploadProgress = 0;
    let uploadedPhotos = [];

    onMount(async () => {
        await loadCategory();
    });

    async function loadCategory() {
        try {
            const response = await fetch(`/api/gallery-categories/all`);
            if (response.ok) {
                const categories = await response.json();
                category = categories.find(c => c.id == categoryId);
                
                if (!category) {
                    alert('Kategória nebola nájdená');
                    goto('/admin/gallery');
                }
            } else {
                alert('Chyba pri načítaní kategórie');
                goto('/admin/gallery');
            }
        } catch (error) {
            console.error('Chyba pri načítaní kategórie:', error);
            alert('Chyba pri načítaní kategórie');
            goto('/admin/gallery');
        } finally {
            isLoading = false;
        }
    }

    function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length !== files.length) {
            alert('Niektoré súbory nie sú obrázky a boli preskočené');
        }

        selectedFiles = imageFiles.map((file, index) => ({
            file,
            id: Date.now() + index,
            title: '',
            description: '',
            alt_text: file.name.replace(/\.[^/.]+$/, ''), // názov bez prípony
            sort_order: index,
            preview: URL.createObjectURL(file)
        }));
    }

    function removeFile(fileId) {
        const fileIndex = selectedFiles.findIndex(f => f.id === fileId);
        if (fileIndex !== -1) {
            URL.revokeObjectURL(selectedFiles[fileIndex].preview);
            selectedFiles = selectedFiles.filter(f => f.id !== fileId);
            // Prepočítaj sort_order
            selectedFiles.forEach((file, index) => {
                file.sort_order = index;
            });
        }
    }

    function updateFileData(fileId, field, value) {
        const fileIndex = selectedFiles.findIndex(f => f.id === fileId);
        if (fileIndex !== -1) {
            selectedFiles[fileIndex][field] = value;
        }
    }

    async function uploadFile(fileData) {
        const formData = new FormData();
        formData.append('photo', fileData.file);
        formData.append('type', 'gallery');

        const response = await fetch('/api/upload-photo', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed for ${fileData.file.name}`);
        }

        const result = await response.json();
        return result.filename;
    }

    async function handleUpload() {
        if (selectedFiles.length === 0) {
            alert('Vyberte aspoň jeden súbor');
            return;
        }

        isUploading = true;
        uploadProgress = 0;
        uploadedPhotos = [];

        try {
            const totalFiles = selectedFiles.length;
            const photosData = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const fileData = selectedFiles[i];
                
                try {
                    // Upload súboru
                    const filename = await uploadFile(fileData);
                    
                    // Priprav data pre databázu
                    photosData.push({
                        filename: filename,
                        original_name: fileData.file.name,
                        title: fileData.title || null,
                        description: fileData.description || null,
                        alt_text: fileData.alt_text || fileData.file.name,
                        sort_order: fileData.sort_order
                    });

                    uploadedPhotos.push({
                        filename: filename,
                        original_name: fileData.file.name,
                        success: true
                    });

                } catch (error) {
                    console.error(`Chyba pri uploade ${fileData.file.name}:`, error);
                    uploadedPhotos.push({
                        filename: fileData.file.name,
                        original_name: fileData.file.name,
                        success: false,
                        error: error.message
                    });
                }

                uploadProgress = Math.round(((i + 1) / totalFiles) * 100);
            }

            // Ulož všetky úspešne uploadnuté fotky do databázy
            if (photosData.length > 0) {
                const response = await fetch('/api/gallery-photos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        category_id: categoryId,
                        photos: photosData
                    })
                });

                if (!response.ok) {
                    throw new Error('Chyba pri ukladaní do databázy');
                }
            }

            // Zobraz výsledky
            const successCount = uploadedPhotos.filter(p => p.success).length;
            const failCount = uploadedPhotos.filter(p => !p.success).length;

            if (failCount === 0) {
                alert(`Všetkých ${successCount} fotografií bolo úspešne nahraných!`);
                goto('/admin/gallery');
            } else {
                alert(`${successCount} fotografií nahraných úspešne, ${failCount} sa nepodarilo nahrať.`);
            }

        } catch (error) {
            console.error('Chyba pri uploade:', error);
            alert('Chyba pri nahrávaní fotografií');
        } finally {
            isUploading = false;
        }
    }

    function goBack() {
        goto('/admin/gallery');
    }

    // Cleanup URLs when component is destroyed
    onDestroy(() => {
        selectedFiles.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
    });
</script>

<svelte:head>
    <title>Pridať fotografie - Admin</title>
</svelte:head>

<main class="admin-container">
    <div class="admin-header">
        <div class="header-content">
            <h1><i class="fas fa-images"></i> Pridať fotografie</h1>
            {#if category}
                <p>Pridávanie fotografií do kategórie: <strong>{category.name}</strong></p>
            {/if}
        </div>
        <div class="header-actions">
            <button class="btn btn-secondary" on:click={goBack}>
                <i class="fas fa-arrow-left"></i>
                Späť na galériu
            </button>
        </div>
    </div>

    {#if isLoading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Načítavam kategóriu...</p>
        </div>
    {:else}
        <div class="upload-container">
            <!-- File selection -->
            <div class="upload-section">
                <div class="file-drop-zone">
                    <input
                        type="file"
                        id="photo-files"
                        multiple
                        accept="image/*"
                        on:change={handleFileSelect}
                        class="file-input"
                    >
                    <label for="photo-files" class="file-drop-label">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Vyberte fotografie</h3>
                        <p>Kliknite sem alebo pretiahnite súbory</p>
                        <small>Podporované formáty: JPG, PNG, GIF, WEBP</small>
                    </label>
                </div>
            </div>

            <!-- Selected files preview -->
            {#if selectedFiles.length > 0}
                <div class="files-section">
                    <div class="section-header">
                        <h3><i class="fas fa-list"></i> Vybrané fotografie ({selectedFiles.length})</h3>
                        <button class="btn btn-primary" on:click={handleUpload} disabled={isUploading}>
                            {#if isUploading}
                                <i class="fas fa-spinner fa-spin"></i>
                                Nahráva sa... ({uploadProgress}%)
                            {:else}
                                <i class="fas fa-upload"></i>
                                Nahrať všetky fotografie
                            {/if}
                        </button>
                    </div>

                    {#if isUploading}
                        <div class="upload-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: {uploadProgress}%"></div>
                            </div>
                            <p>Nahráva sa {uploadProgress}%...</p>
                        </div>
                    {/if}

                    <div class="files-grid">
                        {#each selectedFiles as fileData (fileData.id)}
                            <div class="file-card">
                                <div class="file-preview">
                                    <img src={fileData.preview} alt="Preview" />
                                    <button class="remove-btn" on:click={() => removeFile(fileData.id)}>
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div class="file-details">
                                    <div class="file-name">{fileData.file.name}</div>
                                    <div class="file-size">{Math.round(fileData.file.size / 1024)} KB</div>
                                    
                                    <div class="file-inputs">
                                        <input
                                            type="text"
                                            placeholder="Názov fotografie (voliteľné)"
                                            value={fileData.title}
                                            on:input={(e) => updateFileData(fileData.id, 'title', e.target.value)}
                                        >
                                        
                                        <input
                                            type="text"
                                            placeholder="Alt text"
                                            value={fileData.alt_text}
                                            on:input={(e) => updateFileData(fileData.id, 'alt_text', e.target.value)}
                                        >
                                        
                                        <textarea
                                            placeholder="Popis fotografie (voliteľné)"
                                            value={fileData.description}
                                            on:input={(e) => updateFileData(fileData.id, 'description', e.target.value)}
                                            rows="2"
                                        ></textarea>
                                        
                                        <input
                                            type="number"
                                            placeholder="Poradie"
                                            value={fileData.sort_order}
                                            on:input={(e) => updateFileData(fileData.id, 'sort_order', parseInt(e.target.value) || 0)}
                                            min="0"
                                        >
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Upload results -->
            {#if uploadedPhotos.length > 0}
                <div class="results-section">
                    <h3><i class="fas fa-check-circle"></i> Výsledky nahrávania</h3>
                    <div class="results-list">
                        {#each uploadedPhotos as photo}
                            <div class="result-item" class:success={photo.success} class:error={!photo.success}>
                                <i class="fas {photo.success ? 'fa-check' : 'fa-times'}"></i>
                                <span class="filename">{photo.original_name}</span>
                                {#if !photo.success}
                                    <span class="error-text">{photo.error}</span>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
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

    .loading {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
    }

    .upload-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .upload-section {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .file-drop-zone {
        position: relative;
        padding: 3rem;
        border: 3px dashed #bdc3c7;
        border-radius: 12px;
        text-align: center;
        transition: all 0.3s ease;
        background: #f8f9fa;
    }

    .file-drop-zone:hover {
        border-color: #3498db;
        background: #ecf0f1;
    }

    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .file-drop-label {
        cursor: pointer;
        color: #7f8c8d;
    }

    .file-drop-label i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #bdc3c7;
    }

    .file-drop-label h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
    }

    .file-drop-label p {
        margin: 0 0 0.5rem 0;
    }

    .files-section {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 2rem;
    }

    .section-header h3 {
        margin: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .upload-progress {
        margin-bottom: 2rem;
        text-align: center;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: #3498db;
        transition: width 0.3s ease;
    }

    .files-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .file-card {
        border: 1px solid #ecf0f1;
        border-radius: 8px;
        overflow: hidden;
        background: white;
    }

    .file-preview {
        position: relative;
        aspect-ratio: 16/9;
        background: #f8f9fa;
    }

    .file-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .remove-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(231, 76, 60, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
    }

    .remove-btn:hover {
        background: #c0392b;
    }

    .file-details {
        padding: 1rem;
    }

    .file-name {
        font-weight: 500;
        color: #2c3e50;
        margin-bottom: 0.25rem;
        word-break: break-word;
    }

    .file-size {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .file-inputs {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .file-inputs input,
    .file-inputs textarea {
        padding: 0.5rem;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
        font-size: 0.9rem;
        transition: border-color 0.2s;
    }

    .file-inputs input:focus,
    .file-inputs textarea:focus {
        outline: none;
        border-color: #3498db;
    }

    .results-section {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    .results-section h3 {
        margin: 0 0 1rem 0;
        color: #27ae60;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .results-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .result-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 6px;
    }

    .result-item.success {
        background: #d4edda;
        color: #155724;
    }

    .result-item.error {
        background: #f8d7da;
        color: #721c24;
    }

    .filename {
        font-weight: 500;
    }

    .error-text {
        color: #dc3545;
        font-size: 0.9rem;
        margin-left: auto;
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

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-primary {
        background: #3498db;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #2980b9;
    }

    .btn-secondary {
        background: #95a5a6;
        color: white;
    }

    .btn-secondary:hover {
        background: #7f8c8d;
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 1rem;
        }

        .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .files-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
