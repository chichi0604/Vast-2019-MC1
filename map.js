window.onload = function() {
    // Get canvas element and 2D drawing context
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Define polygon regions with their vertex coordinates, and include "name" and "selected" properties
    const regions = [
        {
            name : "palace hills (region 1)",
            selected: false,
            vertices: [
                {x: 132, y: 88},
                {x: 132, y: 179},
                {x: 118, y: 178},
                {x: 118, y: 208},
                {x: 87, y: 220},
                {x: 75, y: 265},
                {x: 56, y: 265},
                {x: 61, y: 247},
                {x: 71, y: 243},
                {x: 79, y: 220},
                {x: 68, y: 189},
                {x: 38, y: 186},
                {x: 39, y: 181},
                {x: 61, y: 181},
                {x: 48, y: 137},
                {x: 56, y: 113},
                {x: 70, y: 101},
                {x: 109, y: 87}
            ],
            fillColor: 'rgba(240,128,128,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "northwest (region 2)",
            selected: false,
            vertices: [
                {x: 132, y: 179},
                {x: 132, y: 88},
                {x: 140, y: 83},
                {x: 145, y: 85},
                {x: 145, y: 92},
                {x: 156, y: 97},
                {x: 171, y: 90},
                {x: 173, y: 85},
                {x: 189, y: 85},
                {x: 187, y: 92},
                {x: 199, y: 89},
                {x: 199, y: 84},
                {x: 202, y: 82},
                {x: 202, y: 89},
                {x: 231, y: 81},
                {x: 237, y: 88},
                {x: 236, y: 147},
                {x: 217, y: 152},
                {x: 197, y: 146},
                {x: 177, y: 157},
                {x: 175, y: 168},
                {x: 162, y: 181},
                {x: 155, y: 181},
            ],
            fillColor: 'rgba(255,165,0,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "old town (region 3)",
            selected: false,
            vertices: [
                {x: 231, y: 81},
                {x: 232, y: 63},
                {x: 259, y: 52},
                {x: 275, y: 38},
                {x: 301, y: 29},
                {x: 304, y: 51},
                {x: 315, y: 57},
                {x: 331, y: 52},
                {x: 353, y: 84},
                {x: 367, y: 81},
                {x: 367, y: 65},
                {x: 361, y: 58},
                {x: 364, y: 50},
                {x: 364, y: 34},
                {x: 387, y: 36},
                {x: 387, y: 48},
                {x: 401, y: 58},
                {x: 387, y: 105},
                {x: 389, y: 116},
                {x: 362, y: 155},
                {x: 329, y: 157},
                {x: 315, y: 163},
                {x: 301, y: 158},
                {x: 287, y: 161},
                {x: 272, y: 154},
                {x: 267, y: 153},
                {x: 251, y: 156},
                {x: 236, y: 147},
                {x: 238, y: 90},
            ],
            fillColor: 'rgba(60,179,113,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "safe town (region 4)",
            selected: false,
            vertices: [
                {x: 407, y: 45},
                {x: 437, y: 95},
                {x: 436, y: 107},
                {x: 456, y: 111},
                {x: 485, y: 85},
                {x: 488, y: 88},
                {x: 469, y: 112},
                {x: 479, y: 123},
                {x: 470, y: 127},
                {x: 488, y: 165},
                {x: 494, y: 197},
                {x: 514, y: 207},
                {x: 505, y: 214},
                {x: 508, y: 224},
                {x: 337, y: 224},
                {x: 336, y: 194},
                {x: 389, y: 116},
                {x: 387, y: 105},
            ],
            fillColor: 'rgba(147,112,219,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "southwest (region 5)",
            selected: false,
            vertices: [
                {x: 217, y: 244},
                {x: 162, y: 244},
                {x: 162, y: 224},
                {x: 155, y: 224},
                {x: 155, y: 181},
                {x: 132, y: 179},
                {x: 118, y: 178},
                {x: 118, y: 208},
                {x: 125, y: 208},
                {x: 121, y: 253},
                {x: 128, y: 265},
                {x: 163, y: 287},
                {x: 172, y: 298},
                {x: 193, y: 301},
                {x: 230, y: 324},
                {x: 269, y: 329},
                {x: 272, y: 331},
                {x: 280, y: 331},
            ],
            fillColor: 'rgba(0,191,255,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "downtown (region 6)",
            selected: false,
            vertices: [
                {x: 155, y: 181},
                {x: 163, y: 181},
                {x: 175, y: 168},
                {x: 177, y: 157},
                {x: 197, y: 146},
                {x: 217, y: 152},
                {x: 217, y: 244},
                {x: 162, y: 244},
                {x: 162, y: 224},
                {x: 155, y: 224},
            ],
            fillColor: 'rgba(218,112,214,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "wilson forest (region 7)",
            selected: false,
            vertices: [
                {x: 625, y: 400},
                {x: 625, y: 213},
                {x: 608, y: 205},
                {x: 585, y: 218},
                {x: 585, y: 400},
            ],
            fillColor: 'rgba(210,105,30,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "scenic vista (region 8)",
            selected: false,
            vertices: [
                {x: 625, y: 400},
                {x: 625, y: 405},
                {x: 581, y: 416},
                {x: 467, y: 465},
                {x: 455, y: 465},
                {x: 445, y: 480},
                {x: 424, y: 489},
                {x: 420, y: 481},
                {x: 420, y: 465},
                {x: 443, y: 465},
                {x: 550, y: 405},
                {x: 550, y: 405},
                {x: 560, y: 405},
                {x: 560, y: 390},
                {x: 585, y: 390},
                {x: 585, y: 400},
            ],
            fillColor: 'rgba(70,130,180,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "broadview (region 9)",
            selected: false,
            vertices: [
                {x: 275, y: 351},
                {x: 279, y: 360},
                {x: 279, y: 384},
                {x: 274, y: 389},
                {x: 283, y: 397},
                {x: 291, y: 400},
                {x: 326, y: 440},
                {x: 335, y: 470},
                {x: 371, y: 477},
                {x: 400, y: 493},
                {x: 420, y: 493},
                {x: 424, y: 489},
                {x: 420, y: 481},
                {x: 420, y: 432},
                {x: 449, y: 421},
                {x: 449, y: 365},
                {x: 336, y: 365},
                {x: 336, y: 348},
                {x: 282, y: 347},
            ],
            fillColor: 'rgba(100,149,237,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "chapparal (region 10)",
            selected: false,
            vertices: [
                {x: 494, y: 437},
                {x: 494, y: 337},
                {x: 449, y: 337},
                {x: 449, y: 421},
                {x: 420, y: 432},
                {x: 420, y: 465},
                {x: 443, y: 465},
                {x: 494, y: 437},
            ],
            fillColor: 'rgba(255,105,180,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "terrapin springs (region 11)",
            selected: false,
            vertices: [
                {x: 494, y: 437},
                {x: 494, y: 337},
                {x: 585, y: 337},
                {x: 585, y: 390},
                {x: 560, y: 390},
                {x: 560, y: 405},
                {x: 550, y: 405},
                {x: 494, y: 437},
            ],
            fillColor: 'rgba(106,90,205,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "pepper mill (region 12)",
            selected: false,
            vertices: [
                {x: 585, y: 234},
                {x: 579, y: 244},
                {x: 581, y: 257},
                {x: 573, y: 266},
                {x: 555, y: 267},
                {x: 556, y: 260},
                {x: 546, y: 260},
                {x: 539, y: 267},
                {x: 535, y: 262},
                {x: 534, y: 260},
                {x: 521, y: 243},
                {x: 508, y: 224},
                {x: 480, y: 224},
                {x: 493, y: 240},
                {x: 493, y: 336},
                {x: 585, y: 336},
            ],
            fillColor: 'rgba(128,128,128,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "cheddarford (region 13)",
            selected: false,
            vertices: [
                {x: 480, y: 224},
                {x: 494, y: 241},
                {x: 494, y: 337},
                {x: 449, y: 337},
                {x: 449, y: 365},
                {x: 388, y: 365},
                {x: 388, y: 350},
                {x: 403, y: 347},
                {x: 403, y: 278},
                {x: 418, y: 253},
                {x: 418, y: 224},
            ],
            fillColor: 'rgba(244,164,96,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "easton (region 14)",
            selected: false,
            vertices: [
                {x: 362, y: 156},
                {x: 336, y: 194},
                {x: 336, y: 223},
                {x: 267, y: 223},
                {x: 267, y: 153},
                {x: 272, y: 154},
                {x: 287, y: 161},
                {x: 301, y: 158},
                {x: 315, y: 163},
                {x: 329, y: 157},
            ],
            fillColor: 'rgba(255,255,0,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "weston (region 15)",
            selected: false,
            vertices: [
                {x: 267, y: 153},
                {x: 267, y: 223},
                {x: 217, y: 223},
                {x: 217, y: 152},
                {x: 236, y: 147},
                {x: 251, y: 156},
            ],
            fillColor: 'rgba(0,206,209,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "southton (region 16)",
            selected: false,
            vertices: [
                {x: 217, y: 244},
                {x: 217, y: 223},
                {x: 267, y: 224},
                {x: 268, y: 312},
            ],
            fillColor: 'rgba(255,182,193,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "oak willow (region 17)",
            selected: false,
            vertices: [
                {x: 403, y: 347},
                {x: 388, y: 350},
                {x: 388, y: 365},
                {x: 336, y: 364},
                {x: 336, y: 348},
                {x: 282, y: 346},
                {x: 282, y: 339},
                {x: 269, y: 337},
                {x: 272, y: 333},
                {x: 280, y: 331},
                {x: 274, y: 321},
                {x: 339, y: 321},
                {x: 359, y: 309},
                {x: 391, y: 300},
                {x: 403, y: 306},
            ],
            fillColor: 'rgba(205,133,63,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "east parton (region 18)",
            selected: false,
            vertices: [
                {x: 336, y: 224},
                {x: 418, y: 224},
                {x: 418, y: 254},
                {x: 403, y: 279},
                {x: 403, y: 306},
                {x: 391, y: 300},
                {x: 359, y: 309},
                {x: 341, y: 320},
                {x: 336, y: 320},
            ],
            fillColor: 'rgba(154,205,50,0.6)',
            strokeColor: '#333333'
        },
        {
            name: "west parton (region 19)",
            selected: false,
            vertices: [
                {x: 267, y: 224},
                {x: 336, y: 224},
                {x: 336, y: 320},
                {x: 273, y: 320},
                {x: 268, y: 312},
            ],
            fillColor: 'rgba(205,92,92,0.6)',
            strokeColor: '#333333'
        },
    ];

    // Define pixel coordinates for hospitals
    const hospitals = [
        { x: 86, y: 125 },
        { x: 311, y: 122 },
        { x: 195, y: 189 },
        { x: 183, y: 185 },
        { x: 211, y: 255 },
        { x: 371, y: 418 },
        { x: 547, y: 375 },
        { x: 255, y: 236 },
    ];

    // Preload hospital icon, then redraw to ensure icons are displayed
    const hospitalIcon = new Image();
    hospitalIcon.onload = function() {
        drawRegions();
    };
    hospitalIcon.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMjYiIHk9IjEwIiB3aWR0aD0iMTIiIGhlaWdodD0iNDQiIGZpbGw9InJlZCIvPgogIDxyZWN0IHg9IjEwIiB5PSIyNiIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjEyIiBmaWxsPSJyZWQiLz4KPC9zdmc+";

    // Draw all regions and hospital markers
    function drawRegions() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        regions.forEach(region => {
            ctx.beginPath();
            region.vertices.forEach((point, index) => {
                index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
            });
            ctx.closePath();
            ctx.fillStyle = region.fillColor;
            ctx.fill();
            if (region.selected) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'red';
            } else {
                ctx.lineWidth = 1;
                ctx.strokeStyle = region.strokeColor;
            }
            ctx.stroke();
        });
        // After drawing all regions and hospital icons, add a hospital legend
        ctx.save();
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#000";
        const iconWidth = 20, iconHeight = 20;
        // Set the legend position, e.g., 10px from left and 10px from bottom
        const legendX = 10;
        const legendY = canvas.height - 10 - iconHeight;
        ctx.drawImage(hospitalIcon, legendX, legendY, iconWidth, iconHeight);
        ctx.fillText("hospital", legendX + iconWidth + 5, legendY + iconHeight - 5);
        ctx.restore();
        hospitals.forEach(hospital => {
            const iconWidth = 20, iconHeight = 20;
            ctx.drawImage(hospitalIcon, hospital.x - iconWidth / 2, hospital.y - iconHeight / 2, iconWidth, iconHeight);
        });
        updateLegend();
    }

    // Update the legend's selection display, divided into three columns: first column 9 items, second column 9 items, third column 1 item
    function updateLegend() {
        const legendContainer = document.getElementById('legend');
        legendContainer.innerHTML = '';
        // Add legend title
        const legendTitle = document.createElement('h3');
        legendTitle.textContent = "Neighbor";
        legendTitle.style.textAlign = "center";
        legendTitle.style.marginBottom = "10px";
        legendContainer.appendChild(legendTitle);
        // Create three column containers, arranged vertically
        const col1 = document.createElement('div');
        const col2 = document.createElement('div');
        const col3 = document.createElement('div');
        col1.style.display = col2.style.display = col3.style.display = 'flex';
        col1.style.flexDirection = col2.style.flexDirection = col3.style.flexDirection = 'column';
        col1.style.margin = col2.style.margin = col3.style.margin = '0 10px';
        // Divide regions into specified order: first 9, next 9, last 1
        const col1Regions = regions.slice(0, 9);
        const col2Regions = regions.slice(9, 18);
        const col3Regions = regions.slice(18);
        // Helper function: append legend items to corresponding column, and add click events
        function appendLegendItems(col, regionsArray) {
            regionsArray.forEach((region) => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                if (region.selected) legendItem.classList.add('selected');
                const colorBox = document.createElement('span');
                colorBox.className = 'color-box';
                colorBox.style.backgroundColor = region.fillColor;
                colorBox.style.cursor = "pointer";
                const label = document.createElement('span');
                label.textContent = region.name;
                label.style.cursor = "pointer";
                legendItem.appendChild(colorBox);
                legendItem.appendChild(label);
                legendItem.addEventListener('click', function() {
                    regions.forEach(r => r.selected = false);
                    region.selected = true;
                    drawRegions();
                    const regionIndex = regions.findIndex(r => r.selected);
                    const regionId = (regionIndex + 1).toString();
                    window.dispatchEvent(new CustomEvent('regionSelected', { detail: { regionId } }));
                });
                col.appendChild(legendItem);
            });
        }
        appendLegendItems(col1, col1Regions);
        appendLegendItems(col2, col2Regions);
        appendLegendItems(col3, col3Regions);
        const columnsContainer = document.createElement('div');
        columnsContainer.style.display = 'flex';
        columnsContainer.style.justifyContent = 'center';
        columnsContainer.style.alignItems = 'flex-start';
        columnsContainer.appendChild(col1);
        columnsContainer.appendChild(col2);
        columnsContainer.appendChild(col3);
        legendContainer.appendChild(columnsContainer);
    }

    // Determine if a point is inside a polygon (ray casting method)
    function pointInPolygon(point, vertices) {
        let inside = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            let xi = vertices[i].x, yi = vertices[i].y;
            let xj = vertices[j].x, yj = vertices[j].y;
            let intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    // Handle canvas click events to select a region based on the click position
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let found = false;
        regions.forEach(region => {
            if (pointInPolygon({x, y}, region.vertices)) {
                found = true;
            }
        });
        let oneSelected = false;
        regions.forEach(region => {
            if (!oneSelected && pointInPolygon({x, y}, region.vertices)) {
                region.selected = true;
                oneSelected = true;
            } else {
                region.selected = false;
            }
        });
        if (!found) {
            regions.forEach(region => region.selected = false);
        }
        drawRegions();
        const selectedRegion = regions.find(region => region.selected);
        if (selectedRegion) {
            const regionIndex = regions.findIndex(r => r.selected);
            const regionId = (regionIndex + 1).toString();
            window.dispatchEvent(new CustomEvent('regionSelected', { detail: { regionId } }));
        }
    });

    // Initial drawing
    drawRegions();

    // After initial drawing, set default to region 1
    if (regions.length > 0) {
        regions[0].selected = true;
        drawRegions();
        window.dispatchEvent(new CustomEvent('regionSelected', { detail: { regionId: "1" } }));
    }

    window.regions = regions;
};
