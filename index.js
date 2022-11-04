// noinspection ES6UnusedImports
export {download, upload, exportsvg} from "./file_handler.js"

let svg = d3.select("svg");
/** @type {Array<{elem: string, attr: any}>} */
export let objs = [
    {
        elem: "circle",
        attr: {"cx": "50", "cy": "50", "r": "20", "stroke": "green", "stroke-width": "4", "fill": "yellow"}
    },
];
let mode = "circle";

// Make the DIV element draggable:
dragElement(document.getElementById("sidebar1"));

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        let rect = element.getBoundingClientRect();
        if(rect.top - pos2 > 0 && rect.bottom - pos2 < window.innerHeight) {
            element.style.top = (element.offsetTop - pos2) + "px";
        }
        if(rect.left - pos1 > 0 && rect.right - pos1 < window.innerWidth) {
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

export function changeMode(newMode) {
    let current = document.getElementsByClassName("selected_element")[0];
    current.classList.remove("selected_element");
    switch(newMode) {
        case "circle":
            let circle = document.getElementsByClassName("fa-circle")[0];
            circle.classList.add("selected_element");
            break;
        case "square":
            let square = document.getElementsByClassName("fa-square")[0];
            square.classList.add("selected_element");
            break;
    }
    mode = newMode;
}
window.changeMode = changeMode;

export function rerender() {
    svg.selectAll("*").remove();
    objs.forEach(element => {
        let obj = svg.append(element.elem);
        for (const [key, value] of Object.entries(element.attr)) {
            obj.attr(key, value);
        }
    });
    svg.selectAll("*").each(function() {
        d3.select(this).on("contextmenu", function(event) {
            const coords = d3.pointer(event);
            const x = coords[0];
            const y = coords[1];

            let obj_index = null;
            let loop_running = true;

            objs.slice().reverse().forEach(element => {
                if (loop_running) {
                    // check if element is circle or rectangle
                    if (element.elem === "circle") {
                        // check if click is inside element (including stroke)
                        if (Math.sqrt(Math.pow(x - parseFloat(element.attr.cx), 2) + Math.pow(y - parseFloat(element.attr.cy), 2))
                            <= parseFloat(element.attr.r) + (parseFloat(element.attr["stroke-width"]) / 2)) {
                            obj_index = objs.indexOf(element);
                            loop_running = false;
                        }
                    } else if (element.elem === "rect") {
                        // check if click is inside element (including stroke)
                        if (x > parseFloat(element.attr.x) - parseFloat(element.attr["stroke-width"]) &&
                            x < parseFloat(element.attr.x) + parseFloat(element.attr.width) + parseFloat(element.attr["stroke-width"]) &&
                            y > parseFloat(element.attr.y) - parseFloat(element.attr["stroke-width"]) &&
                            y < parseFloat(element.attr.y) + parseFloat(element.attr.height) + parseFloat(element.attr["stroke-width"])) {
                            obj_index = objs.indexOf(element);
                            loop_running = false;
                        }
                    }
                }
            });

            if (obj_index != null) {
                objs.splice(obj_index, 1)
            }

            rerender();
            event.preventDefault();
        })
    })
}

rerender();
svg.on("click", function(event) {
    const coords = d3.pointer(event);
    const x = coords[0];
    const y = coords[1];

    switch(mode){
        case "circle":
            objs.push({elem: "circle", attr: {"cx": x.toString(), "cy": y.toString(), "r": "5", "stroke": "green", "stroke-width": "4", "fill": "blue"}})
            break;
        case "square":
            objs.push({elem: "rect", attr: {"x": (x-5).toString(), "y": (y-5).toString(), "r": "5", "width": "10", "height": "10", "stroke": "green", "stroke-width": "1", "fill": "blue"}})
            break;
    }

    rerender();
})