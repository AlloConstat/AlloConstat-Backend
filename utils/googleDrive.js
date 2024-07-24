const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const credentials = require('../config/credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, '../token.json');

async function authorize() {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = fs.readFileSync(TOKEN_PATH, 'utf8');
        oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
        console.error('Error loading token:', err);
        await getNewToken(oAuth2Client);
    }
    return oAuth2Client;
}

function getNewToken(oAuth2Client) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return reject('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                console.log('Token stored to', TOKEN_PATH);
                resolve(oAuth2Client);
            });
        });
    });
}

async function createFolder(auth) {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        'name': 'testPDF',
        'mimeType': 'application/vnd.google-apps.folder'
    };
    try {
        const folder = await drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        });
        console.log('Folder ID:', folder.data.id);
        return folder.data.id;
    } catch (err) {
        console.error('Error creating folder:', err);
        throw err;
    }
}

async function uploadFile(filePath, fileName) {
    const auth = await authorize();
    const drive = google.drive({ version: 'v3', auth });

    // Create the folder and get its ID
    let folderId;
    try {
        folderId = await createFolder(auth);
    } catch (err) {
        console.error('Error creating folder, using existing ID:', err);
        folderId = 'existing-folder-id'; // Replace with your existing folder ID if needed
    }

    const fileMetadata = {
        'name': fileName,
        'parents': [folderId] // Use the ID of the created or existing folder
    };

    const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath),
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log('File ID:', response.data.id);
        return `https://drive.google.com/file/d/${response.data.id}/view`;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
}

module.exports = { uploadFile };
