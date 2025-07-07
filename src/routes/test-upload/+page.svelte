<script>
    let fileInput;
    let result = '';
    let isUploading = false;

    async function testUpload() {
        const file = fileInput.files[0];
        if (!file) {
            result = 'Vyberte súbor';
            return;
        }

        isUploading = true;
        result = 'Nahrávam...';

        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading file:', file.name, file.size);

            const response = await fetch('/api/test-upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                result = `Úspech! Súbor nahraný: ${data.filename} (${data.size} bytes)`;
            } else {
                result = `Chyba: ${data.error}`;
            }
        } catch (error) {
            console.error('Upload error:', error);
            result = `Chyba: ${error.message}`;
        } finally {
            isUploading = false;
        }
    }
</script>

<div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
    <h1>Test Upload</h1>
    
    <div style="margin: 1rem 0;">
        <input type="file" bind:this={fileInput} accept="image/*" />
    </div>
    
    <div style="margin: 1rem 0;">
        <button on:click={testUpload} disabled={isUploading}>
            {isUploading ? 'Nahrávam...' : 'Nahrať súbor'}
        </button>
    </div>
    
    {#if result}
        <div style="margin: 1rem 0; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
            {result}
        </div>
    {/if}
</div>
