let listTugas = JSON.parse(localStorage.getItem("DATA_TUGAS")) || [];
let riwayatTugas = JSON.parse(localStorage.getItem("DATA_RIWAYAT")) || [];

if (listTugas.some(t => t.isDone !== undefined)) {
    const aktif = listTugas.filter(t => !t.isDone);
    const selesai = listTugas.filter(t => t.isDone);
    listTugas = aktif.map(t => ({
        id: t.id,
        teks: t.teks
    }));
    riwayatTugas = selesai.map(t => ({
        id: t.id,
        teks: t.teks
    }));
}

function gambarTugas() {
    const wadah = document.getElementById("wadahTugas");
    wadah.innerHTML = "";

    const wadahRiwayat = document.getElementById("wadahRiwayat");
    wadahRiwayat.innerHTML = "";

    const tgl = new Date();
    const opsiTgl = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    document.getElementById("hariIni").innerText =
        tgl.toLocaleDateString('id-ID', opsiTgl);

    const now = new Date();
    document.getElementById("waktuSekarang").innerText =
        now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

    let total = listTugas.length;
    let selesai = riwayatTugas.length;
    let totalSemua = total + selesai;
    let persen = totalSemua > 0 ? Math.round((selesai / totalSemua) * 100) : 0;

    document.getElementById("total").innerText = totalSemua;
    const skorEl = document.getElementById("skor");
    if (skorEl) {
        skorEl.innerText = persen + "%";
    }

    document.getElementById("infoBoard").style.display = 'flex';
    document.getElementById("progresSection").style.display = 'flex';
    document.getElementById("progressBar").style.width = persen + "%";
    document.getElementById("progressLabel").innerText = persen + "%";

    listTugas.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = `tugas-item`;

        div.innerHTML = `
            <div class="left">
                <i onclick="toggleStatus(${index})"
                    class="status-icon fas fa-circle"></i>

                <span id="teks-${index}">${item.teks}</span>
                <input id="input-${index}" class="edit-input" type="text" value="${item.teks}" />
            </div>

            <div class="right">
                <button id="editBtn-${index}" class="btn-edit" onclick="startEditTugas(${index})">
                    <i class="fas fa-pen"></i>
                </button>
                <button id="saveBtn-${index}" class="btn-save" onclick="saveEdit(${index})">Save</button>
                <button id="cancelBtn-${index}" class="btn-cancel" onclick="cancelEdit(${index})">Cancel</button>
                <button class="btn-hapus" onclick="hapus(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        wadah.appendChild(div);
    });

    riwayatTugas.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = `tugas-item done`;

        div.innerHTML = `
            <div class="left">
                <i onclick="toggleBack(${index})"
                    class="status-icon fas fa-check-circle done"></i>
                <span>${item.teks}</span>
            </div>

            <div class="right">
                <button class="btn-hapus" onclick="hapusRiwayat(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        wadahRiwayat.appendChild(div);
    });

    localStorage.setItem("DATA_TUGAS", JSON.stringify(listTugas));
    localStorage.setItem("DATA_RIWAYAT", JSON.stringify(riwayatTugas));
}

function tambah() {
    const input = document.getElementById("inputTugas");
    let teksBaru = input.value.trim().toUpperCase();

    if (teksBaru.length === 0) {
        alert("Mohon mengisi tugas terlebih dahul");
        return;
    }

    listTugas.push({
        id: Date.now(),
        teks: teksBaru,
        isDone: false
    });

    input.value = "";
    gambarTugas();
}

function startEditTugas(index) {
    const teksEl = document.getElementById(`teks-${index}`);
    const inputEl = document.getElementById(`input-${index}`);
    const editBtn = document.getElementById(`editBtn-${index}`);
    const saveBtn = document.getElementById(`saveBtn-${index}`);
    const cancelBtn = document.getElementById(`cancelBtn-${index}`);

    if (!teksEl || !inputEl || !editBtn || !saveBtn || !cancelBtn) return;

    teksEl.style.display = 'none';
    inputEl.style.display = 'inline-block';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    inputEl.focus();
}

function saveEdit(index) {
    const inputEl = document.getElementById(`input-${index}`);
    if (!inputEl) return;

    const teksBaru = inputEl.value.trim();
    if (teksBaru.length === 0) {
        alert('Mohon mengisi tugas terlebih dahulu');
        return;
    }

    listTugas[index].teks = teksBaru.toUpperCase();
    gambarTugas();
}

function cancelEdit(index) {
    gambarTugas();
}

function toggleStatus(index) {
    const tugas = listTugas.splice(index, 1)[0];
    riwayatTugas.push(tugas);
    gambarTugas();
}

function toggleBack(index) {
    const tugas = riwayatTugas.splice(index, 1)[0];
    listTugas.push(tugas);
    gambarTugas();
}

function hapus(index) {
    if (confirm("Yakin mau menghapus tugas ini?")) {
        listTugas.splice(index, 1);
        gambarTugas();
    }
}

function hapusRiwayat(index) {
    if (confirm("Yakin mau menghapus tugas dari riwayat ini?")) {
        riwayatTugas.splice(index, 1);
        gambarTugas();
    }
}

document.getElementById("inputTugas")
    .addEventListener("keypress", (e) => {
        if (e.key === "Enter") tambah();
    });

gambarTugas();

setInterval(() => {
    document.getElementById("waktuSekarang").innerText =
        new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
}, 1000);

const daftarMotivasi = [
    "Jangan tunggu hari yang sempurna. Buat harimu berarti dengan menuliskan dan menyelesaikan apa yang penting.",
    "Daripada bingung mau ngapain, mending isi to-do list dan langsung gas kerjain satu per satu!",
    "Setiap hal besar selalu dimulai dari langkah kecil. Tuliskan di to-do list, lalu buktikan kamu bisa melakukannya.",
    "Hari ini adalah kesempatan untuk jadi lebih baik. Tulis rencanamu dan jalani dengan penuh usaha.",
    "Mimpi besar butuh tindakan nyata setiap hari. Mulai dari to-do list, lalu buktikan keseriusanmu dengan menyelesaikannya.",
    "Gak usah nunggu mood buat mulai, kerjain aja dulu pelan-pelan. Yang penting jalan terus, nanti juga kelar satu per satu",
    "Mulai dari hal kecil dan selesaikan satu per satu. Tidak perlu sempurna, yang penting kamu terus bergerak maju. Setiap tugas yang selesai adalah langkah kecil menuju tujuan besar"
];

const hari = new Date().getDate();

const index = hari % daftarMotivasi.length;

document.getElementById("motivasi").innerText = daftarMotivasi[index];