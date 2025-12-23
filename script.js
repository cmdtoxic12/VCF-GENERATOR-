let contacts = [];
const limit = 500;

const form = document.getElementById('contact-form');
const countDisplay = document.getElementById('contact-count');
const progressFill = document.getElementById('progress-fill');
const downloadContainer = document.getElementById('download-container');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (contacts.length >= limit) return;

    // Grab values
    const contact = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        phone: document.getElementById('code').value + document.getElementById('whatsapp').value
    };

    contacts.push(contact);
    updateUI();
    form.reset();
});

function updateUI() {
    const count = contacts.length;
    countDisplay.innerText = count;
    
    // Update progress bar
    const percentage = (count / limit) * 100;
    progressFill.style.width = `${percentage}%`;

    // Show download button if limit reached
    if (count >= limit) {
        downloadContainer.classList.remove('hidden');
        document.getElementById('add-btn').disabled = true;
    }
}

document.getElementById('download-btn').addEventListener('click', () => {
    let vcfContent = "";

    contacts.forEach(c => {
        vcfContent += `BEGIN:VCARD\n`;
        vcfContent += `VERSION:3.0\n`;
        vcfContent += `FN:${c.name}\n`;
        vcfContent += `TEL;TYPE=CELL,WAID=${c.phone}:${c.phone}\n`;
        vcfContent += `NOTE:Age: ${c.age}, Country: ${c.country}\n`;
        vcfContent += `END:VCARD\n`;
    });

    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_batch.vcf`;
    a.click();
});

