# AI Product Studio 🎨

### AI-Powered Product Image Creation, Editing & Media Studio

AI Product Studio is an all-in-one platform designed to help businesses, creators, and online sellers create and enhance professional product visuals using AI and Cloudinary.

Instead of switching between multiple tools for image editing, background removal, cropping, and promotional content creation, users can access these features from one platform.

## 🚀 Features

* **Image Generator:** Generate product images from text prompts using Cloudinary.
* **Background Remover:** Remove unwanted backgrounds from product images.
* **Smart Crop:** Crop and resize images for different platforms and aspect ratios.
* **Image Enhancement:** Improve image delivery quality with automatic optimization.
* **Video Ad Creator:** Create short promotional video slideshows from product images.
* **Product Management:** Upload, store, and manage product images and details.
* **Cloudinary Integration:** Upload, transform, optimize, and deliver media using Cloudinary.
* **Modern Dashboard:** A simple interface to access creative tools and manage products.

## 🛠️ Tech Stack

**Frontend**

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React

**Backend**

* Next.js API Routes
* Node.js
* MongoDB
* Mongoose

**Media & AI**

* Cloudinary
* Cloudinary Image Transformations
* Cloudinary Text-to-Image Generation

## ☁️ How Cloudinary Is Used

Cloudinary is the core media platform used by AI Product Studio to handle product images and creative media workflows.

* **Image Upload:** Product images are uploaded and stored in Cloudinary.
* **Image Transformation:** Images can be cropped, resized, and processed for different uses.
* **Image Optimization:** Automatic quality and format settings help deliver optimized images.
* **Image Generation:** Cloudinary's text-to-image workflow generates visuals from user prompts.
* **Image Delivery:** Cloudinary provides hosted image URLs for use throughout the application.

This integration helps simplify media management and reduces the need to build a separate image-storage and delivery system.

## 💡 Problem Statement

Creating professional product visuals can be time-consuming and may require multiple editing applications, technical skills, and additional resources.

Small businesses, online sellers, and content creators may not have access to professional design tools or dedicated design teams.

AI Product Studio brings several product-image and media workflows into one platform, making it easier to create, edit, organize, and deliver product visuals.

## 🎯 Our Solution

AI Product Studio provides a unified workspace where users can generate product images, remove backgrounds, crop images, enhance visuals, manage products, and create promotional video content.

By integrating Cloudinary into these workflows, the platform makes image handling and delivery easier and more efficient.

## 🖥️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB (cloud-hosted for deployment or local for development)
* A Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/Dgd456sfh/studio.git
```

### 2. Navigate to the Project

```bash
cd studio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and add your own credentials:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your actual credentials. Never commit `.env.local` or expose API secrets publicly.

For Vercel deployment, configure these variables in your project's Environment Variables settings. Use a cloud-hosted MongoDB URI because Vercel cannot access a database running on your personal computer.

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for Production

```bash
npm run build
```

## 📂 Project Structure

```text
studio/
├── app/
│   ├── api/
│   │   ├── enhance/
│   │   ├── generate-ad/
│   │   ├── products/
│   │   ├── remove-background/
│   │   ├── smart-crop/
│   │   └── test-db/
│   ├── dashboard/
│   ├── products/
│   ├── studio/
│   │   ├── ad-creator/
│   │   ├── background-remover/
│   │   ├── prompt-ad/
│   │   └── smart-crop/
│   └── ...
├── lib/
│   ├── cloudinary.ts
│   └── mongodb.ts
├── models/
├── public/
├── .env.local
├── package.json
└── README.md
```

## 🧪 Testing the Project

You can test the main workflows locally:

1. Start the application using `npm run dev`.
2. Open the dashboard and navigate to the available creative tools.
3. Upload a product image and try background removal or smart cropping.
4. Use the Image Generator to generate an image from a prompt.
5. Try image enhancement and create a video slideshow from product images.
6. Upload and manage product information.
7. Verify that uploaded media is stored and delivered through Cloudinary and that product records are saved in MongoDB.

Run `npm run build` to check the production build and TypeScript compilation.

Some features may require valid Cloudinary credentials and account permissions or usage allowance.

## 🌐 Deployment

The application is designed for deployment on Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Test the deployed workflows and database connection.

**GitHub Repository:**
https://github.com/Dgd456sfh/studio

**Live Demo:** https://youtu.be/G92nRJmCpsg?si=FitU-9eGOgWq-MTa

**Demo Video:** Add your 2–4 minute project demonstration link here.

## 🔮 Future Improvements

* User authentication and personalized workspaces
* More AI-powered image editing capabilities
* Additional product-image templates
* Advanced video editing and transitions
* Social media export presets
* Improved product search and media organization

## 🏆 Hackathon Project

**Project:** AI Product Studio
**Track:** Cloudinary AI Hackathon 2026
**Repository:** [Dgd456sfh/studio](https://github.com/Dgd456sfh/studio)

Built to simplify product media creation and management by bringing AI-powered creative workflows and Cloudinary media capabilities together in one place.

## 👩‍💻 Author

**Khushi Manikpuri**

GitHub: [@Dgd456sfh](https://github.com/Dgd456sfh)

---

*AI Product Studio — Where creativity meets AI, powered by Cloudinary.*
