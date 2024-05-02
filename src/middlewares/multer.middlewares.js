import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      let uploadPath = '';

      // Determine the upload path based on the file type
      if (file.mimetype.startsWith('image/')) {
          uploadPath = './public/uploads/images';
      }  else {
          // For other file types, use the default './uploads' directory
          uploadPath = './public/uploads';
      }

      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, new Date(Date.now()).valueOf() + file.originalname);
  }
});

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
//     }
// };

// const multerConfig = {
//     upload: multer({ storage: storage, fileFilter: fileFilter })
// };

const multerConfig = {
    upload: multer({ storage: storage })
};

export default multerConfig;
