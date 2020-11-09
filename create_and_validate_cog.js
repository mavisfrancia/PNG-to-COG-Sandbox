const calibrationConfigs = require("./calibrationConfigs.json");

const input = "site_plan_lg.png";
const output = "site_plan.tif";
const width = 16800;
const height = 12000;

const b = calibrationConfigs.sitePlan.cornerPoints;

const cmd = `
gdal_translate -of GTiff -a_srs EPSG:4326 \
  -gcp 0 0 ${b[0].lng} ${b[0].lat} \
  -gcp ${width} 0 ${b[1].lng} ${b[1].lat} \
  -gcp ${width} ${height} ${b[2].lng} ${b[2].lat} \
  -gcp 0 ${height} ${b[3].lng} ${b[3].lat} \
  /app/${input} /app/${output.replace(".tif", "_intermediate.tif")}
`.trim();

console.log("=== Step 1: Create Geotiff ===");
console.log(
  `docker run -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${cmd}"`
);
console.log("");

console.log("=== Step 2: Flatten Geotiff ===");
const flattenCmd = `gdalwarp -t_srs EPSG:4326 /app/${output.replace(
  ".tif",
  "_intermediate.tif"
)} /app/${output}`;
console.log(
  `docker run -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${flattenCmd}"`
);
console.log("");

console.log("=== Step 3: Convert to COG ===");
console.log(`
docker run -v $(pwd):/app rio-cogeo:latest bash -c "rio cogeo create --web-optimized --add-mask --allow-intermediate-compression --overview-resampling average --resampling average ${output} ${output.replace(
  ".tif",
  "_cog.tif"
)}"
`);
console.log("");

console.log("=== Step 2: Validate COG ===");
console.log(`
docker run -v $(pwd):/app rio-cogeo:latest bash -c "rio cogeo validate ${output.replace(
  ".tif",
  "_cog.tif"
)}"
`);
