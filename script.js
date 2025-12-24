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
    
    // Update Progress
    const percentage = (count / limit) * 100;
    progressFill.style.width = `${percentage}%`;

    // Toggle Download Button
    if (count >= limit) {
        downloadContainer.classList.remove('hidden');
        document.getElementById('add-btn').disabled = true;
    } else {
        downloadContainer.classList.add('hidden');
        document.getElementById('add-btn').disabled = false;
    }

    // --- NEW: Update Preview Table ---
    const tbody = document.getElementById('preview-body');
    tbody.innerHTML = ""; // Clear current table

    // Show last 10 contacts (to keep it fast) or show all
    // Let's show all but reversed so newest is at the top
    const displayList = [...contacts].reverse();

    displayList.forEach(c => {
        const row = `
            <tr>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.country}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    if (contacts.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:20px;'>No contacts added yet.</td></tr>";
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

// --- NEW ACTION LISTENERS ---

// Delete Last Entry
document.getElementById('undo-btn').addEventListener('click', () => {
    if (contacts.length > 0) {
        if (confirm("Remove the last contact added?")) {
            contacts.pop(); // Removes last item
            localStorage.setItem('vcf_contacts', JSON.stringify(contacts));
            updateUI();
        }
    } else {
        alert("No contacts to remove!");
    }
});

// Reset Everything
document.getElementById('reset-btn').addEventListener('click', () => {
    if (contacts.length > 0) {
        if (confirm("Are you sure you want to delete ALL contacts? This cannot be undone.")) {
            contacts = [];
            localStorage.removeItem('vcf_contacts');
            updateUI();
        }
    }
});
            
