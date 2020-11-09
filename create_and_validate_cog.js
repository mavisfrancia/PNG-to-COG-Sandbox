const calibrationConfigs = require("./calibrationConfigs.json");

const input = "site_plan_lg.png";
const output = "site_plan.tif";
const width = 16800;
const height = 12000;

const bounds = calibrationConfigs.sitePlan.cornerPoints;

const cmd = `
gdal_translate -of GTiff -a_srs EPSG:4326 \
  -gcp 0 0 ${bounds[0].lng} ${bounds[0].lat} \
  -gcp ${width} 0 ${bounds[1].lng} ${bounds[1].lat} \
  -gcp ${width} ${height} ${bounds[2].lng} ${bounds[2].lat} \
  -gcp 0 ${height} ${bounds[3].lng} ${bounds[3].lat} \
  /app/${input} /app/${output.replace(".tif", "_intermediate.tif")}
`.trim();

console.log("=== Step 1: Create Geotiff ===");
console.log(
  `docker run --rm -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${cmd}"`
);
console.log("");

console.log("=== Step 2: Flatten Geotiff ===");
const flattenCmd = `gdalwarp -t_srs EPSG:4326 /app/${output.replace(
  ".tif",
  "_intermediate.tif"
)} /app/${output}`;
console.log(
  `docker run --rm -v $(pwd):/app osgeo/gdal:ubuntu-full-3.1.2 bash -c "${flattenCmd}"`
);
console.log("");

console.log("=== Step 3: Convert to COG ===");
console.log(`
docker run --rm -v $(pwd):/app rio-cogeo:latest bash -c "rio cogeo create --web-optimized --add-mask --allow-intermediate-compression --overview-resampling average --resampling average ${output} ${output.replace(
  ".tif",
  "_cog.tif"
)}"
`);
console.log("");

console.log("=== Step 2: Validate COG ===");
console.log(`
docker run --rm -v $(pwd):/app rio-cogeo:latest bash -c "rio cogeo validate ${output.replace(
  ".tif",
  "_cog.tif"
)}"
`);
