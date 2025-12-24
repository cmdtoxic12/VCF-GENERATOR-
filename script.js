// 1. Load existing contacts from localStorage or start with empty array
let contacts = JSON.parse(localStorage.getItem('vcf_contacts')) || [];
const limit = 500;

const form = document.getElementById('contact-form');
const countDisplay = document.getElementById('contact-count');
const progressFill = document.getElementById('progress-fill');
const downloadContainer = document.getElementById('download-container');

// Initial UI update on page load
updateUI();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (contacts.length >= limit) {
        alert("Limit reached!");
        return;
    }

    const contact = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        phone: document.getElementById('code').value + document.getElementById('whatsapp').value
    };

    // 2. Add to array and Save to localStorage
    contacts.push(contact);
    localStorage.setItem('vcf_contacts', JSON.stringify(contacts));
    
    updateUI();
    form.reset();
});

function updateUI() {
    const count = contacts.length;
    countDisplay.innerText = count;
    
    const percentage = (count / limit) * 100;
    progressFill.style.width = `${percentage}%`;

    if (count >= limit) {
        downloadContainer.classList.remove('hidden');
        document.getElementById('add-btn').disabled = true;
        document.getElementById('add-btn').innerText = "Limit Reached";
    } else {
        downloadContainer.classList.add('hidden');
        document.getElementById('add-btn').disabled = false;
        document.getElementById('add-btn').innerText = "Add to Batch";
    }
}

document.getElementById('download-btn').addEventListener('click', () => {
    let vcfContent = "";

    contacts.forEach(c => {
        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;TYPE=CELL,WAID=${c.phone}:${c.phone}\nNOTE:Age: ${c.age}, Country: ${c.country}\nEND:VCARD\n`;
    });

    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_batch.vcf`;
    a.click();

    // Optional: Clear storage after download so user can start a new batch
    if(confirm("Download started! Do you want to clear the list and start a new batch?")) {
        contacts = [];
        localStorage.removeItem('vcf_contacts');
        updateUI();
    }
});

