import multer from "multer";
import {
  BACKUP_LOCATIONS,
  BACKUP_UPLOAD_MAX_SIZE,
} from "../resources/constants";
import AdmZip from "adm-zip";
import { logger } from "../../../logger";

export const logsPath = `${__dirname}/../../../logs/`;
export const allLogsPath = `${logsPath}all/`;

export const uploadFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, BACKUP_LOCATIONS.manual);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: BACKUP_UPLOAD_MAX_SIZE },
});

/**
 *
 * @param name zip filename
 * @param filenames optional array of filenames to zip instead of all files
 */
export function createZipArchive(
  filesPath: string,
  destinationPath: string,
  name: string,
  filenames?: string[]
) {
  try {
    const zip = new AdmZip();
    {
      filenames
        ? filenames.forEach(file => {
            zip.addLocalFile(filesPath + file);
          })
        : zip.addLocalFolder(filesPath);
    }
    zip.writeZip(destinationPath + name);
    logger.info(`Created ${name} successfully`);
  } catch (error) {
    logger.error(`Could not create zip file. ${error}`);
  }
}
