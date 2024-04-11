let ARM9_BIN_PATH = null;
let ARM_VALUES = [];
const ARM_OFFSETS = {
    "Rain Slot": 0x082B80,
    "Snow Slot": 0x082B78,
    "Flashing Camera Slot": 0x08BBC0
};

function openFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function readBinaryFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function saveFile() {
    if (ARM9_BIN_PATH) {
        try {
            const uint8Array = new Uint8Array(ARM_VALUES);
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = ARM9_BIN_PATH;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    } else {
        console.error('No file is opened to save.');
    }
}

async function saveFileAs() {
    try {
        const uint8Array = new Uint8Array(ARM_VALUES);
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.bin';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
            document.body.removeChild(fileInput);
        });

        fileInput.click();
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

function openHelp() {
    const helpMessage = `
    This program allows you to edit the course specific slot IDs in the arm9.bin file of Mario Kart DS.\n\n
    1. To get started, go to File > Open and select the arm9.bin file you want to edit.\n\n
    2. Once the file is opened, click on a slot in the list to change its course ID.\n\n
    3. After making changes, go to File > Save to save the modified file.\n\n
    Documentation: Southport\n
    Code by Landon & Emma`;
    alert(helpMessage);
}

function openRepository() {
    const repositoryUrl = 'https://github.com/LandonAndEmma/MKDS-ARM9-Slots-Swapper';
    window.open(repositoryUrl, '_blank');
}

function onListboxSelect() {
    const selectedTrack = trackList.options[trackList.selectedIndex].text;
    if (selectedTrack) {
        openPopup();
    }
}

function refreshListbox() {
    const trackList = document.getElementById('trackList');
    trackList.innerHTML = '';
    for (const [track, offset] of Object.entries(ARM_OFFSETS)) {
        const option = document.createElement('option');
        option.text = track;
        trackList.add(option);
    }
}

async function openPopup() {
    const selectedTrack = trackList.options[trackList.selectedIndex].text;
    const offset = ARM_OFFSETS[selectedTrack];

    const newSeqValue = prompt(`Enter new course value for ${selectedTrack}:`, ARM_VALUES[offset]);
    if (newSeqValue !== null) {
        const intValue = parseInt(newSeqValue);
        if (!isNaN(intValue) && intValue >= 0 && intValue <= 75) {
            ARM_VALUES[offset] = intValue;
            refreshListbox();
            alert(`SEQ value for ${selectedTrack} changed to ${intValue}`);
        } else {
            alert('Invalid course value. Value must be between 1 and 54.');
        }
    }
}

document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        ARM9_BIN_PATH = file.name;
        const fileContent = await readBinaryFile(file);
        ARM_VALUES = Array.from(fileContent);
        refreshListbox();
    }
});
