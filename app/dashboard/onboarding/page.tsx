'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

interface UploadProgress {
  [key: string]: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [towns, setTowns] = useState<any[]>([]);
  
  // Add new state variables for media
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [demoSongs, setDemoSongs] = useState<File[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>(['', '', '', '']);
  const [recordLabels, setRecordLabels] = useState<any[]>([]);
  const [distributors, setDistributors] = useState<any[]>([]);
  const [newTown, setNewTown] = useState('');
  const [newTownProvince, setNewTownProvince] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newDistributor, setNewDistributor] = useState('');
  const [formData, setFormData] = useState({
    government_name: '',
    artist_name: '',
    date_of_birth: '',
    sa_id_number: '',
    phone_number: '',
    street_address: '',
    suburb: '',
    town_id: '',
    province: '',
    record_label_id: '',
    has_manager: false,
    distributor_id: '',
    samro_member: false,
    samro_id: '',
    cappasso_member: false,
    cappasso_id: '',
    risa_member: false,
    risa_id: '',
    sampra_member: false,
    sampra_id: '',
    artist_bio: '',
    profile_image_url: '',
    gallery_images: [] as string[],
    demo_songs: [] as string[],
    youtube_links: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: townsData } = await supabase
      .from('south_african_towns')
      .select('*')
      .order('name');
    setTowns(townsData || []);

    const { data: labelsData } = await supabase
      .from('record_labels')
      .select('*')
      .order('name');
    setRecordLabels(labelsData || []);

    const { data: distributorsData } = await supabase
      .from('distributors')
      .select('*')
      .order('name');
    setDistributors(distributorsData || []);
  }

