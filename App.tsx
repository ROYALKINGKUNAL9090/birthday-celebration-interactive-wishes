import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { InteractiveCake } from './InteractiveCake';
import { FloatingBalloons } from './FloatingBalloons';
import { PersonalizedLetter } from './PersonalizedLetter';
import { PhotoGallery } from './PhotoGallery';
import { CustomizerModal } from './CustomizerModal';
import { CelebrationOverlay } from './CelebrationOverlay';

const DEFAULT_PROFILE: BirthdayProfile = {
  name: 'Alex',
  age: 25,
  photoUrl: '',
  headline: 'Happy Birthday, [Name]! 🎉',
  message: 'Wishing you an extraordinary birthday filled with boundless joy, warm laughter, unforgettable surprises, and delicious cake! May all your dreams sparkle brighter than ever this year. Thank you for being such an amazing soul in everyone\'s lives! ❤️✨',
  senderName: 'Your Best Friend',
  birthDate: '2026-08-05',
  theme: 'magic-gold',
  hatStyle: 'crown',
  stickers: ['🎉', '🎂', '✨']
};

export default function App() {
  const [profile, setProfile] = useState<BirthdayProfile>(() => {
    try {
      const saved = localStorage.getItem('birthday_profile_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load local profile", e);
    }
    return DEFAULT_PROFILE;
  });
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Save profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('birthday_profile_v2', JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save profile to storage", e);
    }
  }, [profile]);

  // Auto-play background song on load / first user interaction
  useEffect(() => {
    const startMusicOnInteraction = () => {
      audioEngine.startMusic();
      window.removeEventListener('click', startMusicOnInteraction);
      window.removeEventListener('keydown', startMusicOnInteraction);
      window.removeEventListener('touchstart', startMusicOnInteraction);
    };

    // Try starting directly
    audioEngine.startMusic();

    // Attach listeners for browser autoplay restriction bypass
    window.addEventListener('click', startMusicOnInteraction);
    window.addEventListener('keydown', startMusicOnInteraction);
    window.addEventListener('touchstart', startMusicOnInteraction);

    return () => {
      window.removeEventListener('click', startMusicOnInteraction);
      window.removeEventListener('keydown', startMusicOnInteraction);
      window.removeEventListener('touchstart', startMusicOnInteraction);
    };
  }, []);

  // Check URL hash and query search params for shared parameters
  useEffect(() => {
    const loadSharedWish = async () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        let newProfileData: Partial<BirthdayProfile> = {};

        // 1. API Wish ID check (?id=... or #id=...)
        const searchParams = new URLSearchParams(search);
        const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
        const idParam = searchParams.get('id') || hashParams.get('id');

        if (idParam) {
          try {
            const res = await fetch(`/api/wishes/${idParam}`);
            if (res.ok) {
              const data = await res.json();
              if (data.wish) {
                setProfile((prev) => ({
                  ...prev,
                  ...data.wish
                }));
                return;
              }
            }
          } catch (err) {
            console.warn("Failed to fetch wish by ID", err);
          }
        }

        // 2. JSON hash check (#wish=... or #data=...)
        if (hash.includes('wish=')) {
          const encoded = hash.split('wish=')[1];
          if (encoded) {
            const parsed = JSON.parse(decodeURIComponent(encoded));
            newProfileData = { ...newProfileData, ...parsed };
          }
        } else if (searchParams.get('data') || hashParams.get('data')) {
          const dataParam = searchParams.get('data') || hashParams.get('data');
          if (dataParam) {
            const parsed = JSON.parse(decodeURIComponent(dataParam));
            newProfileData = { ...newProfileData, ...parsed };
          }
        }

        // 3. Fallback URLSearchParams check (individual params like name, photo, etc.)
        const rawParamsString = search.length > 1 ? search.slice(1) : (hash.startsWith('#') ? hash.slice(1) : hash);
        const params = new URLSearchParams(rawParamsString);

        const nameParam = params.get('name');
        const photoParam = params.get('photo') || params.get('photoUrl');
        const ageParam = params.get('age');
        const headlineParam = params.get('headline');
        const messageParam = params.get('message');
        const themeParam = params.get('theme');
        const senderParam = params.get('senderName') || params.get('sender');
        const hatParam = params.get('hatStyle');

        if (nameParam) newProfileData.name = nameParam;
        if (photoParam !== null && photoParam !== undefined) newProfileData.photoUrl = photoParam;
        if (ageParam) newProfileData.age = parseInt(ageParam, 10) || 25;
        if (headlineParam) newProfileData.headline = headlineParam;
        if (messageParam) newProfileData.message = messageParam;
        if (themeParam && THEMES[themeParam as keyof typeof THEMES]) {
          newProfileData.theme = themeParam as BirthdayProfile['theme'];
        }
        if (senderParam) newProfileData.senderName = senderParam;
        if (hatParam) newProfileData.hatStyle = hatParam as BirthdayProfile['hatStyle'];

        if (Object.keys(newProfileData).length > 0) {
          setProfile((prev) => ({
            ...prev,
            ...newProfileData
          }));
        }
      } catch (e) {
        console.warn("Could not parse shared wish parameters:", e);
      }
    };

    loadSharedWish();
  }, []);

  const theme = THEMES[profile.theme];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 transition-colors duration-500 relative overflow-x-hidden`}>
      
      {/* Background Floating Stars / Ambient Light */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header Bar (Clean Top Right Controls) */}
      <Header
        profile={profile}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onTriggerCelebration={() => setIsCelebrationOpen(true)}
      />

      <main className="pb-20">
        
        {/* 1. Hero Profile & Warm Personalized Greeting */}
        <HeroSection
          profile={profile}
          onUpdatePhoto={(url) => setProfile((prev) => ({ ...prev, photoUrl: url }))}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* 2. Interactive Virtual Cake with Blowable Candles */}
        <InteractiveCake
          personName={profile.name}
          age={profile.age}
        />

        {/* 3. Entertaining Floating Balloons to Pop */}
        <FloatingBalloons />

        {/* 4. Heartfelt Personalized Wish Note */}
        <PersonalizedLetter
          profile={profile}
          onUpdateMessage={(msg) => setProfile((prev) => ({ ...prev, message: msg }))}
        />

        {/* 5. Photo Memory Polaroid Gallery */}
        <PhotoGallery
          memories={profile.memories}
          onUpdateMemories={(mems) => setProfile((prev) => ({ ...prev, memories: mems }))}
        />

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-400 bg-slate-950/60 backdrop-blur-md">
        <p className="flex items-center justify-center gap-1">
          Made with love for {profile.name}'s Birthday Celebration
        </p>
      </footer>

      {/* Customizer Drawer / Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
      />

      {/* Fullscreen Fireworks & Blast Celebration Overlay */}
      <CelebrationOverlay
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        personName={profile.name}
      />

    </div>
  );
}