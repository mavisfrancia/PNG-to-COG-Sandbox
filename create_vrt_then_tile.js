const input = "/app/site_plan_lg.png";
const vrtPath = input.replace(".png", ".vrt");
const outputPath = "/app/tiles";
const width = 16800;
const height = 12000;

const b = calibrationConfigs.sitePlan.cornerPoints;

const cmd = `
gdal_translate -of VRT -a_srs EPSG:4326 \
  -gcp 0 0 ${b[0].lng} ${b[0].lat} \
  -gcp ${width} 0 ${b[1].lng} ${b[1].lat} \
  -gcp ${width} ${height} ${b[2].lng} ${b[2].lat} \
  -gcp 0 ${height} ${b[3].lng} ${b[3].lat} \
  ${input} ${vrtPath}
`.trim();

console.log("=== Step 1: Create VRT ===");
console.log(
  `docker run -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${cmd}"`
);
console.log("");

console.log("=== Step 2: Build Tiles ===");
const tileCmd = `gdal2tiles.py --profile=mercator --processes=4 --zoom=10-22 --exclude --tilesize=512 --xyz --webviewer=none ${vrtPath} ${outputPath}`;
console.log(
  `docker run -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${tileCmd}"`
);
console.log("");
