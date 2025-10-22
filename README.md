# 🌿 Soma — Feel Grounded Again
*A mindful somatic exercise app designed to help users reconnect with their bodies through simple, guided movements and awareness-based practices.*

---

## 🧘 About Soma
**Soma** was designed with one goal: to help people feel grounded again.  
Through short exercises and mood-based practices, users can release tension, improve focus, and rebuild a healthy connection between mind and body.

The UI is built to feel calm and welcoming — minimal, warm, and organic — staying true to the Figma prototype.

---

## 🎨 Design Philosophy
- **Minimal & Organic:** Inspired by nature and calm tones, Soma avoids clutter and distraction.  
- **Body Awareness First:** Progress is felt, not measured. Soma promotes embodied presence over productivity.  
- **Accessible & Gentle:** High-contrast text, soft visuals, and touch-friendly controls for all users.  
- **Figma-Driven Development:** Every screen mirrors the prototype created in Figma for consistent visuals.

---

## 🧩 Core Features
- 🧭 **Mood Check-In:** Select your mood and receive curated grounding practices.  
- 💨 **Somatic Exercises:** Simple, guided practices for breath, movement, and awareness.  
- 🗓️ **Mood Tracker Dashboard:** Visualize your daily and weekly patterns.  
- ⏱️ **Built-In Timer:** Keeps you present through timed practices.  
- 🧘 **Widget Support:** Reminds you gently to check in — "Is it Check-in Time?"

---

## ⚙️ Roadmap

### **Phase 1 — Setup & Layout (Current)**
- [x] Figma prototype completed  
- [x] GitHub repo created  
- [ ] Initialize Android build (React Native or Jetpack Compose)  
- [ ] Implement base navigation (Home, Dashboard, Exercises, Calendar)  
- [ ] Build static UI from Figma components  

### **Phase 2 — Functionality**
- [ ] Add local JSON for moods + exercises  
- [ ] Implement exercise timer logic  
- [ ] Add user state persistence (AsyncStorage or RoomDB)  
- [ ] Connect mood data to dashboard charts  

### **Phase 3 — Feedback & Experience**
- [ ] Add haptic + sound feedback for exercises  
- [ ] Enable favorites + history tracking  
- [ ] Enhance transitions between screens (fade or slide)  

### **Phase 4 — Future Expansion**
- [ ] Cloud sync for progress  
- [ ] Multi-language support  
- [ ] Publish Android Beta  

---

## 🧠 Tech Stack
| Layer | Tools |
|-------|-------|
| **Frontend** | React Native *(Expo)* or Jetpack Compose |
| **Storage** | JSON (local) → AsyncStorage → RoomDB/Firebase |
| **Design** | Figma, Adobe Illustrator |
| **AI Assist** | Codex for code generation + layout conversion |
| **Version Control** | Git + GitHub |

---

## 🗂️ Folder Structure (Planned)
Soma/ ├── assets/ # Logos, icons, patterns, gifs ├── src/ │ ├── screens/ # Home, Dashboard, Exercise, Calendar │ ├── components/ # Reusable UI (Buttons, MoodSelector, Timer) │ ├── data/ # Local JSON files for exercises/moods │ ├── hooks/ # Custom logic (timers, state) │ └── theme/ # Colors, fonts, styles ├── App.js └── README.md --- ## 🚀 Installation (for React Native)
bash
# Clone the repo
git clone https://github.com/<your-username>/Soma.git

# Navigate into project
cd Soma

# Install dependencies
npm install

# Start development
npx expo start

💡 Vision Statement

“Soma is for those who forget to breathe.
Each check-in is a small reminder: you’re here, and that’s enough.”

👩‍💻 Creator

Bea Smith
Visual Communication Designer @ Eastern Washington University
Exploring the fusion of design, technology, and emotional wellness.

📁 Resources

Figma UI Prototype

Moodboard & Concept
 (add link to Milanote or Notion later)
