const { initializeApp } = require('firebase/app');
const {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} = require('firebase/storage');

// Model
const { ProductImg } = require('../models/productImg.model');


const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// Storage service
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, postId) => {
	// Map async -> Async operations with arrays
	const imgsPromises = imgs.map(async img => {
		// Create firebase reference
		const [originalName, ext] = img.originalname.split('.'); // -> [pug, jpg]

		const filename = `products/${postId}/${originalName}-${Date.now()}.${ext}`;
		const imgRef = ref(storage, filename);

		// Upload image to Firebase
		const result = await uploadBytes(imgRef, img.buffer);

		await ProductImg.create({
			productId: newProduct.id,
			imgUrl: result.metadata.fullPath
		});
	});

	await Promise.all(imgsPromises);
};

const getProductImgsUrls = async products => {
	// Loop through products to get to the productsImgs
	const productWithImgsPromises = products.map(async product => {
		// Get imgs URLs
		const productImgsPromises = product.productImgs.map(async productImg => {
			const imgRef = ref(storage, productImg.imgUrl);
			const imgUrl = await getDownloadURL(imgRef);

			productImg.imgUrl = imgUrl;
			return productImg;
		});

		// Resolve imgs urls
		const productImgs = await Promise.all(productImgsPromises);

		// Update old postImgs array with new array
		product.productImgs = productImgs;
		return product;
});

return await Promise.all(productWithImgsPromises);
};

module.exports = { storage, uploadProductImgs, getProductImgsUrls };