  async function createTown() {
    const { data, error } = await supabase
      .from('south_african_towns')
      .insert([{ name: newTown, province: newTownProvince }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setTowns([...towns, data]);
    setNewTown('');
    setNewTownProvince('');
  }

  async function createLabel() {
    const { data, error } = await supabase
      .from('record_labels')
      .insert([{ name: newLabel }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setRecordLabels([...recordLabels, data]);
    setNewLabel('');
  }

  async function createDistributor() {
    const { data, error } = await supabase
      .from('distributors')
      .insert([{ name: newDistributor }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setDistributors([...distributors, data]);
    setNewDistributor('');
  }

  // Helper function to handle file selection
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'gallery' | 'demo'
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'profile' && files[0]) {
      setProfileImage(files[0]);
      const preview = URL.createObjectURL(files[0]);
      setProfileImagePreview(preview);
    } else if (type === 'gallery') {
      const newFiles = Array.from(files).slice(0, 6 - galleryImages.length);
      setGalleryImages([...galleryImages, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    } else if (type === 'demo') {
      const newFiles = Array.from(files).slice(0, 5 - demoSongs.length);
      setDemoSongs([...demoSongs, ...newFiles]);
    }
  };

  // Helper function to remove files
  const removeFile = (
    index: number,
    type: 'gallery' | 'demo' | 'youtube'
  ) => {
    if (type === 'gallery') {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
      setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    } else if (type === 'demo') {
      setDemoSongs(demoSongs.filter((_, i) => i !== index));
    } else if (type === 'youtube') {
      setYoutubeLinks(youtubeLinks.map((link, i) => i === index ? '' : link));
    }
  };

  // Helper function to upload files to Supabase storage
  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    // Create unique key for this upload
    const uploadKey = `${bucket}-${fileName}`;
    setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        onUploadProgress: (progress) => {
          if (progress.totalBytes > 0) {
            const percent = (progress.bytesUploaded / progress.totalBytes) * 100;
            setUploadProgress(prev => ({ ...prev, [uploadKey]: percent }));
          }
        },
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return { url: publicUrl, key: uploadKey };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload profile image
        let profileImageUrl = '';
        if (profileImage) {
        const { url } = await uploadFile(profileImage, 'profile-images');
        profileImageUrl = url;
        }

        // Upload gallery images
        const galleryResults = await Promise.all(
        galleryImages.map(file => uploadFile(file, 'gallery-images'))
        );
        const galleryUrls = galleryResults.map(result => result.url);

        // Upload demo songs
        const songResults = await Promise.all(
        demoSongs.map(file => uploadFile(file, 'demo-songs'))
        );
        const songUrls = songResults.map(result => result.url);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          profile_image_url: profileImageUrl,
          gallery_images: galleryUrls,
          demo_songs: songUrls,
          youtube_links: youtubeLinks.filter(link => link),
          registration_complete: true
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
      <div
        className="bg-red-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
  console.log("TOWNS", towns)
  console.log("record Labels", recordLabels)
  console.log("distributors", distributors)
  return (
    <div className="min-h-screen bg-black p-8 ">
      <div className="max-w-3xl mx-auto my-20">
        <h1 className="text-3xl font-bold text-white mb-8">
          Complete Your Artist Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="government_name">Government Full Name</Label>
                <Input
                  id="government_name"
                  value={formData.government_name}
                  onChange={(e) => setFormData({...formData, government_name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="artist_name">Artist Name</Label>
                <Input
                  id="artist_name"
                  value={formData.artist_name}
                  onChange={(e) => setFormData({...formData, artist_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sa_id_number">SA ID Number</Label>
                <Input
                  id="sa_id_number"
                  value={formData.sa_id_number}
                  onChange={(e) => setFormData({...formData, sa_id_number: e.target.value})}
                  required
                  pattern="[0-9]{13}"
                  title="Please enter a valid 13-digit South African ID number"
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Address Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  value={formData.suburb}
                  onChange={(e) => setFormData({...formData, suburb: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => setFormData({...formData, province: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES?.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="town">Town</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.town_id}
                      onValueChange={(value) => setFormData({...formData, town_id: value})}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select town" />
                      </SelectTrigger>
                      <SelectContent>
                        {towns?.map((town) => (
                          <SelectItem key={town.id} value={town.id}>
                            {town.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Add Town</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Town</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className='my-4'>Town Name</Label>
                            <Input
                              value={newTown}
                              onChange={(e) => setNewTown(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className='my-4'>Province</Label>
                            <Select
                              value={newTownProvince}
                              onValueChange={setNewTownProvince}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                              <SelectContent>
                                {PROVINCES?.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={createTown}>Add Town</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className='my-4 text-gray-400 text-xs'>Click "Add town" if you dont see your town from this list</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Professional Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label className='my-4'>Record Label</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.record_label_id}
                    onValueChange={(value) => setFormData({...formData, record_label_id: value})}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select record label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Independant">I am Independent</SelectItem>
                      {recordLabels?.map((label) => (
                        <SelectItem key={label.id} value={label.id}>
                          {label.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Label</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Record Label</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className='my-4'>Label Name</Label>
                          <Input
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                          />
                        </div>
                        <Button onClick={createLabel}>Add Label</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className='my-4 text-gray-400 text-xs'>Click "Add Label" if you dont see your label from this list</p>
                
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="has_manager"
                  checked={formData.has_manager}
                  onCheckedChange={(checked) => setFormData({...formData, has_manager: checked})}
                />
                <Label htmlFor="has_manager">I have a manager</Label>
              </div>

              <div>
                <Label className='my-4'>Distributor</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.distributor_id}
                    onValueChange={(value) => setFormData({...formData, distributor_id: value})}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select distributor" />
                    </SelectTrigger>
                    <SelectContent>
                      {distributors?.map((distributor) => (
                        <SelectItem key={distributor.id} value={distributor.id}>
                          {distributor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Distro</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Distributor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className='my-4'>Distributor Name</Label>
                          <Input
                            value={newDistributor}
                            onChange={(e) => setNewDistributor(e.target.value)}
                          />
                        </div>
                        <Button onClick={createDistributor}>Add Distro</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <p className='my-4 text-gray-400 text-xs'>Click "Add Distro" if you dont see your distro from this list</p>
                
            </div>
          </div>

          {/* Memberships */}
          <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Organization Memberships
            </h2>
            
            <div className="space-y-6">
              {/* SAMRO */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="samro_member"
                    checked={formData.samro_member}
                    onCheckedChange={(checked) => setFormData({...formData, samro_member: checked})}
                  />
                  <Label htmlFor="samro_member">SAMRO Member</Label>
                </div>
                {formData.samro_member && (
                  <Input
                    placeholder="SAMRO Membership ID"
                    value={formData.samro_id}
                    onChange={(e) => setFormData({...formData, samro_id: e.target.value})}
                  />
                )}
              </div>

              {/* CAPPASSO */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cappasso_member"
                    checked={formData.cappasso_member}
                    onCheckedChange={(checked) => setFormData({...formData, cappasso_member: checked})}
                  />
                  <Label htmlFor="cappasso_member">CAPPASSO Member</Label>
                </div>
                {formData.cappasso_member && (
                  <Input
                    placeholder="CAPPASSO Membership ID"
                    value={formData.cappasso_id}
                    onChange={(e) => setFormData({...formData, cappasso_id: e.target.value})}
                  />
                )}
              </div>

              {/* RISA */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="risa_member"
                    checked={formData.risa_member}
                    onCheckedChange={(checked) => setFormData({...formData, risa_member: checked})}
                  />
                  <Label htmlFor="risa_member">RISA Member</Label>
                </div>
                {formData.risa_member && (
                  <Input
                    placeholder="RISA Membership ID"
                    value={formData.risa_id}
                    onChange={(e) => setFormData({...formData, risa_id: e.target.value})}
                  />
                )}
              </div>

              {/* SAMPRA */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sampra_member"
                    checked={formData.sampra_member}
                    onCheckedChange={(checked) => setFormData({...formData, sampra_member: checked})}
                  />
                  <Label htmlFor="sampra_member">SAMPRA Member</Label>
                </div>
                {formData.sampra_member && (
                  <Input
                    placeholder="SAMPRA Membership ID"
                    value={formData.sampra_id}
                    onChange={(e) => setFormData({...formData, sampra_id: e.target.value})}
                  />
                )}
              </div>
            </div>
          </div>

            {/* Media Upload Section */}
            <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Media Upload
            </h2>
            
            {/* Profile Image Upload */}
        

            <div className="space-y-4">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'profile')}
              />
              {profileImagePreview && (
                <div className="relative w-20 h-20">
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                </div>
              )}
              </div>
              {uploadProgress['profile-images'] && (
              <ProgressBar progress={uploadProgress['profile-images']} />
              )}
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-4">
              <Label>Gallery Images (Up to 6)</Label>
              <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'gallery')}
              disabled={galleryImages.length >= 6}
              />
              <div className="grid grid-cols-3 gap-4">
                {galleryPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                  src={preview}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile(index, 'gallery')}
                  >
                  X
                  </Button>
                  {uploadProgress[`gallery-images-${index}`] && (
                  <ProgressBar progress={uploadProgress[`gallery-images-${index}`]} />
                  )}
                </div>
                ))}
              </div>
            </div>

            {/* Artist Bio */}
            <div className="space-y-4">
              <Label>Artist Bio</Label>
              <Textarea
              value={formData.artist_bio}
              onChange={(e) => setFormData({...formData, artist_bio: e.target.value})}
              placeholder="Tell us about yourself..."
              className="h-32"
              />
            </div>

            {/* YouTube Links */}
            <div className="space-y-4"></div>
              <Label>YouTube Links (Up to 4)</Label>
              {youtubeLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                value={link}
                onChange={(e) => {
                  const newLinks = [...youtubeLinks];
                  newLinks[index] = e.target.value;
                  setYoutubeLinks(newLinks);
                }}
                placeholder="YouTube URL"
                />
                <Button
                variant="destructive"
                onClick={() => removeFile(index, 'youtube')}
                >
                X
                </Button>
              </div>
              ))}
            </div>

            {/* Demo Songs Upload */}
            <div className="space-y-4">
              <Label>Demo Songs (Up to 5 MP3s)</Label>
              <Input
              type="file"
              accept=".mp3"
              multiple
              onChange={(e) => handleFileSelect(e, 'demo')}
              disabled={demoSongs.length >= 5}
              />
              <div className="space-y-2">
                {demoSongs.map((song, index) => (
                <div key={index} className="flex flex-col bg-zinc-800 p-2 rounded">
                  <div className="flex items-center justify-between">
                  <span>{song.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile(index, 'demo')}
                  >
                    X
                  </Button>
                  </div>
                  {uploadProgress[`demo-songs-${index}`] && (
                  <ProgressBar progress={uploadProgress[`demo-songs-${index}`]} />
                  )}
                </div>
                ))}
              </div>
            </div>

            {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </Button>
        </form>
      </div>
    </div>
  );
}