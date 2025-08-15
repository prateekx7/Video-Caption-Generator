# 🎬 Video Caption Generator

An AI-powered web application that automatically generates captions for videos using AWS Transcribe API and provides a user-friendly interface for editing and applying captions.

## ✨ Features

- **🎥 Video Upload**: Upload videos directly to AWS S3
- **🤖 AI Transcription**: Automatic speech-to-text conversion using AWS Transcribe
- **✏️ Caption Editing**: Edit and customize transcription text
- **🎨 Caption Styling**: Customize caption colors and appearance
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Processing**: Live progress tracking for transcription and caption generation

## 🖼️ Screenshots & Demo

### Home Page
![Home Page](public/images/home%20page.png)

### Video Upload Process
![Video Upload](public/images/uploading%20the%20video.png)

### Transcription in Progress
![Transcription Process](public/images/transcribing%20in%20process.png)

### Caption Editing Interface
![Caption Editing](public/images/editable%20caption%20words%20and%20font%20color.png)

### Caption Embedding Process
![Caption Embedding](public/images/embedding%20captions%20in%20the%20video.png)

### Final Result with Captions
![Final Result](public/images/final%20video%20with%20captions%20on%20the%20video.png)

### AWS S3 Storage
![S3 Storage](public/images/Files%20Stored%20in%20S3.png)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Cloud Services**: AWS S3, AWS Transcribe API, AWS IAM
- **Video Processing**: Client-side video processing for caption generation
- **Styling**: Tailwind CSS with custom components


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prateekx7/Video-Caption-Generator.git
   cd Video-Caption-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   BUCKET_NAME=your_s3_bucket_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### AWS Setup

1. **Create S3 Bucket**
   - Create a new S3 bucket for video storage
   - Enable CORS for cross-origin requests
   - Configure lifecycle policies for automatic cleanup

2. **IAM User Setup**
   - Create an IAM user with S3 and Transcribe permissions
   - Generate access keys and add to environment variables

3. **S3 CORS Configuration**
   ```json
   [
       {
           "AllowedHeaders": ["*"],
           "AllowedMethods": ["GET", "POST", "PUT"],
           "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
           "ExposeHeaders": ["ETag"]
       }
   ]
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── transcribe/    # Transcription API
│   │   ├── upload/        # File upload API
│   │   └── video/         # Video proxy API
│   ├── [filename]/        # Dynamic route for video processing
│   └── page.js            # Home page
├── components/             # React components
│   ├── DemoSection.js     # Demo video section
│   ├── PageHeaders.js     # Page header components
│   ├── ResultVideo.js     # Video result display
│   ├── TranscriptionEditor.js # Caption editing interface
│   ├── TranscriptionItem.js   # Individual caption item
│   └── UploadForm.js      # File upload form
└── libs/                  # Utility libraries
    └── awsTranscriptionHelpers.js # AWS transcription utilities
```

## How It Works

1. **Video Upload**: User uploads video through the web interface
2. **S3 Storage**: Video is stored in AWS S3 bucket
3. **Transcription**: AWS Transcribe API processes the video for speech recognition
4. **Caption Generation**: Transcription results are converted to caption format
5. **Editing Interface**: User can edit and customize captions
6. **Final Output**: Processed video with embedded captions

## 🔒 Security Features

- **IAM Authentication**: Secure AWS service access
- **CORS Protection**: Controlled cross-origin resource sharing
- **Environment Variables**: Secure credential management
- **Input Validation**: File type and size validation

## Performance Features

- **Client-side Processing**: Reduces server load
- **Real-time Updates**: Live progress tracking
- **Optimized Storage**: S3 lifecycle policies for cost management
- **Responsive Design**: Optimized for all device sizes


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- AWS Transcribe API for speech recognition
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework


If you have any questions or need help, please open an issue on GitHub or contact me at [your-email@example.com]

---


