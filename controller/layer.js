import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import { create } from 'domain';
import { type } from 'os';
const GEOSERVER_URL = "http://localhost:8084/geoserver";
const GEOSERVER_USER = "admin";
const GEOSERVER_PASSWORD = "geoserver";
const WORKSPACE = "HienTrangSDD";

const auth = {
    username: GEOSERVER_USER,
    password: GEOSERVER_PASSWORD
};

async function uploadGeoTIFF(filePath, layerName) {
    try {
        const data = fs.readFileSync(filePath);
        const response = await axios.put(
            `${GEOSERVER_URL}/rest/workspaces/${WORKSPACE}/coveragestores/${layerName}/file.geotiff`,
            data,
            {
                headers: { 'Content-Type': 'image/tiff' },
                auth
            }
        );
        if (response.status !== 201) {
            throw new Error(`Failed to upload GeoTIFF: ${response.data}`);
        }
    } catch (error) {
        console.error(`Error uploading GeoTIFF: ${error.message}`);
    }
}
async function uploadShapefile(filePath, layerName) {
    try {

        let data = fs.readFileSync(filePath);
        let file_name = path.basename(filePath)
        let layer_name = file_name.split(".")[0]
        const response = await axios.put(
            `${GEOSERVER_URL}/rest/workspaces/HienTrangSDD1/datastores/${layerName}/file.shp`,
            data,
            {
                headers: { 'Content-Type': 'application/zip' },
                auth
            }
        );
        await changeLayerName(layerName, layer_name, layerName)
        if (response.status !== 201 && response.status !== 200) {
            throw new Error(`Failed to upload Shapefile: ${response.data}`);
        }

        console.log(`Shapefile '${layerName}' uploaded successfully.`);

    } catch (error) {
        console.error(`Error uploading Shapefile: ${error.message}`);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
    }
}
async function changeLayerName(storeName, layerName, newLayerName) {
    const url = `${GEOSERVER_URL}/rest/workspaces/HienTrangSDD1/datastores/${storeName}/featuretypes/${layerName}.json`;
    const data = {
        featureType: {
            name: newLayerName
        }
    };

    try {
        const response = await axios.put(url, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            auth
        });
        console.log('Layer name changed successfully:', response.data);
    } catch (error) {
        console.error('Failed to change layer name:', error);
    }
}
async function uploadStyle(filePath, styleName) {
    try {
        const data = await readFile(filePath, 'utf8');
        const response = await axios.post(
            `${GEOSERVER_URL}/rest/workspaces/${WORKSPACE}/styles`,
            data,
            {
                headers: { 'Content-Type': 'application/vnd.ogc.sld+xml' },
                auth,
                params: { name: styleName }
            }
        );
        if (response.status !== 201) {
            throw new Error(`Failed to upload style: ${response.data}`);
        }
        console.log('Style uploaded successfully.');
    } catch (error) {
        console.error(`Error uploading style: ${error.message}`);
    }
}
async function applyStyleToLayer(layerName, styleName) {
    try {
        const response = await axios.put(
            `${GEOSERVER_URL}/rest/layers/${WORKSPACE}:${layerName}`,
            `<layer><defaultStyle><name>${styleName}</name></defaultStyle></layer>`,
            {
                headers: { 'Content-Type': 'application/xml' },
                auth
            }
        );
        if (response.status !== 200) {
            throw new Error(`Failed to apply style: ${response.data}`);
        }
        console.log('Style applied to layer successfully.');
    } catch (error) {
        console.error(`Error applying style to layer: ${error.message}`);
    }
}
const upload = async (req, res) => {
    try {
        const style = `F:/Webgis-server/uploads/${req.files[0].originalname}`;
        const geoTiffPath = `F:/Webgis-server/uploads/${req.files[1].originalname}`;
        const geoShapefile = `F:/Webgis-server/uploads/${req.files[2].originalname}`;
        const layerName = req.body.layer_name
        const styleName = `${layerName}_style`
        await uploadStyle(style, styleName);
        await uploadGeoTIFF(geoTiffPath, layerName);
        await applyStyleToLayer(layerName, styleName);
        await uploadShapefile(geoShapefile, layerName);
        res.status(200).json({
            message: "Add SuccessFull!!!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Add fail!!!"
        })
    }
};
const getAllLayer = async (req, res) => {
    const url = `http://localhost:8084/geoserver/rest/layers.json`;
    const response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
        auth
    });
    const layers = response.data.layers.layer;
    let data = []
    for (const layer of layers) {
        let arr = layer.name.split(":")
        const url = `http://localhost:8084/geoserver/rest/layers/${layer.name}.json`;
        const response = await axios.get(url, {
            auth
        });
        const layer_data = response.data.layer
        data.push({
            workspace: arr[0],
            name: arr[1],
            type: layer_data.type,
            created: formatDateTime(layer_data.dateCreated)
        })
    };
    res.json(data)
};
function formatDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);

    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();

    const formattedDateTime = `${hours}:${minutes} UTC ${day}-${month}-${year}`;
    return formattedDateTime;
}
async function deleteLayer(req, res) {
    const workspace = req.params.workspace
    const layerName = req.params.name
    const url = `${GEOSERVER_URL}/rest/layers/${workspace}:${layerName}`;
    // try {
    //     await axios.delete(url, {
    //         auth
    //     });
    // } catch (error) {

    // }
    console.log('OKK');
}

export default {
    upload,
    getAllLayer,
    deleteLayer
};