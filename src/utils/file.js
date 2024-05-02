import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function deleteFile(filePath, callback) {
    const imagePath = filePath; // Assuming `filePath` already contains the correct absolute path
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("Error in Deleting File", err);
        } else {
            console.log("File Deleted Successfully");
        }
        // Check if callback is provided and is a function before calling it
        if (typeof callback === 'function') {
            callback(err); // Pass the error (if any) to the callback
        }
    });
}

export { deleteFile };
