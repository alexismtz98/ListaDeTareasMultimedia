document.addEventListener('DOMContentLoaded', function () {
    const noteForm = document.getElementById('noteForm');
    const noteInput = document.getElementById('noteInput');
    const mediaInput = document.getElementById('mediaInput');
    const noteList = document.getElementById('noteList');

    noteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const noteText = noteInput.value.trim();
        const mediaLink = mediaInput.value.trim();

        if (noteText) {
            const noteItem = createNoteItem(noteText, mediaLink);
            noteList.appendChild(noteItem);
            saveNotesToLocalStorage();
            noteInput.value = '';
            mediaInput.value = '';
        }
    });

    noteList.addEventListener('click', function (event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'BUTTON') {
            const noteItem = clickedElement.closest('li');
            
            if (clickedElement.classList.contains('delete')) {
                noteItem.remove();
            } else if (clickedElement.classList.contains('edit')) {
                editNote(noteItem);
            }

            saveNotesToLocalStorage();
        }
    });

    loadNotesFromLocalStorage();
});

function createNoteItem(noteText, mediaLink) {
    const li = document.createElement('li');
    li.innerHTML = `
        <p>${noteText}</p>
        ${mediaLink ? `<div class="media-container">${getMediaEmbed(mediaLink)}</div>` : ''}
    `;

    const deleteButton = createButton('Eliminar', 'delete');
    const editButton = createButton('Editar', 'edit');

    li.appendChild(deleteButton);
    li.appendChild(editButton);

    return li;
}

function getMediaEmbed(mediaLink) {
    // Verificar si es un enlace de YouTube
    if (mediaLink.includes('youtube.com') || mediaLink.includes('youtu.be')) {
        const videoId = getYouTubeVideoId(mediaLink);
        if (videoId) {
            return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
    }
    return `<a href="${mediaLink}" target="_blank">${mediaLink}</a>`;
}

function getYouTubeVideoId(url) {
    // Extraer el ID del video de un enlace de YouTube
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    return button;
}

function editNote(noteItem) {
    const currentText = noteItem.querySelector('p').textContent;
    const currentMediaLink = noteItem.querySelector('.media-container') ? noteItem.querySelector('.media-container').innerHTML : '';

    const newText = prompt('Edita la nota:', currentText);
    const newMediaLink = prompt('Edita el enlace multimedia:', currentMediaLink);

    if (newText !== null) {
        noteItem.querySelector('p').textContent = newText;
    }

    if (newMediaLink !== null) {
        noteItem.querySelector('.media-container').innerHTML = getMediaEmbed(newMediaLink);
    }
}

function saveNotesToLocalStorage() {
    const notes = Array.from(document.querySelectorAll('#noteList li')).map(li => {
        const noteText = li.querySelector('p').textContent;
        const mediaLink = li.querySelector('.media-container') ? li.querySelector('.media-container').innerHTML : '';
        return { noteText, mediaLink };
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const noteItem = createNoteItem(note.noteText, note.mediaLink);
        noteList.appendChild(noteItem);
    });
}
