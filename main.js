/*
FUNCTION:
1. Render
2. Scroll top
3. Play / pause / seek
4. CD Rotate
5. Next / prev
6. Random
7. Next / repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'BENNN_playlist'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {

    currentIndex : 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    // Song playlist    
    songs: [
        {
          name: "Dreamless Drugs",
          singer: "Trammeo x Bennn x Cristian x Beaterondabeat",
          path: "./Tracks/dd.mp3",
          image: "https://i.scdn.co/image/ab67616d0000b2734749b79fceedf1488efe9d25"
        },
        {
          name: "Cánh én xa nhà",
          singer: "Trammeo x Bennn x Cristian",
          path: "./Tracks/cexn.mp3",
          image:
            "https://i.scdn.co/image/ab67616d0000b2736e298761ee6afa14f69f03ed"
        },
        {
          name: "Redamancy",
          singer: "Trammeo x Bennn x Cristian",
          path:
            "./Tracks/redamancy.mp3",
          image: "https://i.scdn.co/image/ab67616d0000b27337b9f5fc3100aa6dab0b5abc"
        },
        {
          name: "In The Night",
          singer: "Bennn x Cristian",
          path: "./Tracks/inthenight.mp3",
          image:
            "https://angartwork.akamaized.net/?id=132697964&size=640"
        },
        {
          name: "Hippu",
          singer: "Bennn",
          path:
            "./Tracks/hippu.mp3",
          image:
            "https://i.scdn.co/image/ab67616d0000b27370e8c95bc34d7e0525c59f27"
        },
        {
            name: "Fly Away",
            singer: "Bennn",
            path:
              "./Tracks/flyaway.mp3",
            image:
              "https://i.scdn.co/image/ab67616d0000b2734677c2dbbf5d567b4e66a2e7"
        },        
        {
            name: "Love Slaver",
            singer: "Bennn x Cristian",
            path:
              "./Tracks/loveslaver.mp3",
            image:
              "https://i.scdn.co/image/ab67616d0000b27367d62293378a75acd9a7c032"
        },
        {
            name: "Ego",
            singer: "Bennn x Cristian x Tranbato",
            path:
              "./Tracks/ego.mp3",
            image:
              "https://i1.sndcdn.com/artworks-JQZD6ry10eBRgJ9y-4Nnl5A-t240x240.jpg"
        },
        {
            name: "Cold kid",
            singer: "Bennn x Cristian",
            path:
              "./Tracks/coldkid.mp3",
            image:
              "https://i.scdn.co/image/ab67616d0000b27357c2bc3e02b0b37d892d7231"
        },         
        {
          name: "Sự phóng chiếu (The Projection)",
          singer: "Cristian x Bennn x Tranbato",
          path: "./Tracks/projection.mp3",
          image:
            "https://i.scdn.co/image/ab67616d0000b273dd89e0ebfe3237062448ba9d"
        }
    ], 

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    // Render the visual of the playlist
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        }) 
        playlist.innerHTML = htmls.join('')
      }, // Map the songs to the Document 
    
    // Define the properties for objects 
    defineProperties: function() { // gg syntax
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
      },
    
    // To listen / handle (process) events (DOM events)
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Rotate the CD / stop
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 seconds
            iterations: Infinity
        }) // Animate API
        cdThumbAnimate.pause()

        // Zoom in/out the CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop    
        
            // If the cd Width is > 0, take it! Otherwise, it gonna be 0
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0 
            // blur it down
            cd.style.opacity = newCDWidth / cdWidth
        }

        // Click play
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }    
        }

        // When song is played
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }

        // When song is paused
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }

        // When the time in the song change (progress)
        audio.ontimeupdate = function (){
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }    
        }

        // When user want to play at another time in song's duration
        progress.onchange = function (e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // When click the Previous button
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()            
        }

        // When click the Next button
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Random button (Turn on / off)
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom // when click, activate it from false to true
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Repeat a song similar like Random
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Switch to next song when the audio is ended
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            } else{ 
                nextBtn.click(); // Auto click on the next button
            }
        }

        // Listen to the behaviour of clicking on the playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active')
            // When click into the song
            if (songNode || e.target.closest('.option')) {
                // When click into the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                //When click into the options
                if (e.target.closest('.option')){

                }

            }
        }

    },
    
    scrollToActiveSong: function(){
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',

            })
        }, 500)
    },

    // Load current song' info into the UI when running the app
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdThumb, audio)
      },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        // Object.assign(this, this.config)
    },

    // Previous song
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1
        } // return the last element in the array
        this.loadCurrentSong()
    },

    // Next song
    nextSong: function(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Random button function
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length) 
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },


    // Running above functions
    start: function(){
        this.loadConfig()  // Assign configuration from config to application
        this.defineProperties() // Defines properties for the object
        this.handleEvents() // Listening / handling events (DOM events)
        this.loadCurrentSong() // Load the first song information into the UI when running the app
        this.render() // Render playlist

        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
      }

} // Functions in the app

app.start(); // Call the fuction to running all the functions of the application.