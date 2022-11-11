import {setObjs} from "./index.js"

export function download(filename){
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(objs)));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
window.download = download;

export function upload() {
    const input = document.createElement('input');
    input.style.visibility = 'hidden';
    input.type = 'file';


    input.onchange = e => {

        // getting a hold of the file reference
        // noinspection JSUnresolvedVariable
        /** @type {File} */
        const file = e.target.files[0];

        // setting up the reader
        const reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!
            let import_objs;
            try {
                // Try to read json
                // noinspection JSCheckFunctionSignatures
                import_objs = JSON.parse(content);
            } catch (e) {
                import_objs = [];
                // Check file content for svg elements and add them to objs via these regexes:
                // <([^/ ]+) ([^\/>]*)(?:><\/(?:\1)>|\/>) (group 1: elem, group 2: attr)
                // [ ]?([^=]+)="([^"]*)" // split attr string into json object
                content.match(/<([^/ ]+) ([^>]*)><\/(\1)>/g).forEach(function(elem) {
                    let elem_name = elem.match(/<([^/ ]+) ([^>]*)><\/(\1)>/)[1];
                    let elem_attr = elem.match(/<([^/ ]+) ([^>]*)><\/(\1)>/)[2];
                    let elem_attr_json = {};
                    elem_attr.split(" ").forEach(function(attr) {
                        let attr_name = attr.match(/([^=]+)="([^"]*)"/)[1];
                        elem_attr_json[attr_name] = attr.match(/([^=]+)="([^"]*)"/)[2];
                    });
                    if (elem_name === "circle" || elem_name === "rect") {
                        // noinspection JSCheckFunctionSignatures
                        import_objs.push({
                            "elem": elem_name,
                            "attr": elem_attr_json
                        });
                    }
                });
            } finally {
                setObjs(import_objs);
            }
        }

    }

    input.click();
}
window.upload = upload;

export function exportsvg(filename) {
    let output = '<svg style="width:100vh; height:100vh; max-width: 100vw; max-height: 100vw;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' + document.getElementById("svg").innerHTML + '</svg>';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
window.exportsvg = exportsvg;