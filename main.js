// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry for the globe
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    wireframe: false
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Helper function to fetch all GeoJSON files
async function fetchAllGeoJsons() {
    const countries = [ 'AFG.geo.json', 'ALB.geo.json', 'DZA.geo.json', 'AGO.geo.json', 'ARG.geo.json', 'ARM.geo.json', 
        'AUS.geo.json', 'AUT.geo.json', 'AZE.geo.json', 'BHS.geo.json', 'BGD.geo.json', 'BLR.geo.json', 'BEL.geo.json', 
        'BLZ.geo.json', 'BEN.geo.json', 'BTN.geo.json', 'BOL.geo.json', 'BIH.geo.json', 'BWA.geo.json', 'BRA.geo.json', 
        'BRN.geo.json', 'BGR.geo.json', 'BFA.geo.json', 'BDI.geo.json', 'KHM.geo.json', 'CMR.geo.json', 'CAN.geo.json', 
        'CAF.geo.json', 'TCD.geo.json', 'CHL.geo.json', 'CHN.geo.json', 'COL.geo.json', 'COG.geo.json', 'COD.geo.json', 
        'CRI.geo.json', 'HRV.geo.json', 'CUB.geo.json', 'CYP.geo.json', 'CZE.geo.json', 'DNK.geo.json', 'DJI.geo.json', 
        'DOM.geo.json', 'ECU.geo.json', 'EGY.geo.json', 'SLV.geo.json', 'GNQ.geo.json', 'ERI.geo.json', 'EST.geo.json', 
        'ETH.geo.json', 'FLK.geo.json', 'FJI.geo.json', 'FIN.geo.json', 'FRA.geo.json', 'GUF.geo.json', 'ATF.geo.json', 
        'GAB.geo.json', 'GMB.geo.json', 'GEO.geo.json', 'DEU.geo.json', 'GHA.geo.json', 'GRC.geo.json', 'GTM.geo.json', 
        'GIN.geo.json', 'GNB.geo.json', 'GUY.geo.json', 'HTI.geo.json', 'HND.geo.json', 'HUN.geo.json', 'ISL.geo.json', 
        'IND.geo.json', 'IDN.geo.json', 'IRN.geo.json', 'IRQ.geo.json', 'IRL.geo.json', 'ISR.geo.json', 'ITA.geo.json',
        'JAM.geo.json', 'JPN.geo.json', 'JOR.geo.json', 'KAZ.geo.json', 'KEN.geo.json', 'KOR.geo.json', 'KWT.geo.json',
        'KGZ.geo.json', 'LAO.geo.json', 'LVA.geo.json', 'LBN.geo.json', 'LSO.geo.json', 'LBR.geo.json', 'LBY.geo.json',
        'LTU.geo.json', 'LUX.geo.json', 'MKD.geo.json', 'MDG.geo.json', 'MWI.geo.json', 'MYS.geo.json', 'MLI.geo.json',
        'MLT.geo.json', 'MRT.geo.json', 'MEX.geo.json', 'MDA.geo.json', 'MNG.geo.json', 'MNE.geo.json', 'MAR.geo.json',
        'MOZ.geo.json', 'MMR.geo.json', 'NAM.geo.json', 'NPL.geo.json', 'NLD.geo.json', 'NCL.geo.json', 'NZL.geo.json',
        'NIC.geo.json', 'NER.geo.json', 'NGA.geo.json', 'NOR.geo.json', 'OMN.geo.json', 'PAK.geo.json', 'PSE.geo.json', 
        'PAN.geo.json', 'PNG.geo.json', 'PRY.geo.json', 'PER.geo.json', 'PHL.geo.json', 'POL.geo.json', 'PRT.geo.json',
        'PRI.geo.json', 'QAT.geo.json', 'ROU.geo.json', 'RUS.geo.json', 'RWA.geo.json', 'SAU.geo.json', 'SEN.geo.json', 
        'SLE.geo.json', 'SVK.geo.json', 'SVN.geo.json', 'SLB.geo.json', 'SOM.geo.json', 'ZAF.geo.json', 'SSD.geo.json', 
        'ESP.geo.json', 'LKA.geo.json', 'SDN.geo.json', 'SUR.geo.json', 'SWZ.geo.json', 'SWE.geo.json', 'CHE.geo.json', 
        'SYR.geo.json', 'TWN.geo.json', 'TJK.geo.json', 'TZA.geo.json', 'THA.geo.json', 'TLS.geo.json', 'TGO.geo.json', 
        'TTO.geo.json', 'TUN.geo.json', 'TUR.geo.json', 'TKM.geo.json', 'UGA.geo.json', 'UKR.geo.json', 'ARE.geo.json', 
        'GBR.geo.json', 'USA.geo.json', 'URY.geo.json', 'UZB.geo.json', 'VUT.geo.json', 'VEN.geo.json', 'VNM.geo.json', 
        'YEM.geo.json', 'ZMB.geo.json', 'ZWE.geo.json', 'CYM.geo.json' ];

    const promises = countries.map(file =>
        fetch(`countries/${file}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${file}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching ${file}:`, error);
                return null; // Return null if there's an error
            })
    );

    return Promise.all(promises);
}

// Add country outlines
async function loadCountryOutlines() {
    const geoJsonFiles = await fetchAllGeoJsons();

    if (geoJsonFiles.every(file => file === null)) {
        console.error('No GeoJSON files were successfully loaded.');
        return;
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color for outlines

    geoJsonFiles.forEach(geoJson => {
        //if (!geoJson) return; // Skip if there's an error fetching the file
        if (!geoJson.features) {
            console.warn('Invalid GeoJSON format:', geoJson);
            return;
        }

        geoJson.features.forEach(feature => {
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                const coordinates = feature.geometry.coordinates;
                if (feature.geometry.type === 'MultiPolygon') {
                    coordinates.forEach(polygon => createAndAddLines(polygon));
                } else {
                    createAndAddLines(coordinates);
                }
            }
        });
    });

    function createAndAddLines(coordinates) {
        const lineGeometry = new THREE.BufferGeometry();
        const positions = [];

        coordinates.forEach(ring => {
            ring.forEach(([lon, lat], index) => {
                const latRad = THREE.MathUtils.degToRad(lat);
                const lonRad = THREE.MathUtils.degToRad(lon);
                const x = 5 * Math.sin(latRad) * Math.cos(lonRad);
                const y = 5 * Math.cos(latRad);
                const z = 5 * Math.sin(latRad) * Math.sin(lonRad);

                positions.push(x, y, z);
                if (index > 0) {
                    positions.push(...positions.slice(-3)); // Connect to previous point
                }
            });
        });

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const line = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(line);
    }
}

// Set up camera position
camera.position.z = 10;

// Add rotation to the globe
function animate() {
    requestAnimationFrame(animate);

    globe.rotation.y += 0.001; // Adjust rotation speed here

    renderer.render(scene, camera);
}

loadCountryOutlines().then(() => {
    animate(); // Start animation after outlines are loaded
});
