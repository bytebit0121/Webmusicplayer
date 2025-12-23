// Basic playlist
const tracks = [
  {
    title: "Sweet Life",
    artist: "AlexGrohl",
    src: "assets/music/Track_1.mp3",
    cover: "assets/images/Track_1.jpg"
  },
  {
    title: "Hype",
    artist: "Kontraa",
    src: "assets/music/Track_2.mp3",
    cover: "assets/images/Track_2.jpg"
  },
  {
    title: "The Last Point",
    artist: "Raspberrymusic",
    src: "assets/music/Track_3.mp3",
    cover: "assets/images/Track_3.jpg"
  },
  {
    title: "Groovy Vibe",
    artist: "Bransboynd",
    src: "assets/music/Track_4.mp3",
    cover: "assets/images/Track_4.jpg"
  },
  {
    title: "Jungle Waves",
    artist: "Dimmysad",
    src: "assets/music/Track_5.mp3",
    cover: "assets/images/Track_5.jpg"
  }
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const queueBtn = document.getElementById("queue-btn");

const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const volumeSlider = document.getElementById("volume-slider");

// playlist elements
const playlistEl = document.getElementById("playlist");
const playlistList = document.getElementById("playlist-list");

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  cover.src = track.cover;
  title.textContent = track.title;
  artist.textContent = track.artist;
  highlightCurrentInPlaylist();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playIcon.textContent = "pause";
  document.body.classList.add("playing");
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playIcon.textContent = "play_arrow";
  document.body.classList.remove("playing");
}

function togglePlay() {
  if (!audio.src) {
    loadTrack(currentIndex);
  }
  isPlaying ? pauseTrack() : playTrack();
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!duration) return;
  audio.currentTime = (clickX / width) * duration;
}

function nextTrack() {
  if (isShuffle) {
    let nextIndex = Math.floor(Math.random() * tracks.length);
    if (nextIndex === currentIndex && tracks.length > 1) {
      nextIndex = (nextIndex + 1) % tracks.length;
    }
    currentIndex = nextIndex;
  } else {
    currentIndex = (currentIndex + 1) % tracks.length;
  }
  loadTrack(currentIndex);
  if (isPlaying) playTrack();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  if (isPlaying) playTrack();
}

// build playlist UI
function buildPlaylist() {
  playlistList.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    li.innerHTML = `<span>${track.title}</span><span>${track.artist}</span>`;
    if (index === currentIndex) li.classList.add("active");
    playlistList.appendChild(li);
  });
}

function highlightCurrentInPlaylist() {
  if (!playlistList) return;
  [...playlistList.children].forEach(li => {
    li.classList.toggle("active", Number(li.dataset.index) === currentIndex);
  });
}

// Event listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("ended", nextTrack);

progressContainer.addEventListener("click", setProgress);

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// shuffle button with visible state
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// queue button: show/hide playlist
queueBtn.addEventListener("click", () => {
  playlistEl.classList.toggle("open");
});

// click on playlist item
playlistList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const index = Number(li.dataset.index);
  currentIndex = index;
  loadTrack(currentIndex);
  playTrack();
});

// Initial setup
audio.volume = volumeSlider.value;
buildPlaylist();
loadTrack(currentIndex);
