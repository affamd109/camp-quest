# CampQuest �️  
*CampQuest is a full-stack web application where users can discover, review, and manage campgrounds. This project focuses on the backend architecture
 while also delivering a smooth frontend experience.*  

---

## 📌 **Key Backend Features**  
✔ **RESTful API** with Express.js (MVC architecture)  
✔ **Session-based Auth** using Passport.js  
✔ **Image Uploads** via Cloudinary API  
✔ **Geospatial Data** (MongoDB + MapTiler)  
✔ **Review System**
✔ **Error Handling** (Custom middleware)  


---

## 🛠 **Tech Stack**  
| Category       | Technologies Used          |  
|----------------|---------------------------|  
| **Backend**    | Node.js, Express, Mongoose |  
| **Database**   | MongoDB                   |  
| **Auth**       | Passport.js (session-based) |  
| **APIs**       | Cloudinary, MapTiler      |  


---

## 🚀 **Setup Guide**  
### Prerequisites  
- Node.js v18+  
- MongoDB URI (local or Atlas)  
- Cloudinary API keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`)  
- MapTiler API key (`MAPTILER_KEY`)  

### Installation  
```bash
git clone https://github.com/yourusername/CampQuest.git
cd CampQuest
npm install

```



## 🔧 Configuration

1. Rename `.env.example` to `.env`
2. Add your credentials (get free API keys from the links below):

```env
DATABASE_URL=mongodb://localhost:27017/campquest
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MAPTILER_KEY=your_maptiler_key
SESSION_SECRET=your_secret_phrase

```

# Start in development mode (with nodemon)
npm run dev

# Or start in production mode
npm start




