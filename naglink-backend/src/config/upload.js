const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Truck image storage
const truckStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/trucks/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'truck-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Loading document storage
const loadingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/loading-docs/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'loading-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Offloading document storage
const offloadingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/offloading-docs/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'offloading-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'));
  }
};


const driverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/drivers");
  },
  filename: function (req, file, cb) {
    cb(null, `driver-${Date.now()}-${file.originalname}`);
  },
});

const uploadDriverImage = multer({
  storage: driverStorage,
});


const uploadTruckImage = multer({ 
  storage: truckStorage, 
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadLoadingDoc = multer({ 
  storage: loadingStorage, 
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadOffloadingDoc = multer({ 
  storage: offloadingStorage, 
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = {
  uploadTruckImage,
  uploadLoadingDoc,
  uploadOffloadingDoc,
  uploadDriverImage,
};