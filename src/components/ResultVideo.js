'use client';
import SparklesIcon from "@/components/SparklesIcon";
import {transcriptionItemsToSrt} from "@/libs/awsTranscriptionHelpers";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {toBlobURL, fetchFile} from "@ffmpeg/util";
import {useEffect, useState, useRef} from "react";
import roboto from './../fonts/Roboto-Regular.ttf';
import robotoBold from './../fonts/Roboto-Bold.ttf';

export default function ResultVideo({filename,transcriptionItems}) {
  const videoUrl = "https://prateek-caption-generator.s3.us-east-1.amazonaws.com/"+filename;
  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [progress, setProgress] = useState(1);
  const ffmpegRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      // Initialize FFmpeg only in the browser
      ffmpegRef.current = new FFmpeg();
      load();
    }
  }, []);

  const load = async () => {
    if (!ffmpegRef.current) return;
    
    const ffmpeg = ffmpegRef.current;
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    try {
      await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto));
      await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold));
      console.log('Fonts loaded successfully');
    } catch (error) {
      console.warn('Could not load custom fonts, using defaults:', error);
    }
    
    setLoaded(true);
  }

  function toFFmpegColor(rgb) {
    const bgr = rgb.slice(5,7) + rgb.slice(3,5) + rgb.slice(1,3);
    return '&H' + bgr + '&';
  }

    const transcode = async () => {
    if (!ffmpegRef.current || !loaded) {
      console.error('FFmpeg not loaded yet');
      return;
    }
    
    try {
      const ffmpeg = ffmpegRef.current;
      const srt = transcriptionItemsToSrt(transcriptionItems);
      
      console.log('Generated SRT:', srt);
      console.log('Transcription items:', transcriptionItems);
      
      // Use the proxy API for FFmpeg processing to avoid CORS
      const proxyVideoUrl = `/api/video?filename=${filename}`;
      await ffmpeg.writeFile(filename, await fetchFile(proxyVideoUrl));
      await ffmpeg.writeFile('subs.srt', srt);
      
      console.log('Files written to FFmpeg');
      
      // Get video duration for progress tracking
      videoRef.current.src = videoUrl;
      await new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = resolve;
        videoRef.current.onerror = reject;
      });
      const duration = videoRef.current.duration;
      
      console.log('Video duration:', duration);
      
      // Set up progress tracking
      ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg log:', message);
        const regexResult = /time=([0-9:.]+)/.exec(message);
        if (regexResult && regexResult?.[1]) {
          const howMuchIsDone = regexResult?.[1];
          const [hours,minutes,seconds] = howMuchIsDone.split(':');
          const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
          const videoProgress = doneTotalSeconds / duration;
          setProgress(videoProgress);
        }
      });
      
      // Use subtitle filter with font directory
      const subtitleFilter = `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},OutlineColour=${toFFmpegColor(outlineColor)}'`;
      
      console.log('Using subtitle filter:', subtitleFilter);
      
      await ffmpeg.exec([
        '-i', filename,
        '-preset', 'ultrafast',
        '-vf', subtitleFilter,
        'output.mp4'
      ]);
      
      console.log('FFmpeg processing completed');
      
      const data = await ffmpeg.readFile('output.mp4');
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
      setProgress(1);
      
      console.log('Video with captions loaded successfully');
      
    } catch (error) {
      console.error('Error during transcode:', error);
      setProgress(1);
    }
  }

  return (
    <>
      <div className="mb-4">
        <button
          onClick={transcode}
          disabled={!loaded}
          className={`py-2 px-6 rounded-full inline-flex gap-2 border-2 border-purple-700/50 ${
            loaded 
              ? 'bg-green-600 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}>
          <SparklesIcon />
          <span>{loaded ? 'Apply captions' : 'Loading FFmpeg...'}</span>
        </button>
      </div>
      <div>
        primary color:
        <input type="color"
               value={primaryColor}
               onChange={ev => setPrimaryColor(ev.target.value)}/>
        <br />
        outline color:
        <input type="color"
               value={outlineColor}
               onChange={ev => setOutlineColor(ev.target.value)}/>
      </div>
      <div className="rounded-xl overflow-hidden relative">
        {progress && progress < 1 && (
          <div className="absolute inset-0 bg-black/70 flex items-center">
            <div className="w-full text-center">
              <div className="bg-bg-gradient-from/70 mx-8 rounded-lg overflow-hidden relative">
                <div className="bg-bg-gradient-from h-8"
                     style={{width:progress * 100+'%'}}>
                  <h3 className="text-white text-xl absolute inset-0 py-1">
                    {parseInt(progress * 100)}%
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <video
          data-video={0}
          ref={videoRef}
          controls>
        </video>
      </div>
    </>
  );
}