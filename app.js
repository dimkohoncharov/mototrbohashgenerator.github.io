async function generateAES256Key() {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]),
        raw = await crypto.subtle.exportKey("raw", key),
        bytes = new Uint8Array(raw),
        hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    return hex;
}
async function generateRandomHex(n) {
    if (!Number.isInteger(n) || n <= 0)
        throw new RangeError('n must be a positive integer');

    const charset = '0123456789abcdefABCDEF#$-_';
    const rnd = new Uint8Array(n);

    if (!globalThis.crypto || !globalThis.crypto.getRandomValues)
        throw new Error('crypto.getRandomValues not available in this environment');

    crypto.getRandomValues(rnd);

    let result = '';
    for (let i = 0; i < n; i++) {
        result += charset[rnd[i] % charset.length];
    }

    return result;
}
async function generateRandomNumber(n) {
    if (!Number.isInteger(n) || n <= 0)
        throw new RangeError('n must be a positive integer');

    if (!globalThis.crypto || !globalThis.crypto.getRandomValues)
        throw new Error('crypto.getRandomValues not available');

    const digits = [];
    const byte = new Uint8Array(1);

    while (digits.length < n) {
        crypto.getRandomValues(byte);
        const val = byte[0];
        if (val > 249) continue; // відкидаємо надлишкові байти
        digits.push(val % 10);
    }

    return digits.join('');
}
async function generateSymmetricKeys() {
    const keysCount = parseInt(document.getElementById("symmetric_keys_count").value);
    const startId = parseInt(document.getElementById("symmetric_keys_start_id").value);
    clearContent();
    for (let i = 1; i <= keysCount; i++) {
        let hex = await generateAES256Key(startId + i);
        document.querySelector("#symmetric_keys_output tbody").appendChild(
            generateTableRow([startId + i, hex])
        );
    }
    showContent('symmetric_keys_output');
}

async function generateRASKeys() {
    const keysCount = parseInt(document.getElementById("ras_keys_count").value);
    const keyLength = parseInt(document.getElementById("ras_keys_length").value);
    clearContent();
    for (let i = 1; i <= keysCount; i++) {
        let hex = await generateRandomHex(keyLength);
        document.querySelector("#ras_keys_output tbody").appendChild(
            generateTableRow([`RAS Key ${i}`, hex])
        );
    }
    showContent("ras_keys_output");
}
async function generateOTAPKeys() {
    const keyLength = parseInt(document.getElementById("otap_keys_length").value);
    const keysCount = parseInt(document.getElementById("otap_keys_count").value);
    clearContent();
    for (let i = 1; i <= keysCount; i++) {
        let hex = await generateRandomNumber(keyLength);
        document.querySelector("#otap_keys_output tbody").appendChild(
            generateTableRow([`Otap Key ${i}`, hex])
        );
    }
    showContent("otap_keys_output");
}
async function generatePSKKeys() {
    const keyLength = parseInt(document.getElementById("psk_keys_length").value);
    const keysCount = parseInt(document.getElementById("psk_keys_count").value);
    clearContent();
    for (let i = 1; i <= keysCount; i++) {
        let hex = await generateRandomHex(keyLength);
        document.querySelector("#psk_keys_output tbody").appendChild(
            generateTableRow([`PSK Key ${i}`, hex])
        );
    }
    showContent("psk_keys_output");
}
function generateTableRow(data) {
    let tr = document.createElement("tr");
    data.forEach(val => {
        let td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
    });
    return tr;
}

function clearContent() {
    document.querySelectorAll(".output tbody").forEach(element => { element.innerHTML = ""; });
    document.querySelectorAll(".output").forEach(element => { element.classList.add('hidden'); });
}

function showContent(id) {
    document.querySelector(`#${id}`).classList.remove('hidden');
    document.querySelectorAll('.btn.clear').forEach(element => {
        element.classList.remove('hidden');
    });
}
document.querySelectorAll('.tab a').forEach(element => {
    element.addEventListener("click", async () => { clearContent(); })
});
