#!/usr/bin/env python3
"""
Fetch real YouTube videos from the RusingAcademy/Barholex channel
Channel ID: UC5aSvb7pDEdq8DadPD94qxw
"""

import sys
import json
from typing import Dict, Any, Optional

sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

def get_youtube_channel_videos(
    channel_id: str,
    filter_type: str = "videos_latest",
    cursor: Optional[str] = None,
    language: str = "en",
    country: str = "CA"
) -> Dict[str, Any]:
    """Fetch videos from a YouTube channel."""
    client = ApiClient()
    
    query_params = {
        'id': channel_id,
        'filter': filter_type,
        'hl': language,
        'gl': country
    }
    
    if cursor:
        query_params['cursor'] = cursor
    
    try:
        response = client.call_api('Youtube/get_channel_videos', query=query_params)
        return response
    except Exception as e:
        print(f"Error calling API: {str(e)}")
        return {}

def format_duration(seconds: int) -> str:
    """Convert seconds to MM:SS format."""
    if seconds == 0:
        return "0:00"
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes}:{secs:02d}"

def format_views(views: int) -> str:
    """Format view count."""
    if views >= 1000000:
        return f"{views/1000000:.1f}M"
    elif views >= 1000:
        return f"{views/1000:.1f}K"
    return str(views)

def main():
    channel_id = "UC5aSvb7pDEdq8DadPD94qxw"
    
    results = {
        "shorts": [],
        "videos": []
    }
    
    # Fetch shorts
    print("Fetching YouTube Shorts...")
    shorts_result = get_youtube_channel_videos(
        channel_id=channel_id,
        filter_type="shorts_latest"
    )
    
    if shorts_result:
        contents = shorts_result.get('contents', [])
        print(f"Found {len(contents)} shorts")
        
        for item in contents[:12]:  # Get up to 12 shorts
            if item.get('type') == 'video':
                video = item.get('video', {})
                thumbnails = video.get('thumbnails', [])
                thumbnail_url = thumbnails[0].get('url', '') if thumbnails else ''
                
                short_data = {
                    "id": video.get('videoId', ''),
                    "title": video.get('title', ''),
                    "thumbnail": thumbnail_url,
                    "views": format_views(video.get('stats', {}).get('views', 0)),
                    "viewsRaw": video.get('stats', {}).get('views', 0),
                    "publishedTime": video.get('publishedTimeText', ''),
                    "isShort": True
                }
                results["shorts"].append(short_data)
                print(f"  - {short_data['title'][:50]}... ({short_data['views']} views)")
    
    # Fetch regular videos
    print("\nFetching regular videos...")
    videos_result = get_youtube_channel_videos(
        channel_id=channel_id,
        filter_type="videos_latest"
    )
    
    if videos_result:
        contents = videos_result.get('contents', [])
        print(f"Found {len(contents)} videos")
        
        for item in contents[:12]:  # Get up to 12 videos
            if item.get('type') == 'video':
                video = item.get('video', {})
                thumbnails = video.get('thumbnails', [])
                thumbnail_url = thumbnails[0].get('url', '') if thumbnails else ''
                
                video_data = {
                    "id": video.get('videoId', ''),
                    "title": video.get('title', ''),
                    "thumbnail": thumbnail_url,
                    "duration": format_duration(video.get('lengthSeconds', 0)),
                    "durationSeconds": video.get('lengthSeconds', 0),
                    "views": format_views(video.get('stats', {}).get('views', 0)),
                    "viewsRaw": video.get('stats', {}).get('views', 0),
                    "publishedTime": video.get('publishedTimeText', ''),
                    "isShort": False
                }
                results["videos"].append(video_data)
                print(f"  - {video_data['title'][:50]}... ({video_data['duration']}, {video_data['views']} views)")
    
    # Save results to JSON file
    output_path = "/home/ubuntu/rusingacademy-ecosystem/scripts/youtube-videos-data.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nResults saved to {output_path}")
    print(f"Total: {len(results['shorts'])} shorts, {len(results['videos'])} videos")

if __name__ == "__main__":
    main()
