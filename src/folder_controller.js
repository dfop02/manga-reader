let files = [];
let currentFolderName = '';

function returnAllFolders() {
    var subfolderlist = [];

    for (var i=0; i<files.length; i++) {
        var filePath = files[i].webkitRelativePath;
        var folders = filePath.split('/');

        if (folders.length > 2) {
            if (!subfolderlist.includes(folders[1])) {
                subfolderlist.push(folders[1]);
            }
        }
    }

    return subfolderlist.sort();
}

function returnAllChapters() {
    var chapterslist = [];
    
    for (var i=0; i<files.length; i++) {
        var filePath = files[i].webkitRelativePath;
        var folders = filePath.split('/');
        
        if (folders.length > 3 && filePath.includes(`${currentFolderName}/`)) {
            if (!chapterslist.includes(folders[2])) {
                chapterslist.push(folders[2]);
            }
        }
    }

    return chapterslist.sort();
}

function titleCase(text) {
    return text.toLowerCase()
        .replace(/[_|-]/g, ' ')
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

function buildURL(file) {
    return URL.createObjectURL(file);
}

function renderAllFolders() {
    $('#folders').empty();
    var subfolders = returnAllFolders()
    for (var i=0; i<subfolders.length; i++) {
        let manga = titleCase(subfolders[i])
        $('#folders').append(`<a class="folder" href="#" onclick="renderFolder('${subfolders[i]}')"/>${manga}</a>`);
    }

    $('#select-folder').hide();
    $('#folders').show();
}

function renderFolder(manga_name = null) {
    if (manga_name) currentFolderName = manga_name;
    let chapters = returnAllChapters();

    $('#select-folder').html(`
        <span class="material-icons">first_page</span>
        <a class="folder" href="#" onclick="renderAllFolders()"/>${titleCase(currentFolderName)}</a>
    `).show();
    $('#folders').empty().show();

    for (var i=0; i<chapters.length; i++) {
        let chapter = titleCase(chapters[i])
        $('#folders').append(`<a class="folder" href="#" onclick="renderChapter('${chapters[i]}')"/>${chapter}</a>`);
    }
}

function renderChapter(chapter_name) {
    let source = files.filter(file => file.webkitRelativePath.includes(`${currentFolderName}/${chapter_name}`))
                      .sort((a,b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath, undefined, { numeric: true, sensitivity: 'base' }))
                      .map((file) => buildURL(file))
    $('#folders').empty().hide();

    loadManga(manga_name=titleCase(currentFolderName), source=source);
}

$(function() {
    $('#select-folder, #folders').hide();
    $('#folder').change(function() {
        files = Array.from(event.target.files);
        renderAllFolders();
        $('.input-folders').hide();
    });
});
