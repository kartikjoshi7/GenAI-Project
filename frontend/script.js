document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const originalTextContainer = document.getElementById('originalTextContainer');
    const simplifiedTextContainer = document.getElementById('simplifiedTextContainer');
    
    // Make sure these elements exist in your HTML
    if (!uploadButton || !fileInput || !originalTextContainer || !simplifiedTextContainer) {
        console.error('Required elements not found in DOM');
        return;
    }
    
    // Trigger file input when upload button is clicked
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Show loading state
        originalTextContainer.textContent = 'Processing document...';
        simplifiedTextContainer.textContent = 'Processing document...';
        
        const formData = new FormData();
        formData.append('document', file);
        
        try {
            // Send to your backend
            const response = await fetch('http://localhost:3001/api/process-document', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Update the UI with results
            originalTextContainer.textContent = data.originalText;
            simplifiedTextContainer.textContent = data.simplifiedText;
            
        } catch (error) {
            console.error('Error:', error);
            simplifiedTextContainer.textContent = `Error: ${error.message}`;
        }
    });
});