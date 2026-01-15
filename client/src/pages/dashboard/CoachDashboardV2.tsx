import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { 
  User, 
  Video, 
  Calendar, 
  DollarSign, 
  Upload, 
  Check, 
  Loader2,
  Camera,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SmartImage, SmartVideo } from '@/components/media';

// File upload component for images
function ImageUploader({
  currentImage,
  onUpload,
}: {
  currentImage?: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        await handleUpload(file);
      } else {
        setError('Please upload an image file (JPEG, PNG, WebP)');
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [onUpload]
  );

  const handleUpload = async (file: File) => {
    // Validate file size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size exceeds 10 MB. It will be automatically optimized.');
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      await onUpload(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {currentImage && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="Current profile"
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          ) : uploadSuccess ? (
            <Check className="w-8 h-8 text-green-600" />
          ) : (
            <Camera className="w-8 h-8 text-teal-600" />
          )}
        </div>

        <div>
          <p className="text-gray-600 mb-2">
            Drag and drop your photo here, or
          </p>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Upload className="w-4 h-4" />
              Choose a photo
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>

        <p className="text-sm text-gray-400">
          Max 10 MB • JPEG, PNG, or WebP
        </p>

        {error && (
          <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {uploadSuccess && (
          <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            Photo uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
}

// File upload component for videos
function VideoUploader({
  currentVideo,
  onUpload,
}: {
  currentVideo?: { playbackId: string; poster?: string };
  onUpload: (file: File) => Promise<void>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        await handleUpload(file);
      } else {
        setError('Please upload a video file (MP4, MOV)');
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [onUpload]
  );

  const handleUpload = async (file: File) => {
    // Validate file size (2 GB max for coaches)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError('Video size exceeds 2 GB. Please compress your video.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Simulate progress (actual progress would come from Mux upload)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      await onUpload(file);
      setUploadProgress(100);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}
        ${isUploading ? 'opacity-75' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {currentVideo && !isUploading && (
        <div className="mb-4">
          <SmartVideo
            playbackId={currentVideo.playbackId}
            poster={currentVideo.poster}
            title="Your presentation video"
            className="max-w-md mx-auto"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          ) : uploadSuccess ? (
            <Check className="w-8 h-8 text-green-600" />
          ) : (
            <Film className="w-8 h-8 text-purple-600" />
          )}
        </div>

        {isUploading && (
          <div className="max-w-xs mx-auto">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              {uploadProgress < 100
                ? 'Uploading and optimizing your video...'
                : 'Processing complete!'}
            </p>
          </div>
        )}

        {!isUploading && (
          <>
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop your video here, or
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Choose a video
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/mov"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <p className="text-sm text-gray-400">
              Max 2 GB • MP4 or MOV • Will be optimized for streaming
            </p>
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {uploadSuccess && (
          <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            Video uploaded successfully! It may take 2-5 minutes to process.
          </p>
        )}
      </div>
    </div>
  );
}

export default function CoachDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data - would come from API
  const [coachData, setCoachData] = useState({
    profileImage: '/coaches/default-avatar.jpg',
    presentationVideo: null as { playbackId: string; poster?: string } | null,
    upcomingSessions: 3,
    totalEarnings: 1250.00,
  });

  // Redirect if not a coach
  // In production, this would check the user's role from Clerk
  // if (!loading && (!user || user.role !== 'coach')) {
  //   setLocation('/');
  //   return null;
  // }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset', 'coach_card');
    formData.append('folder', 'coaches');

    const response = await fetch('/api/media/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    setCoachData((prev) => ({
      ...prev,
      profileImage: result.data.url,
    }));
  };

  const handleVideoUpload = async (file: File) => {
    // Step 1: Get direct upload URL from Mux
    const createResponse = await fetch('/api/media/upload/video/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passthrough: user?.id }),
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create upload');
    }

    const { data } = await createResponse.json();

    // Step 2: Upload directly to Mux
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    // Step 3: Poll for completion (simplified)
    // In production, use webhooks
    setTimeout(async () => {
      const statusResponse = await fetch(`/api/media/upload/video/status/${data.uploadId}`);
      const status = await statusResponse.json();
      
      if (status.data.assetId) {
        // Would fetch playback ID from asset
        setCoachData((prev) => ({
          ...prev,
          presentationVideo: {
            playbackId: 'placeholder-playback-id',
          },
        }));
      }
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={coachData.profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Coach Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.firstName || 'Coach'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Upcoming Sessions
              </CardTitle>
              <Calendar className="w-5 h-5 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{coachData.upcomingSessions}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${coachData.totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Profile Status
              </CardTitle>
              <User className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">Active</div>
              <p className="text-xs text-gray-500 mt-1">Visible to students</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>
                    Upload a professional photo that will be displayed on your coach profile.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    currentImage={coachData.profileImage}
                    onUpload={handleImageUpload}
                  />
                </CardContent>
              </Card>

              {/* Presentation Video */}
              <Card>
                <CardHeader>
                  <CardTitle>Presentation Video</CardTitle>
                  <CardDescription>
                    Record a short video introducing yourself to potential students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoUploader
                    currentVideo={coachData.presentationVideo || undefined}
                    onUpload={handleVideoUpload}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>My Sessions</CardTitle>
                <CardDescription>
                  View and manage your upcoming coaching sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Session management coming soon</p>
                  <p className="text-sm">Sessions booked via Calendly will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>
                  Track your coaching revenue and payouts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Earnings dashboard coming soon</p>
                  <p className="text-sm">Stripe Connect integration in progress.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
