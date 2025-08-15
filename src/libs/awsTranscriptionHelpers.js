export function clearTranscriptionItems(items) {
    console.log('clearTranscriptionItems called with:', items);
    console.log('Number of input items:', items.length);
    
    // First pass: merge items without start_time
    items.forEach((item, key) => {
      if (!item.start_time) {
        console.log('Found item without start_time at index:', key, item);
        const prev = items[key - 1];
        if (prev && prev.alternatives && prev.alternatives[0]) {
          prev.alternatives[0].content += item.alternatives[0].content;
          console.log('Merged content with previous item');
          delete items[key];
        }
      }
    });
    
    // Second pass: map to clean format
    const result = items.filter(item => !!item).map(item => {
      const {start_time, end_time} = item;
      const content = item.alternatives[0].content;
      const processed = {start_time, end_time, content};
      console.log('Processed item:', processed);
      return processed;
    });
    
    console.log('Final processed items:', result);
    console.log('Number of final items:', result.length);
    
    return result;
  }
  
  function secondsToHHMMSSMS(timeString) {
    const d = new Date(parseFloat(timeString) * 1000);
    return d.toISOString().slice(11,23).replace('.', ',');
  }
  
  export function transcriptionItemsToSrt(items) {
    console.log('transcriptionItemsToSrt called with:', items);
    console.log('Number of items to convert:', items.length);
    
    let srt = '';
    let i = 1;
    
    items.filter(item => !!item).forEach((item, index) => {
      console.log(`Processing item ${index + 1}:`, item);
      
      // seq
      srt += i + "\n";
      
      // timestamps
      const {start_time, end_time} = item; // 52.345
      const startTime = secondsToHHMMSSMS(start_time);
      const endTime = secondsToHHMMSSMS(end_time);
      
      console.log(`Time range: ${startTime} --> ${endTime}`);
      
      srt += startTime + ' --> ' + endTime + "\n";
  
      // content
      console.log(`Content: "${item.content}"`);
      srt += item.content + "\n";
      srt += "\n";
      i++;
    });
    
    console.log('Final SRT content:');
    console.log(srt);
    
    return srt;
  }
  
  // Alternative: Create ASS subtitle format which might work better
  export function transcriptionItemsToAss(items) {
    console.log('transcriptionItemsToAss called with:', items);
    
    let ass = '[Script Info]\n';
    ass += 'Title: Generated Captions\n';
    ass += 'ScriptType: v4.00+\n';
    ass += 'PlayResX: 480\n';
    ass += 'PlayResY: 852\n';
    ass += 'WrapStyle: 1\n';
    ass += 'ScaledBorderAndShadow: yes\n\n';
    
    ass += '[V4+ Styles]\n';
    ass += 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
    ass += 'Style: Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1\n\n';
    
    ass += '[Events]\n';
    ass += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
    
    items.filter(item => !!item).forEach((item, index) => {
      const startTime = secondsToHHMMSSMS(item.start_time);
      const endTime = secondsToHHMMSSMS(item.end_time);
      
      // Convert SRT time format to ASS time format (H:MM:SS.cc)
      const startAss = startTime.replace(',', '.');
      const endAss = endTime.replace(',', '.');
      
      ass += `Dialogue: 0,${startAss},${endAss},Default,,0,0,0,,${item.content}\n`;
    });
    
    console.log('Generated ASS content:', ass);
    return ass;
  }